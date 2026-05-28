# ClinicPro - Agent Instructions

## Cursor Cloud specific instructions

### Overview

This is a monolithic Next.js 16 (App Router) clinic management SaaS with:
- SQLite database (file-based, no external DB needed)
- Prisma ORM v7 with `@prisma/adapter-better-sqlite3`
- Bilingual support (Arabic RTL / English LTR) via `next-intl`
- Custom cookie-based auth (base64-encoded session, no JWT)

### Key commands

See `package.json` scripts section. Quick reference:
- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (requires `eslint.config.mjs` — see note below)
- `npm run db:migrate` — run Prisma migrations
- `npm run db:seed` — seed demo data (admin/admin123)
- `npm run db:reset` — reset and re-seed database

### Caveats

- **ESLint config missing on this branch**: The `eslint.config.mjs` file does not exist on the `cursor/clinic-saas-mvp-a943` branch. `npm run lint` will fail until one is added. The foundation branch (`cursor/clinic-saas-foundation-430e`) has a working config.
- **Path alias**: The `@/` path alias resolves to `./src/*` and is configured in `tsconfig.json` with `baseUrl` and `paths`. If this config is ever lost, the app will fail to start with "Module not found: Can't resolve '@/...'" errors.
- **Database file**: The SQLite database lives at `prisma/dev.db`. If migrations fail, delete this file and re-run `npx prisma migrate deploy && npx tsx prisma/seed.ts`.
- **Demo credentials**: `admin` / `admin123`
- **No external services required**: Everything runs with a single `npm run dev` process.
