/**
 * Download WordPress media from the old Hostinger host into public/,
 * then rewrite absolute WP URLs to same-origin /wp-content/uploads/ paths.
 *
 * Usage:
 *   npx tsx scripts/migrate-media.ts
 *   npx tsx scripts/migrate-media.ts --rewrite-only
 *   npx tsx scripts/migrate-media.ts --download-only
 */
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const PUBLIC_ROOT = join(ROOT, "public");
const OLD_HOST_IP = process.env.WP_MEDIA_IP || "72.60.93.62";
const ORIGIN = "https://www.grandmarecipe.com";
const ABSOLUTE_PREFIXES = [
  "https://www.grandmarecipe.com/wp-content/uploads/",
  "https://grandmarecipe.com/wp-content/uploads/",
  "http://www.grandmarecipe.com/wp-content/uploads/",
  "http://grandmarecipe.com/wp-content/uploads/",
];
const URL_RE =
  /(?:https?:\/\/(?:www\.)?grandmarecipe\.com)?\/wp-content\/uploads\/[^\s"'\\<>)]+\.(?:webp|jpg|jpeg|png|gif|svg)/gi;

const CONCURRENCY = Number(process.env.MEDIA_CONCURRENCY || 8);
const args = new Set(process.argv.slice(2));
const rewriteOnly = args.has("--rewrite-only");
const downloadOnly = args.has("--download-only");

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
  const roots = [
    join(ROOT, "content"),
    join(ROOT, "src"),
    join(ROOT, "public"),
  ];
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

function toRelativePath(url: string): string {
  const u = new URL(url);
  return decodeURIComponent(u.pathname);
}

async function downloadOne(url: string): Promise<"ok" | "skip" | "fail"> {
  const dest = urlToPublicPath(url);
  if (existsSync(dest) && statSync(dest).size > 0) return "skip";

  mkdirSync(dirname(dest), { recursive: true });
  const tmp = `${dest}.${createHash("md5").update(url).digest("hex").slice(0, 8)}.part`;

  try {
    await execFileAsync(
      "curl",
      [
        "-skfL",
        "--resolve",
        `www.grandmarecipe.com:443:${OLD_HOST_IP}`,
        "--resolve",
        `grandmarecipe.com:443:${OLD_HOST_IP}`,
        "-A",
        "Mozilla/5.0 (compatible; GrandmaRecipeMediaMigrate/1.0)",
        "--max-time",
        "60",
        "-o",
        tmp,
        url.replace("http://", "https://").replace(
          "://grandmarecipe.com/",
          "://www.grandmarecipe.com/",
        ),
      ],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    const size = statSync(tmp).size;
    if (size < 100) {
      throw new Error(`tiny response (${size} bytes)`);
    }
    await execFileAsync("mv", [tmp, dest]);
    return "ok";
  } catch (error) {
    try {
      if (existsSync(tmp)) await execFileAsync("rm", ["-f", tmp]);
    } catch {
      // ignore cleanup errors
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAIL ${url}\n  ${message}`);
    return "fail";
  }
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => run()),
  );
  return results;
}

function rewriteText(text: string): string {
  let out = text;
  for (const prefix of ABSOLUTE_PREFIXES) {
    out = out.split(prefix).join("/wp-content/uploads/");
  }
  return out;
}

function rewriteFiles(): number {
  const roots = [join(ROOT, "content"), join(ROOT, "src")];
  let changed = 0;

  for (const root of roots) {
    for (const file of walkFiles(root)) {
      const ext = extname(file).toLowerCase();
      if (![".json", ".ts", ".tsx", ".css", ".md", ".html", ".txt"].includes(ext)) {
        continue;
      }
      const before = readFileSync(file, "utf8");
      const after = rewriteText(before);
      if (after !== before) {
        writeFileSync(file, after);
        changed += 1;
        console.log(`rewrote ${relative(ROOT, file)}`);
      }
    }
  }

  return changed;
}

async function main() {
  const urls = collectUrls();
  console.log(`Found ${urls.length} unique media URLs`);

  if (!rewriteOnly) {
    let ok = 0;
    let skip = 0;
    let fail = 0;
    let done = 0;

    await mapPool(urls, CONCURRENCY, async (url) => {
      const result = await downloadOne(url);
      done += 1;
      if (result === "ok") ok += 1;
      else if (result === "skip") skip += 1;
      else fail += 1;
      if (done % 25 === 0 || done === urls.length) {
        console.log(`progress ${done}/${urls.length} (ok=${ok} skip=${skip} fail=${fail})`);
      }
      return result;
    });

    console.log(`Download done: ok=${ok} skip=${skip} fail=${fail}`);
  }

  if (!downloadOnly) {
    const changed = rewriteFiles();
    console.log(`Rewrote ${changed} files to /wp-content/uploads/ paths`);
  }

  // Keep SITE / schema URLs absolute where needed by rebuilding from relative later.
  console.log("Sample local paths:");
  for (const url of urls.slice(0, 5)) {
    console.log(`  ${toRelativePath(url)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
