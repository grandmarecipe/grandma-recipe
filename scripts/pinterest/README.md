# Pinterest publish helper (Grandma Recipe)

Same flow as Viral Peptides: pin packs in the repo + OAuth token + GitHub Actions.

## How it works

1. Each recipe/pillar gets a pack: `pinterest-pins/<slug>/UPLOAD.txt` + pin image (`.jpg` / `.png`)
2. Pin images must be **9:16 portrait** (e.g. 1080×1920), not 16:9 landscape
3. Mirror under `public/pinterest-pins/<slug>/` so the image is publicly reachable if needed
4. On push to `main` (or daily catch-up cron), `auto-pin.mjs` creates pins via Pinterest API v5
5. Posted pins are recorded in `pinterest-pins/.posted.json`

## Trial vs Standard access

**Trial access cannot create production pins.** API returns:

`Apps with Trial access may not create Pins in production`

Upgrade to **Standard access** (same as Viral Peptides) before real publishing:

1. [My apps](https://developers.pinterest.com/apps/) → **Upgrade** on the app card
2. Confirm use case + privacy policy
3. Upload a short screen recording of OAuth + a pin API call (terminal/`npm run pinterest:pin` is accepted)
4. Submit and wait for email approval

Until Standard is approved, keep building packs locally; auto-pin will work once the app is upgraded.

## One-time setup

1. Open your Pinterest app (app id `1621465`) with `pins:write` / `boards:write` scopes.
2. Under **Redirect URIs**, add exactly:
   ```
   http://localhost:3456/callback
   ```
3. Put secrets in `.env.local` (never commit):
   ```
   PINTEREST_APP_ID=1621465
   PINTEREST_APP_SECRET=your_app_secret
   PINTEREST_DEFAULT_BOARD_ID=1137229412095780951
   NEXT_PUBLIC_SITE_URL=https://www.grandmarecipe.com
   ```
4. Connect OAuth (opens browser — do **not** use the console “Generate token” button; that is read-only):
   ```bash
   npm run pinterest:oauth
   ```
   Approve: `boards:read`, `boards:write`, `pins:read`, `pins:write`.  
   Token saves to `.pinterest-token.json` (gitignored).

5. List boards and copy IDs into packs / `.env.local`:
   ```bash
   npm run pinterest:boards
   ```

6. Add **GitHub repo secrets** (Settings → Secrets → Actions):

   | Secret | Value |
   |--------|--------|
   | `PINTEREST_APP_ID` | from `.env.local` |
   | `PINTEREST_APP_SECRET` | from `.env.local` |
   | `PINTEREST_ACCESS_TOKEN` | `access_token` from `.pinterest-token.json` |
   | `PINTEREST_REFRESH_TOKEN` | `refresh_token` from `.pinterest-token.json` |
   | `PINTEREST_DEFAULT_BOARD_ID` | optional fallback board |

## Pack format (`UPLOAD.txt`)

```
BOARD
Dinner Recipes

BOARD_ID
1234567890

IMAGE FILE
egg-recipes-pin.jpg

TITLE
Easy Egg Recipes for Breakfast and Brunch

DESCRIPTION
Easy egg recipes for busy mornings and potluck tables.

This pin covers:
- Breakfast bakes and muffins
- Quiche and omelettes
- Egg salad and party eggs

Get the full recipe on Grandma Recipe.

DESTINATION LINK
https://www.grandmarecipe.com/egg-recipes/

ALT TEXT
Homestyle egg recipes spread with baked eggs, quiche, and muffins
```

Rules:

- `DESTINATION LINK` must be `https://www.grandmarecipe.com/<slug>/`
- End `DESCRIPTION` with exactly: `Get the full recipe on Grandma Recipe.`
- Do **not** put the recipe URL in the description (destination link field carries it)
- No pork / no alcohol content on pins
- Em dashes (`—`) banned; use commas instead

## Commands

```bash
npm run pinterest:oauth
npm run pinterest:boards
npm run pinterest:pin -- --pack=pinterest-pins/egg-recipes --dry-run
npm run pinterest:pin -- --pack=pinterest-pins/egg-recipes
npm run pinterest:auto -- --dry-run
npm run pinterest:auto -- --catch-up --only-today
```

## Automatic pin on publish

Workflow: `.github/workflows/pinterest-auto-pin.yml`

- **Push to `main`** when packs change: pins new (non-backlog) packs for live recipes
- **Daily crons 08:00 and 10:00 UTC** (9:00 and 11:00 local UTC+1): 1 catch-up pin each (2/day)
- **Manual** “Run workflow” with mode `publish` or `catch-up`
- Catch-up backlog lives in `pinterest-pins/backlog.json` (`scheduleDate` + `pinsPerDay`)

## Daily Amazon product-in-use pins

The user requested one daily product-in-use pin, including older recipes that already had ordinary recipe pins. The approved brownie sample is live at https://www.pinterest.com/pin/1137229343447595240/.

- Workflow: .github/workflows/pinterest-product-pins.yml, daily at 13:17 Africa/Casablanca. GitHub may start scheduled jobs later.
- Images are generated HERE with the built-in generator and the exact product photo as a reference, then saved as 1080x1920 JPGs. The scheduled job ONLY posts prepared images. There is no paid image API, image-generation service or new API secret.
- The title and image connect the product to the recipe. Descriptions include #ad, an affiliate disclosure and the standard recipe CTA; destinations stay recipe pages. Images carry an AI-generated illustration label.
- Ordered inventory: pinterest-product-pins/queue.json. The runner rechecks current affiliate mappings and the product posted log. Ordinary recipe pin history does not exclude a new product-in-use pin. Recipe/product pairs already posted in this campaign are skipped, including renamed URLs. The live-account history snapshot remains available for audits.
- Ready packs: pinterest-product-pins/<key>/product-pin.jpg, UPLOAD.txt and prompt.txt. Public mirrors live under public/pinterest-product-pins/<key>/. Only entries with a prepared image can be posted.
- Each Casablanca calendar day allows one product pin. Duplicate recipe/product pairs are blocked. Original publish-on-release and old-recipe catch-up schedules remain intact.
- Remaining ready images are logged on every run. Prepare another batch here before the ready queue runs out; pending-image inventory does not generate itself.
- Prepare new images in batches of 30. On November 28 the user authorized all 30 existing product drafts in addition to the four queued pins, for 34 upcoming daily product pins.

Preview without posting:

    node --import tsx scripts/pinterest/product-pins.mjs --dry-run --day=2026-11-29
    node --test scripts/pinterest/product-pin-lib.test.mjs

The --day override is accepted only for dry runs.
