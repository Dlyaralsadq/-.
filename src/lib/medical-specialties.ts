import type { LocalizedText } from "./i18n";

export type SpecialtyCategory =
  | "primary-care"
  | "surgical"
  | "internal-medicine"
  | "diagnostic"
  | "rehabilitation"
  | "mental-health"
  | "dental";

export type MedicalSpecialty = {
  slug: string;
  category: SpecialtyCategory;
  name: LocalizedText;
  workflowFocus: LocalizedText;
  templateFields: LocalizedText[];
};

export const specialtyCategoryLabels: Record<SpecialtyCategory, LocalizedText> = {
  "primary-care": { ar: "الرعاية الأولية", en: "Primary care" },
  surgical: { ar: "الجراحة والإجراءات", en: "Surgery and procedures" },
  "internal-medicine": { ar: "الباطنية والفروع الدقيقة", en: "Internal medicine" },
  diagnostic: { ar: "التشخيص والخدمات الساندة", en: "Diagnostics and support" },
  rehabilitation: { ar: "التأهيل والعلاج", en: "Rehabilitation and therapy" },
  "mental-health": { ar: "الصحة النفسية", en: "Mental health" },
  dental: { ar: "طب الأسنان", en: "Dental care" }
};

export const medicalSpecialties: MedicalSpecialty[] = [
  {
    slug: "general-medicine",
    category: "primary-care",
    name: { ar: "الطب العام", en: "General medicine" },
    workflowFocus: {
      ar: "فرز أولي، تشخيص عام، وصفات، وتحويلات للاختصاص.",
      en: "Initial triage, general diagnosis, prescriptions, and referrals."
    },
    templateFields: [
      { ar: "الشكوى الرئيسية", en: "Chief complaint" },
      { ar: "العلامات الحيوية", en: "Vitals" },
      { ar: "خطة العلاج", en: "Treatment plan" }
    ]
  },
  {
    slug: "pediatrics",
    category: "primary-care",
    name: { ar: "طب الأطفال", en: "Pediatrics" },
    workflowFocus: {
      ar: "نمو الطفل، اللقاحات، قياسات العمر، ومتابعة الأمراض المتكررة.",
      en: "Growth, vaccinations, age-based measurements, and recurrent illness tracking."
    },
    templateFields: [
      { ar: "العمر والوزن", en: "Age and weight" },
      { ar: "سجل اللقاحات", en: "Vaccination record" },
      { ar: "تقييم النمو", en: "Growth assessment" }
    ]
  },
  {
    slug: "obstetrics-gynecology",
    category: "primary-care",
    name: { ar: "النسائية والتوليد", en: "Obstetrics and gynecology" },
    workflowFocus: {
      ar: "متابعة الحمل، السونار، الزيارات الدورية، والصحة النسائية.",
      en: "Pregnancy follow-up, ultrasound, recurring visits, and women's health."
    },
    templateFields: [
      { ar: "عمر الحمل", en: "Gestational age" },
      { ar: "نتائج السونار", en: "Ultrasound findings" },
      { ar: "خطة المتابعة", en: "Follow-up plan" }
    ]
  },
  {
    slug: "dentistry",
    category: "dental",
    name: { ar: "طب الأسنان", en: "Dentistry" },
    workflowFocus: {
      ar: "خريطة الأسنان، الإجراءات، خطط العلاج، والتقسيط.",
      en: "Dental charting, procedures, treatment plans, and installment billing."
    },
    templateFields: [
      { ar: "خريطة الأسنان", en: "Dental chart" },
      { ar: "الإجراء المنفذ", en: "Performed procedure" },
      { ar: "خطة الجلسات", en: "Session plan" }
    ]
  },
  {
    slug: "dermatology",
    category: "internal-medicine",
    name: { ar: "الجلدية", en: "Dermatology" },
    workflowFocus: {
      ar: "توثيق الصور، مناطق الإصابة، العلاجات الموضعية، والجلسات.",
      en: "Photo documentation, lesion areas, topical treatments, and sessions."
    },
    templateFields: [
      { ar: "منطقة الإصابة", en: "Affected area" },
      { ar: "نوع الآفة الجلدية", en: "Lesion type" },
      { ar: "صور المتابعة", en: "Follow-up photos" }
    ]
  },
  {
    slug: "ophthalmology",
    category: "diagnostic",
    name: { ar: "العيون", en: "Ophthalmology" },
    workflowFocus: {
      ar: "حدة البصر، ضغط العين، الفحص بالمصباح، والوصفات البصرية.",
      en: "Visual acuity, intraocular pressure, slit-lamp exam, and optical prescriptions."
    },
    templateFields: [
      { ar: "حدة البصر", en: "Visual acuity" },
      { ar: "ضغط العين", en: "Eye pressure" },
      { ar: "وصفة النظارات", en: "Glasses prescription" }
    ]
  },
  {
    slug: "ent",
    category: "surgical",
    name: { ar: "الأنف والأذن والحنجرة", en: "ENT" },
    workflowFocus: {
      ar: "فحص الأذن والأنف والحنجرة، السمع، والإجراءات البسيطة.",
      en: "Ear, nose, throat exams, hearing checks, and minor procedures."
    },
    templateFields: [
      { ar: "فحص الأذن", en: "Ear exam" },
      { ar: "فحص الأنف والحنجرة", en: "Nose and throat exam" },
      { ar: "اختبار السمع", en: "Hearing test" }
    ]
  },
  {
    slug: "cardiology",
    category: "internal-medicine",
    name: { ar: "القلبية", en: "Cardiology" },
    workflowFocus: {
      ar: "تخطيط القلب، الضغط، عوامل الخطورة، والمتابعة الدوائية.",
      en: "ECG, blood pressure, risk factors, and medication follow-up."
    },
    templateFields: [
      { ar: "ضغط الدم", en: "Blood pressure" },
      { ar: "تخطيط القلب", en: "ECG" },
      { ar: "عوامل الخطورة", en: "Risk factors" }
    ]
  },
  {
    slug: "orthopedics",
    category: "surgical",
    name: { ar: "العظام والمفاصل", en: "Orthopedics" },
    workflowFocus: {
      ar: "الإصابات، الأشعة، الحركة، الجبس، والمتابعة التأهيلية.",
      en: "Injuries, imaging, range of motion, casting, and rehab follow-up."
    },
    templateFields: [
      { ar: "مكان الإصابة", en: "Injury site" },
      { ar: "مدى الحركة", en: "Range of motion" },
      { ar: "نتائج الأشعة", en: "Imaging findings" }
    ]
  },
  {
    slug: "neurology",
    category: "internal-medicine",
    name: { ar: "الجملة العصبية", en: "Neurology" },
    workflowFocus: {
      ar: "الفحص العصبي، الصداع، التشنجات، والمتابعة طويلة الأمد.",
      en: "Neurological exams, headaches, seizures, and long-term follow-up."
    },
    templateFields: [
      { ar: "الفحص العصبي", en: "Neurological exam" },
      { ar: "درجة الألم", en: "Pain score" },
      { ar: "الخطة الدوائية", en: "Medication plan" }
    ]
  },
  {
    slug: "psychiatry",
    category: "mental-health",
    name: { ar: "الطب النفسي", en: "Psychiatry" },
    workflowFocus: {
      ar: "تقييم الحالة النفسية، المقاييس، الخطط العلاجية، والسرية العالية.",
      en: "Mental status exams, scales, care plans, and high-confidentiality notes."
    },
    templateFields: [
      { ar: "تقييم الحالة النفسية", en: "Mental status exam" },
      { ar: "مستوى الخطورة", en: "Risk level" },
      { ar: "خطة العلاج النفسي", en: "Therapy plan" }
    ]
  },
  {
    slug: "urology",
    category: "surgical",
    name: { ar: "المسالك البولية", en: "Urology" },
    workflowFocus: {
      ar: "الأعراض البولية، الفحوصات، السونار، وخطط الإجراءات.",
      en: "Urinary symptoms, tests, ultrasound, and procedure planning."
    },
    templateFields: [
      { ar: "الأعراض البولية", en: "Urinary symptoms" },
      { ar: "نتائج التحاليل", en: "Lab results" },
      { ar: "نتائج السونار", en: "Ultrasound findings" }
    ]
  },
  {
    slug: "gastroenterology",
    category: "internal-medicine",
    name: { ar: "الجهاز الهضمي", en: "Gastroenterology" },
    workflowFocus: {
      ar: "أعراض الجهاز الهضمي، الناظور، التحاليل، وخطط الحمية.",
      en: "Digestive symptoms, endoscopy, labs, and diet plans."
    },
    templateFields: [
      { ar: "الأعراض الهضمية", en: "Digestive symptoms" },
      { ar: "نتائج الناظور", en: "Endoscopy findings" },
      { ar: "خطة الحمية", en: "Diet plan" }
    ]
  },
  {
    slug: "endocrinology",
    category: "internal-medicine",
    name: { ar: "الغدد والسكري", en: "Endocrinology" },
    workflowFocus: {
      ar: "السكري، الغدة الدرقية، التحاليل، وخطط المتابعة.",
      en: "Diabetes, thyroid care, lab tracking, and follow-up plans."
    },
    templateFields: [
      { ar: "قراءات السكر", en: "Glucose readings" },
      { ar: "تحاليل الهرمونات", en: "Hormone labs" },
      { ar: "الخطة الغذائية", en: "Nutrition plan" }
    ]
  },
  {
    slug: "nephrology",
    category: "internal-medicine",
    name: { ar: "الكلى", en: "Nephrology" },
    workflowFocus: {
      ar: "وظائف الكلى، الضغط، السوائل، والمتابعة المزمنة.",
      en: "Kidney function, blood pressure, fluids, and chronic follow-up."
    },
    templateFields: [
      { ar: "وظائف الكلى", en: "Kidney function" },
      { ar: "توازن السوائل", en: "Fluid balance" },
      { ar: "خطة المتابعة", en: "Follow-up plan" }
    ]
  },
  {
    slug: "pulmonology",
    category: "internal-medicine",
    name: { ar: "الصدرية والتنفسية", en: "Pulmonology" },
    workflowFocus: {
      ar: "الربو، الانسداد الرئوي، وظائف التنفس، والأشعة.",
      en: "Asthma, COPD, pulmonary function, and imaging."
    },
    templateFields: [
      { ar: "وظائف التنفس", en: "Pulmonary function" },
      { ar: "تشبع الأوكسجين", en: "Oxygen saturation" },
      { ar: "خطة البخاخات", en: "Inhaler plan" }
    ]
  },
  {
    slug: "oncology",
    category: "internal-medicine",
    name: { ar: "الأورام", en: "Oncology" },
    workflowFocus: {
      ar: "خطط العلاج، مراحل المرض، التحاليل، والمتابعة الدورية.",
      en: "Treatment protocols, staging, labs, and periodic follow-up."
    },
    templateFields: [
      { ar: "مرحلة المرض", en: "Disease stage" },
      { ar: "بروتوكول العلاج", en: "Treatment protocol" },
      { ar: "الأعراض الجانبية", en: "Side effects" }
    ]
  },
  {
    slug: "rheumatology",
    category: "internal-medicine",
    name: { ar: "المفاصل والروماتيزم", en: "Rheumatology" },
    workflowFocus: {
      ar: "نشاط المرض، الألم، التحاليل المناعية، وخطط المتابعة.",
      en: "Disease activity, pain, immunology labs, and follow-up plans."
    },
    templateFields: [
      { ar: "نشاط المرض", en: "Disease activity" },
      { ar: "درجة الألم", en: "Pain score" },
      { ar: "تحاليل المناعة", en: "Immunology labs" }
    ]
  },
  {
    slug: "physical-therapy",
    category: "rehabilitation",
    name: { ar: "العلاج الطبيعي", en: "Physical therapy" },
    workflowFocus: {
      ar: "التقييم الحركي، الجلسات، التمارين، وقياس التحسن.",
      en: "Movement assessment, sessions, exercises, and progress tracking."
    },
    templateFields: [
      { ar: "تقييم الحركة", en: "Movement assessment" },
      { ar: "برنامج التمارين", en: "Exercise program" },
      { ar: "تقدم الجلسات", en: "Session progress" }
    ]
  },
  {
    slug: "radiology",
    category: "diagnostic",
    name: { ar: "الأشعة", en: "Radiology" },
    workflowFocus: {
      ar: "طلبات التصوير، التقارير، المرفقات، وربط النتائج بالزيارة.",
      en: "Imaging orders, reports, attachments, and visit-linked results."
    },
    templateFields: [
      { ar: "نوع التصوير", en: "Imaging type" },
      { ar: "التقرير", en: "Report" },
      { ar: "المرفقات", en: "Attachments" }
    ]
  },
  {
    slug: "laboratory",
    category: "diagnostic",
    name: { ar: "المختبر", en: "Laboratory" },
    workflowFocus: {
      ar: "طلبات التحاليل، النتائج، القيم المرجعية، وتسليم التقارير.",
      en: "Lab orders, results, reference ranges, and report delivery."
    },
    templateFields: [
      { ar: "نوع التحليل", en: "Test type" },
      { ar: "النتيجة", en: "Result" },
      { ar: "القيم المرجعية", en: "Reference range" }
    ]
  },
  {
    slug: "emergency-medicine",
    category: "primary-care",
    name: { ar: "الطوارئ", en: "Emergency medicine" },
    workflowFocus: {
      ar: "الفرز السريع، درجة الخطورة، الإجراءات الفورية، والتحويل.",
      en: "Rapid triage, acuity, immediate actions, and referrals."
    },
    templateFields: [
      { ar: "درجة الخطورة", en: "Acuity level" },
      { ar: "الإجراء الفوري", en: "Immediate action" },
      { ar: "قرار التحويل", en: "Referral decision" }
    ]
  },
  {
    slug: "anesthesia",
    category: "surgical",
    name: { ar: "التخدير", en: "Anesthesia" },
    workflowFocus: {
      ar: "تقييم ما قبل العملية، مخاطر التخدير، والخطة الدوائية.",
      en: "Pre-operative assessment, anesthesia risk, and medication planning."
    },
    templateFields: [
      { ar: "تقييم ما قبل العملية", en: "Pre-op assessment" },
      { ar: "درجة المخاطر", en: "Risk score" },
      { ar: "خطة التخدير", en: "Anesthesia plan" }
    ]
  },
  {
    slug: "plastic-surgery",
    category: "surgical",
    name: { ar: "الجراحة التجميلية", en: "Plastic surgery" },
    workflowFocus: {
      ar: "صور قبل وبعد، خطة الإجراء، الموافقات، والمتابعة.",
      en: "Before-after photos, procedure planning, consent, and follow-up."
    },
    templateFields: [
      { ar: "صور قبل وبعد", en: "Before-after photos" },
      { ar: "خطة الإجراء", en: "Procedure plan" },
      { ar: "الموافقة الطبية", en: "Clinical consent" }
    ]
  },
  {
    slug: "nutrition",
    category: "rehabilitation",
    name: { ar: "التغذية العلاجية", en: "Clinical nutrition" },
    workflowFocus: {
      ar: "القياسات، الحمية، الأهداف، والمتابعة الدورية.",
      en: "Measurements, diet plans, goals, and recurring follow-up."
    },
    templateFields: [
      { ar: "القياسات", en: "Measurements" },
      { ar: "الخطة الغذائية", en: "Diet plan" },
      { ar: "الأهداف", en: "Goals" }
    ]
  }
];

export function getSpecialtyCountLabel(locale: "ar" | "en") {
  return locale === "ar"
    ? `${medicalSpecialties.length} اختصاص كبداية`
    : `${medicalSpecialties.length} starter specialties`;
}
