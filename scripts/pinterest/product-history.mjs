import {BOARDS} from './product-pin-lib.mjs';

// Retain observed recipes even if somebody later deletes a pin from Pinterest.
export async function refreshProductHistory(pinterestFetch, previous = {pins: []}) {
  const pins = new Map((previous.pins || []).map(pin => [pin.link, pin]));
  for (const [, boardId] of Object.values(BOARDS)) {
    let bookmark;
    const seen = new Set();
    do {
      const page = await pinterestFetch(`/boards/${boardId}/pins?page_size=100${bookmark ? '&bookmark=' + encodeURIComponent(bookmark) : ''}`);
      if (!Array.isArray(page.items)) throw new Error('Pinterest history response is missing pins; no pin created.');
      for (const pin of page.items) {
        try {
          if (new URL(pin.link).hostname.replace(/^www\./, '') === 'grandmarecipe.com') pins.set(pin.link, {id: pin.id, link: pin.link, boardId});
        } catch { /* Ignore pins without a recipe destination. */ }
      }
      bookmark = page.bookmark;
      if (bookmark && seen.has(bookmark)) throw new Error('Pinterest history pagination repeated; no pin created.');
      if (bookmark) seen.add(bookmark);
    } while (bookmark);
  }
  return {checkedAt: new Date().toISOString(), boardCount: Object.keys(BOARDS).length, pins: [...pins.values()]};
}
