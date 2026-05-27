export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export type LocalizedText = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export const dictionary = {
  ar: {
    localeLabel: "العربية",
    switchLocale: "English",
    nav: {
      product: "المنتج",
      modules: "الوحدات",
      specialties: "التخصصات",
      roadmap: "الخطة"
    },
    hero: {
      eyebrow: "نواة SaaS لإدارة العيادات في العراق",
      title: "نظام احترافي لإدارة العيادات الطبية بكفاءة عالية",
      description:
        "بداية عملية لمنصة متعددة العيادات تدعم العربية والإنجليزية، صلاحيات المستخدمين، إدارة المرضى، المواعيد، الزيارات الطبية، الفواتير، وقوالب مخصصة لكل اختصاص طبي.",
      primaryAction: "استعراض الوحدات",
      secondaryAction: "مشاهدة التخصصات",
      noPortal:
        "بوابة المريض غير مفعلة في النسخة الأولى حسب طلبك، ويمكن إضافتها لاحقاً."
    },
    stats: [
      { label: "لغات الواجهة", value: "2" },
      { label: "أدوار تشغيلية", value: "6" },
      { label: "تخصصات كبداية", value: "24+" }
    ],
    product: {
      title: "مصمم كمنصة SaaS متعددة العيادات",
      description:
        "كل عيادة تحصل على مساحة بيانات مستقلة، فروع، مستخدمين، صلاحيات، وسير عمل طبي يمكن تخصيصه حسب الاختصاص."
    },
    modules: {
      title: "وحدات النسخة الأولية",
      description:
        "هذه الوحدات تضع الأساس التقني والتشغيلي قبل إضافة الدفع الإلكتروني، الرسائل، والتقارير المتقدمة."
    },
    specialties: {
      title: "تخصيص لكل اختصاص طبي",
      description:
        "بدلاً من شاشة واحدة لكل الأطباء، يعتمد النظام على قوالب زيارة وحقول طبية قابلة للتخصيص لكل اختصاص."
    },
    roadmap: {
      title: "خطوات البناء القادمة",
      items: [
        "إضافة تسجيل الدخول وصلاحيات المستخدمين.",
        "ربط قاعدة بيانات PostgreSQL وتشغيل Prisma migrations.",
        "بناء شاشات إدارة العيادات والمرضى والمواعيد.",
        "إضافة قوالب الزيارات الطبية لكل اختصاص.",
        "إضافة الفواتير والاشتراكات والتنبيهات حسب احتياج السوق العراقي."
      ]
    },
    compliance: {
      title: "أمان وخصوصية من البداية",
      description:
        "بيانات المرضى حساسة، لذلك تم تصميم النموذج ليشمل عزل بيانات العيادات، سجل النشاط، وصلاحيات دقيقة قبل التوسع."
    }
  },
  en: {
    localeLabel: "English",
    switchLocale: "العربية",
    nav: {
      product: "Product",
      modules: "Modules",
      specialties: "Specialties",
      roadmap: "Roadmap"
    },
    hero: {
      eyebrow: "Clinic SaaS foundation for Iraq",
      title: "A professional platform for efficient medical clinic operations",
      description:
        "A practical starting point for a multi-clinic SaaS platform with Arabic and English, user roles, patient management, appointments, clinical visits, billing, and specialty-specific templates.",
      primaryAction: "Explore modules",
      secondaryAction: "View specialties",
      noPortal:
        "The patient portal is intentionally excluded from the first version and can be added later."
    },
    stats: [
      { label: "Interface languages", value: "2" },
      { label: "Operational roles", value: "6" },
      { label: "Starter specialties", value: "24+" }
    ],
    product: {
      title: "Designed as a multi-clinic SaaS platform",
      description:
        "Each clinic gets isolated data, branches, users, permissions, and specialty-aware clinical workflows."
    },
    modules: {
      title: "Initial product modules",
      description:
        "These modules create the technical and operational base before adding payments, messaging, and advanced reporting."
    },
    specialties: {
      title: "Customization for every medical specialty",
      description:
        "Instead of one generic screen for every doctor, the system is built around visit templates and clinical fields that can be tailored by specialty."
    },
    roadmap: {
      title: "Next build steps",
      items: [
        "Add authentication and role-based permissions.",
        "Connect PostgreSQL and run Prisma migrations.",
        "Build clinic, patient, and appointment management screens.",
        "Add clinical encounter templates per specialty.",
        "Add billing, subscriptions, and notifications for the Iraqi market."
      ]
    },
    compliance: {
      title: "Security and privacy from day one",
      description:
        "Patient data is sensitive, so the model starts with tenant isolation, activity logs, and fine-grained permissions before expansion."
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
