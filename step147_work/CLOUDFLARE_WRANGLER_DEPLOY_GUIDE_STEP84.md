# TOP ANALYTICA UP 2027 — VANDIRA
## Cloudflare Pages + Wrangler Deployment Guide (STEP84)

This package is deployment-ready for Cloudflare Pages using Wrangler.

### Why Wrangler is required
The project contains a Cloudflare Pages Function at:

`functions/api/up-politics-feed.js`

The Cloudflare dashboard's **Upload static files** screen does not support Pages Functions. Deploy the project with Wrangler so the function is deployed together with the static site.

### Recommended deployment
Run these commands from the project root:

```bash
npx wrangler login
npx wrangler pages project create top-analytica-up-2027
npx wrangler pages deploy . --project-name top-analytica-up-2027
```

If the Pages project already exists, skip the `pages project create` command and run only:

```bash
npx wrangler login
npx wrangler pages deploy . --project-name top-analytica-up-2027
```

### Important
- Deploy the **project folder**, not this ZIP file directly.
- Keep the `functions/` directory at the project root.
- Keep `wrangler.toml` at the project root.
- Do **not** use the Cloudflare "Upload static files" uploader for this version.
- The live endpoint is `/api/up-politics-feed`.
- If the live source cannot be fetched, `dashboard.html` automatically falls back to the bundled snapshot JSON.

### Expected verification
After deployment, open:

`https://<your-pages-domain>/dashboard.html`

The dashboard should show the live connector status when the Pages Function successfully fetches the source. If the connector is unavailable, the dashboard should remain usable in snapshot mode.

You can also test the endpoint directly:

`https://<your-pages-domain>/api/up-politics-feed`

A successful response is JSON containing `mode: "server-live"` and an `items` array.

### Data integrity
STEP84 only adds deployment configuration and documentation. Existing project data and the STEP83 live dashboard/function files are preserved unchanged.
