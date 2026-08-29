import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

let cachedClient: S3Client | null = null;
let cachedConfig: R2Config | null = null;

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim() || "grandma-recipe-media";
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

function getR2Client(): { client: S3Client; config: R2Config } {
  const config = getR2Config();
  if (!config) {
    throw new Error("R2 is not configured (check R2_* env vars).");
  }
  if (
    !cachedClient ||
    cachedConfig?.accessKeyId !== config.accessKeyId ||
    cachedConfig?.secretAccessKey !== config.secretAccessKey ||
    cachedConfig?.accountId !== config.accountId
  ) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // R2 does not support the SDK's default request checksums (SigV4 mismatch).
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
    cachedConfig = config;
  }
  return { client: cachedClient, config };
}

/** S3/R2 user metadata must be US-ASCII and stay under ~2 KB total. */
export function sanitizeR2MetadataValue(value: string, max = 256): string {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function normalizeR2Metadata(
  metadata?: Record<string, string>,
): Record<string, string> | undefined {
  if (!metadata) return undefined;

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const safeKey = key.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const safeValue = sanitizeR2MetadataValue(value);
    if (safeKey && safeValue) out[safeKey] = safeValue;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** R2 object key for a site path like /wp-content/uploads/2025/05/foo.webp */
export function uploadsPathToR2Key(uploadPath: string): string {
  const normalized = uploadPath.replace(/^\/+/, "");
  if (normalized.startsWith("wp-content/uploads/")) return normalized;
  return `wp-content/uploads/${normalized}`;
}

export async function r2ObjectExists(key: string): Promise<boolean> {
  const { client, config } = getR2Client();
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: config.bucket, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function getR2ObjectBuffer(
  key: string,
): Promise<{ body: Buffer; contentType?: string } | null> {
  const { client, config } = getR2Client();
  try {
    const result = await client.send(
      new GetObjectCommand({ Bucket: config.bucket, Key: key }),
    );
    if (!result.Body) return null;
    const body = Buffer.from(await result.Body.transformToByteArray());
    return { body, contentType: result.ContentType };
  } catch {
    return null;
  }
}

export async function listR2Keys(prefix: string): Promise<string[]> {
  const { client, config } = getR2Client();
  const keys: string[] = [];
  let token: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const item of page.Contents ?? []) {
      if (item.Key) keys.push(item.Key);
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);

  return keys;
}

export async function getR2Object(key: string): Promise<{
  body: ReadableStream<Uint8Array>;
  contentType?: string;
  contentLength?: number;
} | null> {
  const { client, config } = getR2Client();
  try {
    const result = await client.send(
      new GetObjectCommand({ Bucket: config.bucket, Key: key }),
    );
    if (!result.Body) return null;
    const body = result.Body.transformToWebStream();
    return {
      body,
      contentType: result.ContentType,
      contentLength: result.ContentLength,
    };
  } catch {
    return null;
  }
}

export async function putR2Object(
  key: string,
  body: Buffer | Uint8Array,
  contentType?: string,
  metadata?: Record<string, string>,
): Promise<void> {
  const { client, config } = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: normalizeR2Metadata(metadata),
    }),
  );
}

const EXT_MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export function mimeFromKey(key: string): string | undefined {
  const ext = key.slice(key.lastIndexOf(".")).toLowerCase();
  return EXT_MIME[ext];
}
