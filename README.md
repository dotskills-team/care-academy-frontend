# CARE Academy — Frontend (Next.js + Tailwind)

Public-facing website frontend for CARE Academy, built per the MERN technical
spec. This is the **Next.js (App Router) + TailwindCSS** public site only.

> ⚠️ All text and images here are **placeholder / original dummy content**.
> Replace with the client's real logo, brand colors, copy and images before
> launch. In production, content should come from the Express API, not from
> `lib/data.js`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build && npm start
```

## Structure

```
app/
  layout.js              # root layout (navbar, footer, WhatsApp button)
  page.js                # Home
  destinations/          # list + [country] dynamic template
  programs/              # by level + by subject
  services/              # CARE vs partner delivered
  universities/          # searchable list with filters
  resources/             # guides, blog, downloads, intake calendar
  about/  contact/       # about + contact (inquiry form, map)
  privacy/  terms/       # legal pages
components/               # Navbar, Footer, HeroSearch, InquiryForm, Faq, etc.
lib/data.js              # PLACEHOLDER data — swap for API calls in production
```

## Before launch — checklist

1. Replace brand colors in `tailwind.config.js` (`brand` / `accent`).
2. Replace logo "CA" mark in `components/Navbar.js` and `Footer.js`.
3. Replace all content & images in `lib/data.js` with the client's real data,
   or connect to the API.
4. Set site info (phone, WhatsApp, email, address, map) in `lib/data.js` → `site`.
5. Connect the inquiry form to the API in `components/InquiryForm.js`
   (`POST /api/inquiries`). Add `NEXT_PUBLIC_API_URL` to `.env.local`.
6. Add real image host(s) to `next.config.js` → `images.remotePatterns`.

## Notes

- Layout and section structure follow the agreed reference design; all copy and
  imagery are original placeholders to avoid any copyright issues.
- Images currently load from Unsplash for demo purposes only — swap for the
  client's own licensed images before launch.
