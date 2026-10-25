# manish-chauhan.com

Personal portfolio site: a visual, scroll-driven 3D story of a career in data
and AI (hero orbit, zoom-through journey, project carousel, client logos),
plus a public blog with a password-protected admin editor.

**Stack**: React + TypeScript + Vite, MUI, Framer Motion, React Three Fiber
(the hero scene) on the frontend; FastAPI + SQLModel + SQLite on the backend,
serving the blog's public API and JWT-gated admin API.

```
frontend/   React app (all pages, sections, 3D hero scene)
backend/    FastAPI app (blog CRUD + admin auth, SQLite storage)
```

## Local development

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt

cp .env.example .env
python scripts/hash_password.py "your-password"   # paste result into .env as ADMIN_PASSWORD_HASH
# set JWT_SECRET in .env (python -c "import secrets; print(secrets.token_urlsafe(48))")
# and, for LOCAL work only, set ENVIRONMENT=development in .env
# (production mode refuses to start without strong secrets, and uses https-only cookies)

uvicorn app.main:app --reload --port 8000
```

API docs (development only): http://localhost:8000/api/docs

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Site: http://localhost:5173 (the Vite dev server proxies `/api` to the
backend on port 8000).

## Editing content

- **Journey, numbers, services, project cards, certifications** — plain data
  in `frontend/src/data/showcase.ts`. Edit and save; Vite hot-reloads.
- **Case study detail** (stack, client) — `frontend/src/data/caseStudies.ts`.
- **Visuals** — the avatar, story scenes and support video live in `frontend/public/story/` (WebP and MP4, generated with Higgsfield).
  Replace a file with the same name to swap a picture.
- **Client logos** — SVGs in `frontend/public/logos/`. Clients without a file
  render as a typographic wordmark; to add one, drop `<slug>.svg` there and add
  the slug to `logoFiles` in `frontend/src/data/clients.ts`.
- **Blog posts** — go to `/admin/login`, sign in, and use the editor at
  `/admin`. Posts are markdown, stored in SQLite (`backend/data/blog.db`).
- **Colors / fonts / theme** — `frontend/src/theme/theme.ts`.

## Deploying

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full DigitalOcean droplet
runbook. Short version: `docker compose up -d --build` with `.env` and
`backend/.env` filled in — Caddy handles the static build, the `/api` proxy,
and automatic HTTPS for the domain.
