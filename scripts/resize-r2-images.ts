/**
 * Resize oversized images already stored on R2 (in-place, same key).
 *
 * Usage:
 *   npm run resize:r2
 *   npm run resize:r2 -- --dry-run
 *   npm run resize:r2 -- --limit=50
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getR2Config,
  getR2ObjectBuffer,
  listR2Keys,
  putR2Object,
} from "../src/lib/r2";
import { resizeStoredImageIfNeeded } from "../src/lib/r2-image-optimize";

const ROOT = process.cwd();
const PREFIX = "wp-content/uploads/";
const CONCURRENCY = Number(process.env.MEDIA_CONCURRENCY || 4);

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
    dryRun: process.argv.includes("--dry-run"),
  };
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

async function processKey(
  key: string,
  dryRun: boolean,
): Promise<"resize" | "skip" | "fail"> {
  try {
    const object = await getR2ObjectBuffer(key);
    if (!object) return "fail";

    const optimized = await resizeStoredImageIfNeeded(key, object.body);
    if (!optimized.changed) return "skip";

    if (!dryRun) {
      await putR2Object(key, optimized.buffer, optimized.contentType);
    }
    console.log(
      `${dryRun ? "WOULD RESIZE" : "RESIZED"} ${key} (${object.body.length} → ${optimized.buffer.length} bytes)`,
    );
    return "resize";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAIL ${key}\n  ${message}`);
    return "fail";
  }
}

async function main() {
  loadEnvLocal();
  const { limit, dryRun } = parseArgs();

  if (!getR2Config()) {
    throw new Error("R2_* env vars missing in .env.local");
  }

  let keys = (await listR2Keys(PREFIX)).filter((key) =>
    /\.(webp|jpe?g|png|avif)$/i.test(key),
  );
  if (limit) keys = keys.slice(0, limit);

  console.log(
    `${dryRun ? "Dry run —" : ""} checking ${keys.length} R2 images…`,
  );

  let resized = 0;
  let skipped = 0;
  let failed = 0;
  let done = 0;

  await mapPool(keys, CONCURRENCY, async (key) => {
    const result = await processKey(key, dryRun);
    done += 1;
    if (result === "resize") resized += 1;
    else if (result === "skip") skipped += 1;
    else failed += 1;
    if (done % 25 === 0 || done === keys.length) {
      console.log(
        `… ${done}/${keys.length} (resize ${resized}, skip ${skipped}, fail ${failed})`,
      );
    }
    return result;
  });

  console.log(
    `\nDone. resized=${resized} skipped=${skipped} failed=${failed}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
