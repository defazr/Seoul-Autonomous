# Seoul Autonomous

A simple English guide to Seoul's self-driving buses and robotaxis.

## What is this?

Seoul Autonomous is an experience guide app + website for foreign tourists, expats, and tech enthusiasts who want to try Seoul's autonomous transportation services.

This is **not** a transit app. It's a guide.

## Project Structure

```
/seoul-autonomous
├── SSOT.md                    (Project constitution)
├── CLAUDE.md                  (Claude Code working rules)
├── README.md
├── app/                       (Expo Router screens)
│   ├── _layout.tsx
│   ├── (tabs)/                (Tab navigation)
│   │   ├── index.tsx          (Home)
│   │   ├── routes.tsx         (Routes)
│   │   ├── how-to-ride.tsx    (How to Ride)
│   │   └── settings.tsx       (Settings)
│   └── route/[id].tsx         (Route Detail)
├── components/                (Reusable components)
│   ├── ui/                    (Button, Card, Badge)
│   ├── route/                 (RouteCard, StopList)
│   └── layout/                (Header, BottomNav)
├── data/
│   └── routes.json            (Static route data)
├── content/                   (Web SEO content - future)
├── lib/
│   ├── i18n/                  (Multilingual setup)
│   ├── design/                (Design tokens)
│   └── utils/
├── assets/
│   ├── images/routes/         (Static route images - future)
│   ├── fonts/                 (Geist, Pretendard)
│   └── icons/
└── docs/
    ├── DECISIONS.md           (Decision log, grow-only)
    └── worklogs/              (Work logs)
```

## Tech Stack

- Expo (React Native) + TypeScript
- Expo Router
- NativeWind (Tailwind for React Native)
- i18next (English / Korean)
- Static routes.json data (no API calls in v1)

## SSoT Files

The project follows a slim SSoT structure:

- `SSOT.md` - Project constitution (immutable)
- `CLAUDE.md` - Claude Code working rules
- `docs/DECISIONS.md` - Decision log (grow-only)
- `data/routes.json` - Route data (v0.1 seed)

## Status

- [x] SSoT confirmed (3-AI consensus + project owner)
- [x] Design system + 4 screen mockups (Claude Design)
- [x] 10 fixed routes + 1 on-demand service (Kakao Map verified)
- [ ] Day 1: Project initialization (this commit)
- [ ] Day 2+: Screen implementation
- [ ] Beta: Internal testing
- [ ] Public: Google Play release

## License

Proprietary. All rights reserved.
