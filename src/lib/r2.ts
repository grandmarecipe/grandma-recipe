import {
  GetObjectCommand,
  HeadObjectCommand,
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
    cachedConfig?.accountId !== config.accountId
  ) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    cachedConfig = config;
  }
  return { client: cachedClient, config };
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
): Promise<void> {
  const { client, config } = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
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
