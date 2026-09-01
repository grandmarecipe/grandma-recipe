/** Google Tag Manager container ID, e.g. GTM-XXXXXXX */
export function getGtmId(): string | null {
  const id = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!id || !/^GTM-[A-Z0-9]+$/i.test(id)) return null;
  return id.toUpperCase();
}
