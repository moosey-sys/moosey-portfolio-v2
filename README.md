# Moosey — From interface to infrastructure

Live portfolio: **https://moosey-portfolio.vercel.app/**

An original portfolio for **Win Min Thaw**, positioned as **Systems & Cloud Engineer · Full-Stack Developer**. The content is based on the supplied October CV and the existing Guru portfolio. No invented awards, certifications, employment claims, testimonials, or performance results. Academic and professional work are identified. Non-Guru project art is explicitly labeled as illustrative.

## Run

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Node 22 recommended. `npm run build` produces `dist/`. Vercel detects Vite and deploys `api/presence.js` as a serverless function. Local Vite preview does not execute this optional API and displays the honest offline chat state.

## Publish

Source repository: **https://github.com/moosey-sys/moosey-portfolio-v2** (private). The `main` branch is connected to the existing Vercel project for automatic production deployments. Framework: Vite; build: `npm run build`; output: `dist`. The included `vercel.json` handles client routes and response headers. Never commit `.env` or credentials.

## Content

- `src/data.js`: profile, verified career dates, projects, skills, photos.
- `src/main.jsx`: page structure and interaction state.
- `src/visuals.jsx`: GPU portrait distortion, Three.js project orbit, skill cloud, infinite photo canvas, visitor presence.
- `src/style.css`: responsive design, five themes, reduced-motion behavior.
- `public/Win-Min-Thaw-CV.pdf`: supplied résumé.
- `public/assets`: optimized original personal photographs and Guru interface captures.

## Motion and interaction coverage

| Reference behavior | Portfolio implementation |
|---|---|
| Preloader / name scramble / rotating words | Short brand entrance, name scramble, rotating role line |
| Text reveals / scroll highlighting | Blur-and-rise section reveals, scroll-linked word opacity |
| Floating elements / cursor / parallax / glow | Floating tags, pointer offsets, decorative cursor, fluid portrait |
| Continuous decoration | Rotating star, moving ticker, drifting photo cards, concept scan line |
| Pinned horizontal gallery | Desktop scroll-linked project cards; swipeable on mobile |
| Card/globe switching | Filterable project cards and interactive Three.js orbit |
| 3D icon sphere | Drag and focus skills cloud using projected Canvas 2D |
| Infinite experimental gallery | Photo canvas with pan, zoom, click, keyboard and reset controls |
| Theme transition / matching favicon | Five palettes, circular reveal with View Transitions where supported, local persistence, updated favicon |
| Automatic atmosphere | Optional scroll-driven light/dark mode |
| Magnetic / hover interactions | Magnetic calls to action, project tilt, arrows, rolling social text |
| Employer logo motion | Official CB Bank, NTT DATA, Tiny Equations and Candellar logos with gentle floating, hover tilt, and reduced-motion support |
| Dashboard preview tabs / screenshot themes | Four Guru tabs, accessible arrow-key navigation, light/dark screenshots |
| Image viewer / case studies | Native modal dialogs with focus restoration and Escape dismissal |
| Animated counters | Verified Guru counts: 10 public pages, 4 workspaces, 2 languages |
| Fullscreen menu / hiding header | Animated menu, keyboard focus trap, scroll-direction header |
| Progress / custom scrollbar / top button | Reading progress, draggable/keyboard range scrollbar, back-to-top |
| Grid overlay / live clock / changing logo | Column grid toggle, Yangon clock, cycling footer symbols |
| Contact dial / copy / resume | Interactive social dial, clipboard feedback, email and PDF |
| Live cursors / short messages | Optional server-backed visitor presence, explicit opt-in, expiring records |
| Motion preferences | Pause control, reduced-motion preference, no pointer effects on touch |

Reference effects are adapted into an original visual system, not copied source or exact replicas. Portfolio project dialogs use a blur entrance instead of routing users through full page transitions. Education replaces an invented awards gallery. The theme reveal uses browser View Transitions, with an immediate compatible fallback; no fluid-simulation claim is made for that transition.

## Optional live presence

Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from a dedicated Upstash Redis database in the Vercel project environment, then redeploy. The UI checks availability and clearly says when the service is not connected. It never shows simulated visitors.

Participants explicitly join. Messages are limited to 120 characters and rendered as plain React text. Presence expires in 12 seconds; messages clear after 15 seconds on the sending client. Same-origin checks, validation, request timeouts, and a hashed-IP minute rate limit are included. At most 40 visitor records are returned. No accounts, permanent chat history, or client-side credentials. This is lightweight polling (every two seconds), not a WebSocket service. Consider a dedicated moderated provider if public traffic grows.

## Verification

`npm test` runs functional browser checks. Playwright can use installed Chrome with the configuration included here. Tests cover navigation, project filtering and details, screenshot tabs, appearance and motion controls, and mobile overflow. GPU/browser differences may affect WebGL; the project orbit exposes regular project buttons as a fallback.

## Assets and privacy

The user explicitly supplied and authorized the attached photographs and CV for this public portfolio. The résumé PDF includes the contact details in the original document. Employer systems remain descriptive; no banking credentials, internal topology, or private client data are included. Fonts are self-hosted; their OFL licenses are included in `public/fonts`.
