import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {localDay, productKey, selectCandidate, excludePreviouslyPosted, excludePostedProducts, loadCandidates, loadRecipeAliases, pinMetadata, imagePrompt} from './product-pin-lib.mjs';
import {refreshProductHistory} from './product-history.mjs';

test('daily limits follow Casablanca dates at midnight', () => {
  assert.equal(localDay(new Date('2026-11-28T23:30:00Z')), '2026-11-29');
});
test('a posted product pin blocks another that day, while old recipe pins do not', () => {
  const candidates = [{key: 'a'}, {key: 'b'}];
  assert.equal(selectCandidate(candidates, {pins: [{key: 'a', day: '2026-11-28'}]}, '2026-11-28'), null);
  assert.deepEqual(selectCandidate(candidates, {pins: [{key: 'a', day: '2026-11-28'}]}, '2026-11-29'), {key: 'b'});
  assert.deepEqual(selectCandidate(candidates, {pins: [{link: 'old-recipe-pin'}]}, '2026-11-29'), {key: 'a'});
});
test('campaign identity changes with product, not copy edits', () => {
  assert.equal(productKey('brownies', 'https://link.amazon/a'), productKey('brownies', 'https://link.amazon/a'));
  assert.notEqual(productKey('brownies', 'https://link.amazon/a'), productKey('brownies', 'https://link.amazon/b'));
});
test('product pins allow previously pinned recipes but block repeat product campaigns, including renamed URLs', () => {
  const candidate = (slug, url) => ({slug, key: productKey(slug, url), product: {affiliateUrl: url}});
  const items = [candidate('ginger-ale-bread', 'https://link.amazon/pan'), candidate('ginger-ale-bread', 'https://link.amazon/mixer'), candidate('beans', 'https://link.amazon/pot')];
  assert.deepEqual(excludePostedProducts(items, {pins: []}), items);
  const posted = {pins: [{slug: 'beer-bread', affiliateUrl: 'https://link.amazon/pan'}, {key: items[2].key}]};
  assert.deepEqual(excludePostedProducts(items, posted, {'beer-bread': 'ginger-ale-bread'}), [items[1]]);
});
test('recipes already pinned by either workflow are excluded, including URL-only receipts', () => {
  const candidates = [{key: 'a', slug: 'brownies'}, {key: 'b', slug: 'beans'}, {key: 'c', slug: 'salmon'}];
  const old = {pins: [{link: 'https://www.grandmarecipe.com/brownies/'}]};
  const product = {pins: [{slug: 'beans', key: 'older-product-key'}]};
  assert.deepEqual(excludePreviouslyPosted(candidates, old, product), [{key: 'c', slug: 'salmon'}]);
});
test('renamed recipes are excluded when their former URLs were pinned', () => {
  const items = [{slug: 'ginger-ale-bread'}, {slug: 'seaweed-salad'}];
  const history = {pins: [{link: 'https://www.grandmarecipe.com/beer-bread/'}]};
  assert.deepEqual(excludePreviouslyPosted(items, history, {pins: []}, {'beer-bread': 'ginger-ale-bread'}), [{slug: 'seaweed-salad'}]);
});
test('project redirects are recognized as the same recipe', () => {
  const aliases = loadRecipeAliases(fileURLToPath(new URL('../../', import.meta.url)));
  assert.equal(aliases['beer-bread'], 'ginger-ale-bread');
  assert.equal(aliases['hawaiian-ham'], 'pineapple-glazed-turkey');
});
test('live history follows every page and keeps previously observed recipe URLs', async () => {
  const paths = [];
  const history = await refreshProductHistory(async path => {
    paths.push(path);
    return paths.length === 1 ? {items: [{id:'1',link:'https://www.grandmarecipe.com/beans/'}],bookmark:'next page'} : {items: [{id:'2',link:'https://www.grandmarecipe.com/salmon/'}, {id:'other',link:'https://example.com/not-a-recipe/'}]};
  }, {pins: [{id:'old',link:'https://www.grandmarecipe.com/old-recipe/'}]});
  assert.equal(paths.length, 6);
  assert(paths[1].includes('bookmark=next%20page'));
  assert.equal(history.pins.length, 3);
});
test('catalog excludes future recipes, unsuitable ingredients, hubs and missing product photos', () => {
  const root = mkdtempSync(join(tmpdir(), 'pinterest-products-'));
  try {
    mkdirSync(join(root, 'content/recipes'), {recursive: true});
    mkdirSync(join(root, 'public/affiliates'), {recursive: true});
    writeFileSync(join(root, 'public/affiliates/pan.jpg'), 'fixture');
    const recipe = {title: 'Brownies', category: 'dessert', ingredients: ['cocoa'], instructions: ['Bake in the pan.'], publishedAt: '2026-11-01'};
    for (const [slug, extra] of Object.entries({brownies: {}, future: {publishedAt: '2027-01-01'}, unsuitable: {ingredients: ['bacon']}, hub: {ingredients: []}, missing: {}})) writeFileSync(join(root, 'content/recipes', slug + '.json'), JSON.stringify({...recipe, ...extra}));
    const product = {title: 'Square pan', imageSrc: '/affiliates/pan.jpg', affiliateUrl: 'https://link.amazon/a', recipeSlugs: ['brownies', 'future', 'unsuitable', 'hub']};
    const candidates = loadCandidates(root, [product, {...product, recipeSlugs: ['missing'], imageSrc: '/affiliates/missing.jpg'}], '2026-11-28');
    assert.deepEqual(candidates.map(item => item.slug), ['brownies']);
    const meta = pinMetadata(candidates[0]);
    assert(meta.title.length <= 100);
    assert(meta.description.length <= 500);
    assert(meta.description.startsWith('#ad'));
    assert(meta.description.endsWith('Get the full recipe on Grandma Recipe.'));
    assert.equal(meta.link, 'https://www.grandmarecipe.com/brownies/');
    assert.equal(meta.boardId, '1137229412095780952');
    assert(imagePrompt(candidates[0]).includes('EXACT featured product'));
  } finally {rmSync(root, {recursive: true, force: true});}
});
