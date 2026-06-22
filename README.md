# Iraq Clinic Platform — Monorepo

منصة عيادات طبية للعراق: نظام إدارة العيادات + تطبيق المريض + لوحة مدير المنصة.

## Structure

```text
apps/
  clinic-system/     نظام العيادة الكامل (طبيب، سكرتير، مدير المنصة /admin)
  patient-web/       تطبيق المريض (بحث أطباء + معلومات الحجز)
packages/
  database/          Prisma + PostgreSQL/SQLite مشترك
  config/            إعدادات TypeScript مشتركة
```

## Quick start

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev:clinic    # http://localhost:3000  — نظام العيادة
npm run dev:patient   # http://localhost:3001  — تطبيق المريض
```

### Demo logins (clinic-system)

| Role | Username | Password |
|------|----------|----------|
| Platform admin | `admin` | `admin123` |
| Doctor | `dr.ahmad` | `admin123` |

- **Platform admin (لوحتك):** `http://localhost:3000/ar/admin`
- **Doctor portal:** `http://localhost:3000/ar/doctor`
- **Patient search:** `http://localhost:3001/ar`

## Environment

Copy `.env.example` to `.env` at repo root (optional for local SQLite).

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Deployment notes

- `apps/clinic-system` includes Railway config for the clinic app.
- Set `DATABASE_URL` to PostgreSQL in production.
- Set `CLINIC_APP_URL` for patient-web footer link (e.g. `https://clinic.yourdomain.iq`).
