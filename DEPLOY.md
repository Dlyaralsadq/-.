# نشر ClinicPro على الإنترنت (رابط دائم)

## الطريقة الأسرع: Vercel + Neon PostgreSQL (مجاني)

### الخطوة 1: قاعدة بيانات مجانية من Neon
1. اذهب إلى [neon.tech](https://neon.tech) وأنشئ حساباً مجانياً
2. أنشئ قاعدة بيانات جديدة باسم `clinicpro`
3. انسخ **Connection String** يبدأ بـ `postgresql://...`

### الخطوة 2: نشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com) وسجّل بحسابك على GitHub
2. اضغط "New Project" وأختر مستودع `-.`
3. في **Environment Variables** أضف:
   - `DATABASE_URL` = الرابط من Neon
   - `NEXTAUTH_SECRET` = `clinic-pro-secret-2024`
4. اضغط Deploy

### الخطوة 3: إعداد قاعدة البيانات
بعد النشر، في Vercel Dashboard → Functions → Run:
```
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### النتيجة
رابط دائم مثل: `https://clinic-pro.vercel.app`

---

## طريقة بديلة: Railway (يدعم SQLite)

1. اذهب إلى [railway.app](https://railway.app)
2. "Deploy from GitHub" → اختر مستودع `-.`
3. أضف متغير: `PORT=3000`
4. Railway يعطيك رابطاً دائماً مثل: `clinicpro.up.railway.app`

---

## تشغيل محلي دائم
للتشغيل التلقائي عند بدء VM:
```bash
bash /workspace/start.sh
```
