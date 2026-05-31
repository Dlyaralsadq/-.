export interface HoldOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

export interface SpecialtyConfig {
  hasHoldForTest: boolean;
  holdOptions: HoldOption[];
  holdSectionTitle?: { ar: string; en: string };
  customNotes?: { ar: string; en: string };
}

// Default configs per specialty (matched by name pattern)
export const SPECIALTY_CONFIGS: Record<string, SpecialtyConfig> = {

  // ── Orthopedics ──────────────────────────────────────────────
  orthopedics: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال للفحص", en: "Send for Test" },
    holdOptions: [
      { value: "xray", labelAr: "صورة أشعة سينية (X-Ray)", labelEn: "X-Ray" },
      { value: "mri", labelAr: "صورة رنين مغناطيسي (MRI)", labelEn: "MRI Scan" },
      { value: "ct", labelAr: "صورة أشعة مقطعية (CT Scan)", labelEn: "CT Scan" },
      { value: "ultrasound", labelAr: "موجات فوق صوتية", labelEn: "Ultrasound" },
    ],
  },

  // ── Cardiology ───────────────────────────────────────────────
  cardiology: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال لفحص قلبي", en: "Send for Cardiac Test" },
    holdOptions: [
      { value: "ecg", labelAr: "رسم القلب (ECG)", labelEn: "ECG / EKG" },
      { value: "echo", labelAr: "تخطيط صدى القلب (Echo)", labelEn: "Echocardiogram" },
      { value: "stress", labelAr: "اختبار الإجهاد", labelEn: "Stress Test" },
      { value: "holter", labelAr: "هولتر مونيتور (24 ساعة)", labelEn: "Holter Monitor" },
      { value: "xray", labelAr: "أشعة صدر", labelEn: "Chest X-Ray" },
    ],
  },

  // ── Neurology ────────────────────────────────────────────────
  neurology: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال لفحص عصبي", en: "Send for Neuro Test" },
    holdOptions: [
      { value: "mri_brain", labelAr: "رنين مغناطيسي دماغ", labelEn: "Brain MRI" },
      { value: "ct_brain", labelAr: "أشعة مقطعية دماغ", labelEn: "Brain CT" },
      { value: "eeg", labelAr: "رسم المخ (EEG)", labelEn: "EEG" },
      { value: "emg", labelAr: "فحص التوصيل العصبي (EMG)", labelEn: "EMG / Nerve Conduction" },
    ],
  },

  // ── Ophthalmology ────────────────────────────────────────────
  ophthalmology: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال لفحص بصري", en: "Send for Eye Test" },
    holdOptions: [
      { value: "visual_field", labelAr: "فحص المجال البصري", labelEn: "Visual Field Test" },
      { value: "oct", labelAr: "تصوير OCT للشبكية", labelEn: "OCT Scan" },
      { value: "fundus", labelAr: "تصوير قاع العين", labelEn: "Fundus Photography" },
      { value: "topography", labelAr: "خريطة القرنية (Topography)", labelEn: "Cornea Topography" },
    ],
  },

  // ── Gastroenterology ─────────────────────────────────────────
  gastroenterology: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال لفحص", en: "Send for Test" },
    holdOptions: [
      { value: "endoscopy", labelAr: "تحضير للمنظار", labelEn: "Endoscopy Prep" },
      { value: "ultrasound", labelAr: "موجات فوق صوتية البطن", labelEn: "Abdominal Ultrasound" },
      { value: "labs", labelAr: "تحاليل مخبرية", labelEn: "Lab Tests" },
    ],
  },

  // ── Urology ──────────────────────────────────────────────────
  urology: {
    hasHoldForTest: true,
    holdSectionTitle: { ar: "إرسال لفحص", en: "Send for Test" },
    holdOptions: [
      { value: "ultrasound", labelAr: "موجات فوق صوتية", labelEn: "Ultrasound" },
      { value: "labs", labelAr: "تحليل بول / دم", labelEn: "Urine / Blood Test" },
      { value: "xray", labelAr: "أشعة", labelEn: "X-Ray" },
    ],
  },

  // ── Default (no hold) ─────────────────────────────────────────
  default: {
    hasHoldForTest: false,
    holdOptions: [],
  },
};

// Specialty name → config key mapping
const SPECIALTY_MAP: Record<string, string> = {
  "orthopedics": "orthopedics",
  "العظام والمفاصل": "orthopedics",
  "عظام": "orthopedics",
  "cardiology": "cardiology",
  "أمراض القلب": "cardiology",
  "قلب": "cardiology",
  "neurology": "neurology",
  "أمراض الأعصاب": "neurology",
  "أعصاب": "neurology",
  "ophthalmology": "ophthalmology",
  "طب العيون": "ophthalmology",
  "عيون": "ophthalmology",
  "gastroenterology": "gastroenterology",
  "الجهاز الهضمي": "gastroenterology",
  "urology": "urology",
  "المسالك البولية": "urology",
};

export function getSpecialtyConfig(specialtyName: string, customConfigJson?: string | null): SpecialtyConfig {
  // Try custom config from DB first
  if (customConfigJson) {
    try {
      return JSON.parse(customConfigJson) as SpecialtyConfig;
    } catch { /* ignore */ }
  }

  // Match by name
  const lower = specialtyName.toLowerCase();
  for (const [key, configKey] of Object.entries(SPECIALTY_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return SPECIALTY_CONFIGS[configKey] ?? SPECIALTY_CONFIGS.default;
    }
  }

  return SPECIALTY_CONFIGS.default;
}
