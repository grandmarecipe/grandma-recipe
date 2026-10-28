import { redirect } from "next/navigation";

/** Dashboard lives at /admin/home/ — avoids a poisoned /admin/ redirect cache
 *  in Cursor Simple Browser (ERR_TOO_MANY_REDIRECTS). */
export default function AdminIndexPage() {
  redirect("/admin/home/");
}
