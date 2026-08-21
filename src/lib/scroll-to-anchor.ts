export function getStickyScrollOffset(): number {
  const header = document.querySelector("header");
  const jumpBar = document.querySelector("[data-recipe-jump-bar]");
  let offset = 16;

  if (header) {
    offset += header.getBoundingClientRect().height;
  }

  if (jumpBar) {
    offset += jumpBar.getBoundingClientRect().height;
  }

  return offset;
}

export function scrollToAnchor(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const offset = getStickyScrollOffset();
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
}
