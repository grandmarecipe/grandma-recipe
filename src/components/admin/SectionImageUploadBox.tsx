"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAdminAuth } from "./AdminProviders";
import type { ImageAssetRecord } from "@/lib/image-prompt-types";
import {
  buildRecipeImageProcessingPlan,
  type RecipeImageMetadata,
  type RecipeImageProcessingPlan,
  type RecipeImageSection,
} from "@/lib/recipe-image-upload";

type UploadResult = {
  publicPath: string;
  r2Key: string;
  filename?: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  metadata: RecipeImageMetadata;
};

export function SectionImageUploadBox({
  section,
  slug,
  focusKeyword,
  articleId,
  metadata,
  savedAsset,
  onUploaded,
  onInsert,
}: {
  section: RecipeImageSection;
  slug: string;
  focusKeyword: string;
  articleId?: Id<"articles">;
  metadata: RecipeImageMetadata;
  savedAsset?: ImageAssetRecord | null;
  onUploaded?: (asset: ImageAssetRecord) => void;
  onInsert?: (asset: ImageAssetRecord) => void | Promise<void>;
}) {
  const { token } = useAdminAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [asset, setAsset] = useState<ImageAssetRecord | null>(savedAsset ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [inserting, setInserting] = useState(false);

  const processingPlan = useMemo(() => {
    if (!file) return null;
    return buildRecipeImageProcessingPlan({
      section,
      metadata,
      focusKeyword,
      slug,
      file: { name: file.name, type: file.type, size: file.size },
    });
  }, [file, section, metadata, focusKeyword, slug]);

  useEffect(() => {
    if (savedAsset) setAsset(savedAsset);
  }, [savedAsset]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onFileChange(next: File | null) {
    setFile(next);
    setError(null);
    setStatus(null);
    setUploadComplete(false);
  }

  async function sendToR2() {
    if (!token || !file) return;

    setBusy(true);
    setError(null);
    setStatus("Converting to WebP and uploading to R2…");

    try {
      const form = new FormData();
      form.append("token", token);
      form.append("section", section);
      form.append("slug", slug);
      form.append("focusKeyword", focusKeyword);
      form.append("alt", metadata.alt);
      form.append("title", metadata.title);
      form.append("caption", metadata.caption);
      form.append("description", metadata.description);
      form.append("file", file);
      if (articleId) form.append("articleId", articleId);

      const response = await fetch("/api/admin/upload-recipe-image-r2/", {
        method: "POST",
        body: form,
      });

      const payload = (await response.json()) as UploadResult & { error?: string };
      if (!response.ok || !payload.publicPath) {
        throw new Error(payload.error || "Upload failed.");
      }

      const record: ImageAssetRecord = {
        publicPath: payload.publicPath,
        r2Key: payload.r2Key,
        alt: payload.metadata.alt,
        title: payload.metadata.title,
        caption: payload.metadata.caption,
        description: payload.metadata.description,
        uploadedAt: payload.uploadedAt,
        width: payload.width,
        height: payload.height,
      };

      setAsset(record);
      onUploaded?.(record);
      setUploadComplete(true);
      setStatus(
        payload.filename
          ? `Saved as ${payload.filename} on R2. Use the link below or insert into the article.`
          : "Uploaded to R2. Use the link below or insert into the article.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleInsert() {
    if (!onInsert || !asset) return;
    setInserting(true);
    setError(null);
    try {
      await onInsert(asset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Insert failed.");
    } finally {
      setInserting(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
      <div>
        <h4 className="font-semibold text-[#8b1a1a]">Upload generated image</h4>
        <p className="mt-1 text-sm text-[#6b5b4f]">
          Pick your AI image, review the planned changes, then send to R2.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />

      {previewUrl && processingPlan ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Upload preview"
            className="max-h-72 w-full rounded-xl object-contain bg-white lg:max-h-none lg:min-h-[280px]"
          />
          <ImageProcessingPreview plan={processingPlan} pending={!uploadComplete} />
        </div>
      ) : null}

      <button
        type="button"
        disabled={!file || busy}
        onClick={() => void sendToR2()}
        className="rounded-full bg-[#5a822b] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Uploading…" : "Send to R2"}
      </button>

      {!articleId ? (
        <p className="text-xs text-amber-800">
          Save the article first so the uploaded image link is stored on it.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="rounded-lg border border-[#e5d8c8] bg-white px-3 py-2 text-sm text-[#6b5b4f]">
          {status}
        </p>
      ) : null}

      {asset ? (
        <div className="space-y-3 rounded-lg border border-[#e5d8c8] bg-white p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b5b4f]">
              Public URL
            </p>
            <p className="mt-1 break-all font-mono text-sm text-[#2c241b]">
              {asset.publicPath}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.publicPath}
            alt={asset.alt || "Uploaded recipe image"}
            className="max-h-56 w-full rounded-xl object-contain bg-[#f7f1e8]"
          />
          <div className="flex flex-wrap gap-2">
            <CopyTextButton label="Copy URL" text={asset.publicPath} />
            {onInsert ? (
              <button
                type="button"
                disabled={inserting}
                onClick={() => void handleInsert()}
                className="rounded-full border border-[#8b1a1a] px-4 py-2 text-sm font-semibold text-[#8b1a1a] disabled:opacity-60"
              >
                {inserting ? "Saving…" : "Insert into article"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImageProcessingPreview({
  plan,
  pending,
}: {
  plan: RecipeImageProcessingPlan;
  pending: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[#e5d8c8] bg-white p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <h5 className="font-semibold text-[#8b1a1a]">
          {pending ? "Planned changes" : "Applied on upload"}
        </h5>
        {pending ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
            Not uploaded yet
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900">
            Done
          </span>
        )}
      </div>

      {plan.warnings.length > 0 ? (
        <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {plan.warnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      ) : null}

      <PreviewSection title="File">
        <PreviewRow label="Original" value={plan.originalFilename} />
        <PreviewRow
          label="Original type"
          value={`${plan.originalType} · ${formatFileSize(plan.originalSizeBytes)}`}
        />
        <PreviewCheck label="Convert to WebP" />
        <PreviewRow
          label="Max width"
          value={`${plan.outputMaxWidth}px (height scales down)`}
        />
        <PreviewRow label="New filename" value={plan.outputFilename} mono />
        <PreviewRow label="R2 path" value={plan.outputPublicPath} mono />
      </PreviewSection>

      <PreviewSection title="EXIF — remove">
        {plan.exifRemoved.map((item) => (
          <PreviewCheck key={item} label={item} />
        ))}
      </PreviewSection>

      <PreviewSection title="EXIF — add">
        {plan.exifAdded.map(({ label, value }) => (
          <PreviewRow key={label} label={label} value={value} />
        ))}
      </PreviewSection>

      <PreviewSection title="R2 object metadata">
        {plan.r2Metadata.map(({ label, value }) => (
          <PreviewRow key={label} label={label} value={value} />
        ))}
      </PreviewSection>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5 border-t border-[#f0e6d8] pt-3 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b5b4f]">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function PreviewCheck({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2 text-[#2c241b]">
      <span className="mt-0.5 shrink-0 text-green-700" aria-hidden>
        ✓
      </span>
      <span>{label}</span>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-[#2c241b]">
      <span className="mt-0.5 shrink-0 text-green-700" aria-hidden>
        ✓
      </span>
      <div className="min-w-0">
        <span className="font-medium text-[#6b5b4f]">{label}: </span>
        <span className={mono ? "break-all font-mono text-xs" : ""}>{value}</span>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CopyTextButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded-full border border-[#d4a574] px-3 py-1.5 text-sm font-semibold text-[#b8860b]"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
