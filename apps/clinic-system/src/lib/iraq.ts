export const GOVERNORATES = [
  { id: "baghdad",    ar: "بغداد",       en: "Baghdad" },
  { id: "basra",      ar: "البصرة",      en: "Basra" },
  { id: "nineveh",    ar: "نينوى",       en: "Nineveh" },
  { id: "erbil",      ar: "أربيل",       en: "Erbil" },
  { id: "sulaymaniyah", ar: "السليمانية", en: "Sulaymaniyah" },
  { id: "duhok",      ar: "دهوك",        en: "Duhok" },
  { id: "kirkuk",     ar: "كركوك",       en: "Kirkuk" },
  { id: "anbar",      ar: "الأنبار",     en: "Anbar" },
  { id: "diyala",     ar: "ديالى",       en: "Diyala" },
  { id: "saladin",    ar: "صلاح الدين",  en: "Saladin" },
  { id: "wasit",      ar: "واسط",        en: "Wasit" },
  { id: "babil",      ar: "بابل",        en: "Babil" },
  { id: "karbala",    ar: "كربلاء",      en: "Karbala" },
  { id: "najaf",      ar: "النجف",       en: "Najaf" },
  { id: "qadisiyah",  ar: "القادسية",    en: "Qadisiyah" },
  { id: "muthanna",   ar: "المثنى",      en: "Muthanna" },
  { id: "thi_qar",    ar: "ذي قار",      en: "Thi Qar" },
  { id: "maysan",     ar: "ميسان",       en: "Maysan" },
];

export const SPECIALTY_ICONS: Record<string, string> = {
  "cardiology":       "🫀",
  "neurology":        "🧠",
  "orthopedics":      "🦴",
  "pediatrics":       "👶",
  "dermatology":      "🧴",
  "ophthalmology":    "👁️",
  "general-medicine": "🩺",
  "dentistry":        "🦷",
  "ent":              "👂",
  "pulmonology":      "🫁",
  "endocrinology":    "⚗️",
  "rheumatology":     "🦾",
  "urology":          "🔬",
  "psychiatry":       "🧘",
  "oncology":         "🎗️",
  "obstetrics":       "🤱",
  "nephrology":       "💉",
  "hematology":       "🩸",
  "surgery":          "🔪",
  "emergency":        "🚨",
  "radiology":        "🩻",
};

export function getSpecialtyIcon(specialtyId: string): string {
  return SPECIALTY_ICONS[specialtyId] ?? "🏥";
}
