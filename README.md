# MemoRoute

Adaptive Spaced Retention Learning System — frontend for SIH 2026 (Team: All Six Not Found).

MemoRoute helps learners truly understand, retain, and perform better using LECTOR LLM comprehension scoring and personalized spaced repetition.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- React Router

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Glassmorphism landing page matching the MemoRoute mockup |
| `/login` | Login (demo — any email/password works, redirects to home) |
| `/dashboard` | Learning dashboard placeholder (ready for integration) |
| `/llm-payment` | LLM payment technique placeholder |

## Design

- Warm beige/cream/taupe palette from the provided mockup
- Glassmorphism: `backdrop-filter: blur()`, semi-transparent whites, soft glows
- Animated hero character with floating glass cards
- Fully responsive layout

## Next steps

- Connect dashboard to your backend API
- Integrate real LLM payment flow
- Wire LECTOR evaluation endpoints
