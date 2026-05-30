export const SPECIALTY_ICONS: Record<string, string> = {
  // Cardiology
  "cardiology": "❤️",
  "أمراض القلب": "❤️",
  // Neurology
  "neurology": "🧠",
  "أمراض الأعصاب": "🧠",
  // Orthopedics
  "orthopedics": "🦴",
  "العظام والمفاصل": "🦴",
  // Pediatrics
  "pediatrics": "👶",
  "طب الأطفال": "👶",
  // Dermatology
  "dermatology": "✨",
  "الجلدية": "✨",
  // Ophthalmology
  "ophthalmology": "👁️",
  "طب العيون": "👁️",
  // General Medicine
  "general medicine": "🩺",
  "الطب العام": "🩺",
  // ENT
  "ent": "👂",
  "أنف وأذن وحنجرة": "👂",
  // Dentistry
  "dentistry": "🦷",
  "طب الأسنان": "🦷",
  // Psychiatry
  "psychiatry": "🧘",
  "الطب النفسي": "🧘",
  // Surgery
  "surgery": "🔬",
  "الجراحة": "🔬",
  // Obstetrics
  "obstetrics": "🤱",
  "النساء والولادة": "🤱",
  // Oncology
  "oncology": "🎗️",
  "أورام": "🎗️",
  // Urology
  "urology": "💊",
  "المسالك البولية": "💊",
  // Gastroenterology
  "gastroenterology": "🫁",
  "الجهاز الهضمي": "🫁",
  // Default
  "default": "🏥",
};

export function getSpecialtyIcon(specialtyName: string): string {
  const lower = specialtyName.toLowerCase();
  // Try exact match first
  if (SPECIALTY_ICONS[lower]) return SPECIALTY_ICONS[lower];
  // Try partial match
  for (const [key, icon] of Object.entries(SPECIALTY_ICONS)) {
    if (lower.includes(key) || key.includes(lower)) return icon;
  }
  return SPECIALTY_ICONS.default;
}
