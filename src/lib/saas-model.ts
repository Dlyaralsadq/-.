import type { LocalizedText } from "./i18n";

export type UserRole = {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
};

export type ProductModule = {
  key: string;
  name: LocalizedText;
  summary: LocalizedText;
  mvp: boolean;
};

export const userRoles: UserRole[] = [
  {
    key: "platform-owner",
    name: { ar: "مالك المنصة", en: "Platform owner" },
    description: {
      ar: "يدير الاشتراكات، العيادات، الخطط، وإعدادات النظام العامة.",
      en: "Manages subscriptions, clinics, plans, and global platform settings."
    }
  },
  {
    key: "clinic-admin",
    name: { ar: "مدير العيادة", en: "Clinic admin" },
    description: {
      ar: "يدير الفروع، الموظفين، الصلاحيات، وإعدادات العيادة.",
      en: "Manages branches, staff, permissions, and clinic settings."
    }
  },
  {
    key: "doctor",
    name: { ar: "طبيب", en: "Doctor" },
    description: {
      ar: "يدير المواعيد، الزيارات، التشخيصات، الوصفات، وخطة العلاج.",
      en: "Handles appointments, encounters, diagnoses, prescriptions, and care plans."
    }
  },
  {
    key: "receptionist",
    name: { ar: "استقبال", en: "Receptionist" },
    description: {
      ar: "ينظم المرضى، الحضور، وجدولة المواعيد اليومية.",
      en: "Coordinates patients, check-ins, and daily appointment scheduling."
    }
  },
  {
    key: "accountant",
    name: { ar: "محاسب", en: "Accountant" },
    description: {
      ar: "يدير الفواتير، المدفوعات، الخصومات، والتقارير المالية.",
      en: "Manages invoices, payments, discounts, and financial reports."
    }
  },
  {
    key: "clinical-assistant",
    name: { ar: "مساعد طبي", en: "Clinical assistant" },
    description: {
      ar: "يدخل القياسات الحيوية، التحضيرات، والملاحظات قبل دخول الطبيب.",
      en: "Captures vitals, preparation notes, and pre-doctor observations."
    }
  }
];

export const productModules: ProductModule[] = [
  {
    key: "tenant-management",
    name: { ar: "إدارة العيادات SaaS", en: "SaaS clinic management" },
    summary: {
      ar: "عزل بيانات كل عيادة مع دعم الفروع والخطط والاشتراكات.",
      en: "Tenant isolation for each clinic with branches, plans, and subscriptions."
    },
    mvp: true
  },
  {
    key: "staff-access",
    name: { ar: "المستخدمون والصلاحيات", en: "Users and permissions" },
    summary: {
      ar: "أدوار تشغيلية واضحة للطبيب، الاستقبال، المحاسب، ومدير العيادة.",
      en: "Clear operational roles for doctors, reception, accountants, and admins."
    },
    mvp: true
  },
  {
    key: "patients",
    name: { ar: "ملفات المرضى", en: "Patient records" },
    summary: {
      ar: "بيانات شخصية، تاريخ مرضي، مرفقات، وحالات مزمنة.",
      en: "Demographics, medical history, attachments, and chronic conditions."
    },
    mvp: true
  },
  {
    key: "appointments",
    name: { ar: "المواعيد والجداول", en: "Appointments and schedules" },
    summary: {
      ar: "حجز وتعديل وإلغاء المواعيد مع جدول يومي لكل طبيب وفرع.",
      en: "Book, edit, and cancel appointments with daily schedules per doctor and branch."
    },
    mvp: true
  },
  {
    key: "clinical-encounters",
    name: { ar: "الزيارات الطبية", en: "Clinical encounters" },
    summary: {
      ar: "تشخيص، وصفات، ملاحظات، وتحاليل حسب قالب الاختصاص.",
      en: "Diagnosis, prescriptions, notes, and orders based on the specialty template."
    },
    mvp: true
  },
  {
    key: "billing",
    name: { ar: "الفواتير والمدفوعات", en: "Billing and payments" },
    summary: {
      ar: "فواتير الزيارات، المدفوعات الجزئية، الخصومات، وتقارير الإيرادات.",
      en: "Visit invoices, partial payments, discounts, and revenue reports."
    },
    mvp: true
  },
  {
    key: "notifications",
    name: { ar: "التنبيهات", en: "Notifications" },
    summary: {
      ar: "قابلية لاحقة لرسائل SMS أو WhatsApp لتأكيد المواعيد.",
      en: "Future SMS or WhatsApp reminders for appointment confirmation."
    },
    mvp: false
  },
  {
    key: "patient-portal",
    name: { ar: "بوابة المريض", en: "Patient portal" },
    summary: {
      ar: "مؤجلة حالياً، ويمكن إضافتها عندما تصبح مطلوبة.",
      en: "Deferred for now and can be added when needed."
    },
    mvp: false
  }
];

export const iraqReadinessItems: LocalizedText[] = [
  {
    ar: "واجهة عربية RTL افتراضياً مع خيار إنجليزي كامل.",
    en: "Arabic RTL by default with a complete English option."
  },
  {
    ar: "إمكانية تهيئة العملة، المحافظات، وأرقام الهواتف العراقية.",
    en: "Ready to configure Iraqi currency, governorates, and phone numbers."
  },
  {
    ar: "بنية تسمح ببوابات دفع محلية أو Stripe عند توفرها.",
    en: "Architecture supports local payment gateways or Stripe when available."
  }
];
