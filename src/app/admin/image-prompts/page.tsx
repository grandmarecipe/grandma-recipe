import { redirect } from "next/navigation";

/** Image prompts live inside each article editor tab. */
export default function AdminImagePromptsRedirectPage() {
  redirect("/admin/");
}
