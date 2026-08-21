# مشروع الذكاء الاصطناعي المساعد — Public Site

The public-facing pages of the Agentic AI project platform, implemented from
the "Government data collection platform" design handoff.

Arabic, RTL throughout.

## Stack

Deliberately the same stack and layout as
[`TXLABtesting/Entities-Operations`](https://github.com/TXLABtesting/Entities-Operations)
so the two codebases merge cleanly later:

- **Vite 7** + **React 19** + **TypeScript** (strict)
- **wouter** for routing
- **Tailwind CSS v4** (`@tailwindcss/vite`), shadcn conventions in
  `components.json`
- `@` → `client/src`, `@shared` → `shared`
- pnpm 10 (pinned via `packageManager`)

## Layout

```
client/
  index.html            RTL document shell, Cairo + Material Symbols
  public/assets/        images, hero video and PDFs from the design bundle
  src/
    App.tsx             wouter routes
    main.tsx            entry
    index.css           Tailwind + design tokens + shared primitives
    components/
      ErrorBoundary.tsx
      site/             SiteNav · SiteFooter · SiteLayout
                        HistoryJourney · PhaseTimeline · TargetColumn
    data/               static seeds (streams, principles, history, news,
                        phases, publications)
    hooks/              useMediaQuery · useScrollReveal
    lib/                brand.ts (asset paths) · utils.ts (cn)
    pages/              Home · About · Library · Contact · NotFound
shared/
  const.ts              routes, site copy, nav breakpoint
  types/index.ts        types shared with the future API layer
```

## Routes

| Route      | Page      | Contents                                                                               |
| ---------- | --------- | -------------------------------------------------------------------------------------- |
| `/`        | `Home`    | video hero, intro, leadership message, targets, news carousel, streams, phase timeline |
| `/about`   | `About`   | scroll-driven history journey (2001→2026), leadership quote, 14 general principles     |
| `/library` | `Library` | documents gallery with category filter, search and empty state                         |
| `/contact` | `Contact` | contact form with validation, sending / success / failure states                       |

## Commands

```bash
pnpm install
pnpm dev       # vite dev server on :3000
pnpm check     # tsc --noEmit
pnpm build     # production build to dist/public
pnpm preview   # serve the build
```

## Not wired up yet

The pages are self-contained; linking them to the platform comes next.

- **Contact submit** posts to `POST /api/contact` with
  `{ name, phone, email, streamId, message }`. The server is expected to
  resolve `streamId` → the stream representative's email from the backoffice
  config and send the message. That mapping must never reach the client, and
  the UI never surfaces it. Server-side rate limiting still needs adding; the
  form already carries a honeypot field.
- **Library documents** come from `client/src/data/publications.ts`. Swap the
  source for the backoffice feed — the `Publication` shape in
  `shared/types/index.ts` is the contract.
- **Login** (`تسجيل الدخول`) points at `/` for now; it becomes the UAE PASS
  entry point.
- **Auth-dependent nav states** (the signed-in avatar menu and
  `منصة الإدخال` button in the design) are not rendered yet — they arrive with
  the auth provider.

## Hero video

`client/public/assets/web/hero-bg.mp4` is the supplied footage transcoded to
H.264 / yuv420p / 30fps, muted, with `+faststart` (the original was HEVC
10-bit, which Chrome and Firefox cannot decode on most platforms).
`hero-poster.jpg` is a frame from it, used as the `poster` while the video
loads.
