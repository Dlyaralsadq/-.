# Iraq Clinic Platform

منصة موحّدة لإدارة العيادات الطبية في العراق — تطبيق واحد يخدم ثلاثة أطراف.

## الهيكل

```
apps/
  clinic-system/     التطبيق الموحّد (مريض + طبيب + مدير المنصة)
packages/
  database/          Prisma + قاعدة بيانات مشتركة (SQLite / PostgreSQL)
  config/            إعدادات TypeScript
```

## الصفحات الرئيسية

| الرابط | الوظيفة |
|--------|---------|
| `/ar` | الصفحة الرئيسية — اختيار طبيب أم مريض |
| `/ar/patient` | بحث أطباء حسب التخصص + معلومات |
| `/ar/patient/doctor/:id` | صفحة تفاصيل الطبيب للمريض |
| `/ar/login` | دخول الطبيب / الموظف |
| `/ar/doctor` | لوحة الطبيب |
| `/ar/secretary` | لوحة السكرتير |
| `/ar/admin` | لوحتك كمدير المنصة |

## Quick Start

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev        # http://localhost:3000
```

## بيانات الدخول التجريبية

| الدور | المستخدم | كلمة المرور |
|-------|----------|-------------|
| مدير المنصة | `admin` | `admin123` |
| طبيب | `dr.ahmad` | `admin123` |

## Database Commands

```bash
npm run db:migrate   # تشغيل migrations
npm run db:seed      # إضافة بيانات تجريبية
npm run db:studio    # فتح Prisma Studio
npm run db:reset     # إعادة تعيين قاعدة البيانات
```

## Environment

انسخ `.env.example` إلى `.env` ثم اضبط `DATABASE_URL`.

## Deployment

- `apps/clinic-system/railway.json` — نشر على Railway
- لـ PostgreSQL عيّن `DATABASE_URL=postgresql://...`
