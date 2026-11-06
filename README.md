# Recomind

Recomind is an AI-assisted product discovery app. It combines a Next.js storefront with a Python recommendation backend that blends content-based filtering (TF-IDF + cosine similarity) and collaborative signals into a hybrid ranking.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Forms & validation | React Hook Form, Zod |
| Auth | Firebase Auth (optional) with a local-demo fallback |
| Backend | Flask, SQLite, pandas, NumPy, scikit-learn |

## Getting started

### 1. Frontend

```bash
npm install
cp .env.local.example .env.local   # optional: fill in Firebase / site URL values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works without Firebase or the Python backend. When they are unavailable it falls back to local storage and the TypeScript recommendation engine.

### 2. Backend (optional)

```bash
cd backend
pip install -r requirements.txt
python init_db.py
python app.py
```

The API listens on `http://127.0.0.1:5000/api`. Point the frontend at it with `NEXT_PUBLIC_API_URL`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run test:backend` | Run the Flask backend test suite |

## Environment variables

See [`.env.local.example`](.env.local.example). The frontend variables are optional:

- `NEXT_PUBLIC_FIREBASE_*` — enable real Firebase authentication.
- `NEXT_PUBLIC_SITE_URL` — canonical site URL used for metadata.
- `NEXT_PUBLIC_API_URL` — Python backend base URL.

Backend-side variables:

- `RECOMIND_SECRET_KEY` — signing key for auth tokens. Use a long random value outside local development.
- `RECOMIND_CORS_ORIGINS` — comma-separated list of allowed frontend origins.
- `RECOMIND_ALLOW_DEMO_AUTH` — set to `0` to disable the `X-Demo-User-Id` prototype fallback.
