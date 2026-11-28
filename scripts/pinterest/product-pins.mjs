#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {loadEnvLocal, parseArgs, getAccessToken, ROOT} from './lib.mjs';
import {createPinFromResolved} from './create-pin.mjs';
import {loadCandidates, selectCandidate, excludePostedProducts, loadRecipeAliases, localDay, pinMetadata, uploadText} from './product-pin-lib.mjs';

const directory = path.join(ROOT, 'pinterest-product-pins');
const json = (name, fallback) => fs.existsSync(path.join(directory, name)) ? JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')) : fallback;
const save = (name, data) => fs.writeFileSync(path.join(directory, name), JSON.stringify(data, null, 2) + '\n');

async function main() {
  loadEnvLocal();
  const args = parseArgs();
  const dryRun = !!args['dry-run'];
  if (args.day && !dryRun) throw new Error('--day is allowed only with --dry-run');
  const today = args.day || localDay();
  const settings = json('settings.json', {});
  if (!settings.enabled) { console.log('Product pin schedule is disabled.'); return; }
  const module = await import('../../src/lib/amazon-affiliates.ts');
  const affiliates = module.default || module;
  const current = loadCandidates(ROOT, affiliates.AMAZON_AFFILIATE_PRODUCTS, today);
  const posted = json('.posted.json', {pins: []});
  const byKey = new Map(current.map(item => [item.key, item]));
  const queue = json('queue.json', {items: []});
  // Ordinary recipe pins do not count as this product-in-use campaign.
  const eligible = () => excludePostedProducts(queue.items.map(item => byKey.get(item.key)).filter(Boolean), posted, loadRecipeAliases(ROOT));
  const prepared = items => items.filter(item => fs.existsSync(path.join(directory, item.key, 'product-pin.jpg')));
  const candidates = eligible();
  const ready = prepared(candidates);
  console.log(`Unposted product pins: ${candidates.length}; prepared images remaining: ${ready.length}.`);
  if (today < settings.startDate) { console.log(`Daily product queue starts ${settings.startDate}.`); return; }
  const item = selectCandidate(ready, posted, today);
  if (!item) { console.log('No product pin due: today is already posted or the prepared image queue needs replenishing.'); return; }
  const metadata = pinMetadata(item);
  if (dryRun) {
    console.log(JSON.stringify({day: today, eligibleRecipes: candidates.length, readyImages: ready.length, selected: {key: item.key, recipe: item.recipe.title, product: item.product.title, referenceImage: item.product.imageSrc}, metadata, imageSource: 'prepared-in-chat'}, null, 2));
    return;
  }
  // Confirm the product is still present on the published recipe before posting.
  const live = await fetch(metadata.link, {signal: AbortSignal.timeout(45000)});
  if (!live.ok || !(await live.text()).includes(item.product.affiliateUrl)) throw new Error('Selected product is not present on the live recipe; no pin created.');
  const pack = path.join(directory, item.key);
  const imageName = 'product-pin.jpg';
  const imageFile = path.join(pack, imageName);
  const info = await sharp(imageFile).metadata();
  if (info.width !== 1080 || info.height !== 1920) throw new Error('Pinterest image must be 1080x1920.');
  fs.writeFileSync(path.join(pack, 'UPLOAD.txt'), uploadText(metadata, imageName));
  const mirror = path.join(ROOT, 'public/pinterest-product-pins', item.key);
  fs.mkdirSync(mirror, {recursive: true});
  for (const file of ['UPLOAD.txt', imageName]) fs.copyFileSync(path.join(pack, file), path.join(mirror, file));
  await getAccessToken({refresh: true});
  const created = await createPinFromResolved({...metadata, localImage: imageFile});
  posted.pins.push({key: item.key, day: today, slug: item.slug, product: item.product.title, affiliateUrl: item.product.affiliateUrl, pinId: created.id, pinUrl: created.url, link: metadata.link, postedAt: new Date().toISOString()});
  save('.posted.json', posted);
  console.log(`Product pin published: ${created.url}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => {console.error(error.message); process.exitCode = 1;});
