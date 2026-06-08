# Sri Bhairavar Association — Tax & Audit Website

A fast, mobile-responsive static website for tax and audit consultancy services.

## Quick start

1. Open `index.html` in any modern browser (double-click or drag into Chrome/Firefox).
2. For local preview with live reload, use any static server, for example:
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`.

## Connect the Apply Online form (Formspree)

1. Sign up at [https://formspree.io](https://formspree.io) with your business email.
2. Create a new form and copy your form ID (the part after `/f/` in the endpoint URL).
3. Replace `YOUR_FORM_ID` in **both** places:
   - `main.js` — line: `const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";`
   - `index.html` — form `action` attribute (optional; `main.js` sets it on load).

After updating, submit a test application from the **Apply Online** section to confirm email delivery.

## Customize before going live

| Item | Where to edit |
|------|----------------|
| Phone, email, address | `index.html` footer and JSON-LD script in `<head>` |
| Canonical & sitemap URL | `index.html`, `sitemap.xml`, `robots.txt` — replace `https://example.com/` |
| Hero / about photos | `styles.css` (hero background) and `index.html` (about `<img>` `src`) |
| Firm copy | `index.html` section text |

## Files

- `index.html` — page structure, SEO meta, schema.org JSON-LD
- `styles.css` — layout, theme, responsive design, animations
- `main.js` — navigation, scroll effects, form validation, Formspree submit
- `favicon.svg` — browser tab icon
- `robots.txt` / `sitemap.xml` — search engine hints

## Deploy

Upload all files to any static host (GitHub Pages, Netlify, Cloudflare Pages, or your web server). No build step required.

## Images

Placeholder images are loaded from Unsplash. Replace with your own office and team photos when ready for production.
