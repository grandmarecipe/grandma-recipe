import { Suspense } from "react";
import { GenerateArticleForm } from "@/components/admin/GenerateArticleForm";

export default function AdminGeneratePage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-[#6b5b4f]">Loading generate form…</p>
      }
    >
      <GenerateArticleForm />
    </Suspense>
  );
}
