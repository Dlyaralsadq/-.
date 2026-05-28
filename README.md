<<<<<<< Updated upstream
# -.
مستودع خاص
=======
# كلينيك برو - ClinicPro

## نظام إدارة العيادات الطبية | Medical Clinic Management System

نظام SaaS متكامل لإدارة العيادات الطبية مبني بـ Next.js، يدعم العربية والإنجليزية مع دعم RTL الكامل.

---

## المزايا | Features

- **تسجيل الدخول** - Authentication with secure session management
- **لوحة التحكم** - Dashboard with real-time statistics
- **إدارة المرضى** - Patient management (Add, Edit, View, Delete)
- **إدارة المواعيد** - Appointment scheduling and management
- **إدارة الأطباء** - Doctor profiles and management
- **التخصصات الطبية** - Medical specialty management
- **دعم اللغتين** - Full Arabic (RTL) and English support
- **تصميم احترافي** - Professional responsive UI

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM v7)
- **i18n**: next-intl
- **Icons**: Lucide React

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:migrate

# Seed with demo data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `admin` / `admin123`

---

## Database Commands

```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset & re-seed database
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routes (ar/en)
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Main dashboard
│   │   ├── patients/      # Patient management
│   │   ├── appointments/  # Appointment management
│   │   ├── doctors/       # Doctor management
│   │   └── specialties/   # Specialty management
│   └── actions/           # Server actions
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components (Sidebar, Header)
├── i18n/                  # i18n configuration
├── lib/                   # Utilities (prisma, auth, utils)
└── messages/              # Translation files (ar.json, en.json)
prisma/
├── schema.prisma          # Database schema
├── migrations/            # Migration files
└── seed.ts               # Seed data
```
>>>>>>> Stashed changes
