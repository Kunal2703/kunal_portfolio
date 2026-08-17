# Kunal — DevOps &amp; SRE Portfolio

Personal portfolio and technical blog for **Kunal**, DevOps &amp; SRE Engineer. Built as a
single-page React app with an infrastructure-themed interface: a modern terminal, a
Grafana-style metric board, and section backdrops drawn from real Kubernetes manifests,
commit graphs and telemetry.

**Live:** <https://kunal2703.github.io/kunal_portfolio/>

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Editing content](#editing-content)
- [Adding a blog article](#adding-a-blog-article)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Author](#author)

---

## Overview

The site is a static single-page app. All content lives in typed modules under `src/lib/`,
so copy and data changes never require touching component markup. Articles are hosted in
the repository and render without a network call; the Hashnode API is used only to top up
the blog index when it is reachable.

The visual language is deliberately operational rather than decorative — the intent is that
an SRE reading the page recognises the artefacts on it.

## Features

**Hero**

- Terminal panel styled after modern shells: command "blocks" with a left rail, a `zsh`
  tab, a `git:(main)` prompt, syntax-coloured output and a segmented status bar.
- Five commands of scrollback (`terraform apply`, `kubectl get nodes`, `helm upgrade`,
  `aws eks describe-cluster`) ending at a live prompt that types a rotating introduction.

**Impact board**

- Six Grafana-style panels — arc gauge, dual-series, streaming area, step charts and
  extruded bars.
- Series stream via `requestAnimationFrame`, so the charts move continuously.
- Headline figures are fixed real numbers; only the series shape is illustrative, which is
  why the board is tagged `demo board`.

**Sections**

- Numbered eyebrows (`01 → 03`) across Capabilities, Experience and Selected Work.
- Capabilities renders 46 tools across 9 groups as brand-icon chips.
- Experience is an accordion with a year rail; Projects are full-width rows with a hover
  reveal.
- Each section sits on its own infra backdrop: service topology, a `Deployment`/`HPA`
  manifest, a git commit graph, a `kubectl`/`terraform` session, and latency telemetry with
  an SLO threshold line.

**Blog**

- Articles are hosted in-repo and render at `/blog/:slug` with full text and images — no
  external redirect.
- Locally hosted posts always render; posts fetched from Hashnode are merged in and
  de-duplicated by slug, so a failed fetch never empties the index.
- Article typography (`.prose`) covers headings, code blocks, inline code, tables,
  blockquotes and figures.

**Accessibility and motion**

- Decorative layers are `aria-hidden` and `pointer-events: none`.
- All animation is disabled under `prefers-reduced-motion`.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build | Vite 7 |
| Routing | React Router 7 |
| Styling | Hand-written CSS with custom properties, plus Tailwind CSS 4 utilities |
| Animation | Framer Motion 13 |
| Icons | Lucide React, React Icons (Simple Icons) |
| Hosting | GitHub Pages via GitHub Actions |

### A note on the CSS setup

Tailwind is imported as **utilities only**, and deliberately **unlayered**:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css";
```

Preflight is not imported, so the original hand-written base styles remain the single
source of truth. The utilities are unlayered because this project's reset
(`* { margin: 0; padding: 0 }`) is itself unlayered — and unlayered CSS beats layered CSS
regardless of specificity. Inside `@layer utilities`, every Tailwind margin and padding
class would silently lose to that reset.

Because preflight is absent, `button { color: inherit }` is set explicitly in
`src/index.css`; without it the UA default `buttontext` (black) applies.

## Project structure

```
src/
├─ components/
│  ├─ Hero.tsx            # headline, CTAs, profile
│  ├─ HeroTerminal.tsx    # terminal panel and typing loop
│  ├─ About.tsx           # bio + Grafana metric board
│  ├─ Skills.tsx          # capabilities, brand-icon chips
│  ├─ Experience.tsx      # accordion with year rail
│  ├─ Projects.tsx        # full-width project rows
│  ├─ Contact.tsx         # details + mailto form
│  ├─ Blog.tsx            # article index
│  ├─ BlogPost.tsx        # article reader (/blog/:slug)
│  ├─ Navbar.tsx, Layout.tsx
│  └─ ui/
│     ├─ Backdrop.tsx     # infra-themed section backdrops
│     ├─ MetricPanel.tsx  # live Grafana-style panels
│     └─ primitives.tsx   # Eyebrow, MaskedHeading, Reveal, Pill
├─ lib/
│  ├─ data.ts             # profile, experience, projects, skills — all copy
│  ├─ icons.tsx           # skill name → brand icon + colour
│  ├─ metricTones.ts      # metric panel colour tokens
│  └─ posts/              # one module per article + index
└─ index.css              # tokens, base styles, .prose, backdrops

public/
└─ blog/<slug>/           # article images, extracted at full quality
```

## Getting started

### Prerequisites

- **Node.js 20+** (CI builds on 20)
- **npm 10+**

### Setup

```bash
git clone https://github.com/Kunal2703/kunal_portfolio.git
cd kunal_portfolio
npm install
npm run dev
```

The dev server runs at <http://localhost:5173/kunal_portfolio/>. Note the `/kunal_portfolio/`
path — `vite.config.ts` sets `base` and `BrowserRouter` sets a matching `basename`, so the
bare root will not resolve.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across the project |

## Editing content

Nearly all copy lives in **`src/lib/data.ts`** — edit there rather than in components:

| What | Where |
| --- | --- |
| Name, role, location, email, socials, CV link | `profile` |
| Roles, dates, bullet points, per-role stack | `experience` |
| Project cards | `projects` |
| Capability groups and tools | `skillGroups` |
| Education, certifications | `education`, `certifications` |

Other entry points:

- **Metric board** — the `METRICS` array in `src/components/About.tsx`. Each entry picks a
  `viz` (`gauge` / `dual` / `area` / `steps` / `bars`) and supplies a `shape` function that
  maps an advancing phase to a value.
- **Terminal** — command blocks and the rotating `MESSAGES` in
  `src/components/HeroTerminal.tsx`.
- **Section backdrops** — swap a section's `<Backdrop kind="…" />` between `manifest`,
  `pipeline`, `terminal`, `topology` and `telemetry`.
- **New skill icon** — add an entry to `ICONS` in `src/lib/icons.tsx`, then reference its
  key from `skillGroups`.

## Adding a blog article

1. Put images in `public/blog/<slug>/`.
2. Create `src/lib/posts/<slug>.ts`:

   ```ts
   import { asset, type LocalPost } from './types'

   const img = asset('<slug>')

   const html = `
     <h2>Section</h2>
     <p>Body copy…</p>
     <pre><code>kubectl get pods</code></pre>
     <img src="${img('01.png')}" alt="Describe the screenshot" loading="lazy" />
   `

   export const mySlug: LocalPost = {
     slug: '<slug>',
     title: '…',
     subtitle: '…',
     brief: '…',
     coverImage: img('cover.png'),
     publishedAt: 'YYYY-MM-DD',
     readTime: 4,
     tags: ['aws', 'eks'],
     html,
   }
   ```

3. Register it in `src/lib/posts/index.ts` — array order is display order, newest first.

Notes:

- `asset()` prefixes `import.meta.env.BASE_URL`, so images resolve on GitHub Pages.
- Article bodies are injected with `dangerouslySetInnerHTML`. That is acceptable because
  the content is authored in this repository; treat any externally sourced HTML with care.
- If a post's cover image also appears in the body, the reader skips the top cover so the
  image is not shown twice.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes
`dist/` to GitHub Pages.

The workflow copies `dist/index.html` to `dist/404.html`. This is what makes deep links
such as `/blog/upgrading-the-eks-cluster` resolve — GitHub Pages serves `404.html` for
unknown paths, and the SPA router then takes over.

## Conventions

- Content in `src/lib/`, presentation in `src/components/`.
- Constants and types are kept out of component files where they would otherwise trip
  `react-refresh/only-export-components` (see `metricTones.ts`, `posts/types.ts`).
- Decorative layers never intercept pointer events and are always `aria-hidden`.
- Any figure presented as fact comes from the résumé; illustrative visuals are labelled as
  a demo.

## Author

**Kunal** — DevOps &amp; SRE Engineer, Goa, India

- Email: <kunalsingh2703@gmail.com>
- GitHub: [@Kunal2703](https://github.com/Kunal2703)
- LinkedIn: [kunal27](https://www.linkedin.com/in/kunal27/)
- Writing: [kunaltheengineer.hashnode.dev](https://kunaltheengineer.hashnode.dev/)

---

© 2026 Kunal. All rights reserved.
