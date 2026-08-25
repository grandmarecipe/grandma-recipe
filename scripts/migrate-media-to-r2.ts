/**
 * Upload recipe media to Cloudflare R2 (same keys as /wp-content/uploads/...).
 * Public URLs stay unchanged — the Next.js proxy reads from R2.
 *
 * Usage:
 *   npx tsx scripts/migrate-media-to-r2.ts
 *   npx tsx scripts/migrate-media-to-r2.ts --limit=20
 *   npx tsx scripts/migrate-media-to-r2.ts --from-public-only
 */
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { promisify } from "node:util";
import {
  getR2Config,
  mimeFromKey,
  putR2Object,
  r2ObjectExists,
  uploadsPathToR2Key,
} from "../src/lib/r2";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const PUBLIC_ROOT = join(ROOT, "public");
const OLD_HOST_IP = process.env.WP_MEDIA_IP || "72.60.93.62";
const ORIGIN = "https://www.grandmarecipe.com";
const URL_RE =
  /(?:https?:\/\/(?:www\.)?grandmarecipe\.com)?\/wp-content\/uploads\/[^\s"'\\<>)]+\.(?:webp|jpg|jpeg|png|gif|svg|avif)/gi;

const CONCURRENCY = Number(process.env.MEDIA_CONCURRENCY || 6);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  return {
    limit: Number.isFinite(limit) && (limit as number) > 0 ? limit : undefined,
    fromPublicOnly: process.argv.includes("--from-public-only"),
  };
}

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function collectUrls(): string[] {
  const roots = [join(ROOT, "content"), join(ROOT, "src"), join(ROOT, "public")];
  const found = new Set<string>();

  for (const root of roots) {
    for (const file of walkFiles(root)) {
      const ext = extname(file).toLowerCase();
      if (![".json", ".ts", ".tsx", ".css", ".md", ".html", ".txt"].includes(ext)) {
        continue;
      }
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(URL_RE)) {
        const cleaned = match[0].replace(/[),.;]+$/, "");
        const absolute = cleaned.startsWith("http")
          ? cleaned
          : `${ORIGIN}${cleaned}`;
        found.add(absolute);
      }
    }
  }

  return [...found].sort();
}

function urlToPublicPath(url: string): string {
  const u = new URL(url);
  return join(PUBLIC_ROOT, decodeURIComponent(u.pathname.replace(/^\//, "")));
}

function urlToR2Key(url: string): string {
  const u = new URL(url);
  return uploadsPathToR2Key(decodeURIComponent(u.pathname.replace(/^\//, "")));
}

async function downloadToBuffer(url: string): Promise<Buffer> {
  const tmp = join(
    ROOT,
    ".tmp",
    `r2-${createHash("md5").update(url).digest("hex")}.part`,
  );
  const { mkdirSync } = await import("node:fs");
  mkdirSync(dirname(tmp), { recursive: true });

  await execFileAsync(
    "curl",
    [
      "-skfL",
      "--resolve",
      `www.grandmarecipe.com:443:${OLD_HOST_IP}`,
      "--resolve",
      `grandmarecipe.com:443:${OLD_HOST_IP}`,
      "-A",
      "Mozilla/5.0 (compatible; GrandmaRecipeR2Migrate/1.0)",
      "--max-time",
      "90",
      "-o",
      tmp,
      url.replace("http://", "https://").replace(
        "://grandmarecipe.com/",
        "://www.grandmarecipe.com/",
      ),
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );

  const data = readFileSync(tmp);
  if (data.length < 100) throw new Error(`tiny response (${data.length} bytes)`);
  return data;
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => run()),
  );
  return results;
}

async function uploadOne(
  url: string,
  fromPublicOnly: boolean,
): Promise<"upload" | "skip" | "fail"> {
  const key = urlToR2Key(url);
  try {
    if (await r2ObjectExists(key)) return "skip";

    const localPath = urlToPublicPath(url);
    let body: Buffer;

    if (existsSync(localPath) && statSync(localPath).size > 100) {
      body = readFileSync(localPath);
    } else if (fromPublicOnly) {
      return "fail";
    } else {
      body = await downloadToBuffer(url);
    }

    await putR2Object(key, body, mimeFromKey(key));
    return "upload";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAIL ${relative(ROOT, key)}\n  ${message}`);
    return "fail";
  }
}

async function main() {
  loadEnvLocal();
  const { limit, fromPublicOnly } = parseArgs();

  if (!getR2Config()) {
    throw new Error("R2_* env vars missing in .env.local");
  }

  let urls = collectUrls();
  if (limit) urls = urls.slice(0, limit);
  console.log(`Uploading ${urls.length} files to R2…`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let done = 0;

  await mapPool(urls, CONCURRENCY, async (url) => {
    const result = await uploadOne(url, fromPublicOnly);
    done += 1;
    if (result === "upload") uploaded += 1;
    else if (result === "skip") skipped += 1;
    else failed += 1;
    if (done % 25 === 0 || done === urls.length) {
      console.log(
        `… ${done}/${urls.length} (upload ${uploaded}, skip ${skipped}, fail ${failed})`,
      );
    }
    return result;
  });

  console.log(
    `\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
