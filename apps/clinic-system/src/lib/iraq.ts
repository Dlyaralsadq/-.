export interface District {
  id: string;
  ar: string;
  en: string;
}

export interface Governorate {
  id: string;
  ar: string;
  en: string;
  lat: number;
  lng: number;
  districts: District[];
}

export const IRAQ_GOVERNORATES: Governorate[] = [
  {
    id: "baghdad", ar: "بغداد", en: "Baghdad", lat: 33.3152, lng: 44.3661,
    districts: [
      { id: "karkh",       ar: "الكرخ",          en: "Karkh" },
      { id: "rusafa",      ar: "الرصافة",         en: "Rusafa" },
      { id: "adhamiya",    ar: "الأعظمية",        en: "Adhamiyah" },
      { id: "kadhimiya",   ar: "الكاظمية",        en: "Kadhimiyah" },
      { id: "mansour",     ar: "المنصور",         en: "Mansour" },
      { id: "karrada",     ar: "الكرادة",         en: "Karrada" },
      { id: "zayouna",     ar: "الزيونة",         en: "Zayouna" },
      { id: "sadr_city",   ar: "مدينة الصدر",     en: "Sadr City" },
      { id: "dora",        ar: "الدورة",          en: "Dora" },
      { id: "bayaa",       ar: "البياع",          en: "Bayaa" },
      { id: "shuala",      ar: "الشعلة",          en: "Shuala" },
      { id: "abu_ghraib",  ar: "أبو غريب",       en: "Abu Ghraib" },
      { id: "mahmoudiya",  ar: "المحمودية",       en: "Mahmoudiyah" },
      { id: "tarmiya",     ar: "الطارمية",        en: "Tarmiyah" },
      { id: "madain",      ar: "المدائن",         en: "Madain" },
      { id: "new_baghdad", ar: "بغداد الجديدة",   en: "New Baghdad" },
      { id: "amil",        ar: "العامل",          en: "Amil" },
      { id: "zafaraniya",  ar: "الزعفرانية",      en: "Zafaraniyah" },
    ],
  },
  {
    id: "basra", ar: "البصرة", en: "Basra", lat: 30.5085, lng: 47.7804,
    districts: [
      { id: "basra_city",   ar: "البصرة",         en: "Basra City" },
      { id: "qurna",        ar: "القرنة",          en: "Qurna" },
      { id: "abu_khasib",   ar: "أبو الخصيب",     en: "Abu Al-Khasib" },
      { id: "fao",          ar: "الفاو",           en: "Fao" },
      { id: "zubair",       ar: "الزبير",          en: "Zubair" },
      { id: "shat_arab",    ar: "شط العرب",        en: "Shatt Al-Arab" },
      { id: "al_madina",    ar: "المدينة",         en: "Al-Madina" },
      { id: "hartha",       ar: "الهارثة",         en: "Hartha" },
      { id: "midaina",      ar: "الميدين",         en: "Al-Midaina" },
    ],
  },
  {
    id: "nineveh", ar: "نينوى", en: "Nineveh", lat: 36.3450, lng: 43.1450,
    districts: [
      { id: "mosul",       ar: "الموصل",          en: "Mosul" },
      { id: "talafar",     ar: "تلعفر",           en: "Talafar" },
      { id: "sinjar",      ar: "سنجار",           en: "Sinjar" },
      { id: "hamdaniya",   ar: "الحمدانية",       en: "Hamdaniyah" },
      { id: "makhmour",    ar: "مخمور",           en: "Makhmour" },
      { id: "nimrud",      ar: "النمرود",         en: "Nimrud" },
      { id: "akre",        ar: "أكرى",            en: "Akre" },
      { id: "bashiqa",     ar: "بعشيقة",          en: "Bashiqa" },
      { id: "baaj",        ar: "البعاج",          en: "Baaj" },
      { id: "rabia",       ar: "ربيعة",           en: "Rabia" },
    ],
  },
  {
    id: "erbil", ar: "أربيل", en: "Erbil", lat: 36.1912, lng: 44.0092,
    districts: [
      { id: "erbil_city",  ar: "أربيل",           en: "Erbil City" },
      { id: "koya",        ar: "كوية",            en: "Koya" },
      { id: "shaqlawa",    ar: "شقلاوة",          en: "Shaqlawa" },
      { id: "rawanduz",    ar: "روانز",           en: "Rawanduz" },
      { id: "soran",       ar: "سوران",           en: "Soran" },
      { id: "makhmour_e",  ar: "مخمور",           en: "Makhmour" },
      { id: "mergasur",    ar: "مرغسور",          en: "Mergasur" },
    ],
  },
  {
    id: "sulaymaniyah", ar: "السليمانية", en: "Sulaymaniyah", lat: 35.5578, lng: 45.4350,
    districts: [
      { id: "suly_city",   ar: "السليمانية",      en: "Sulaymaniyah City" },
      { id: "halabja",     ar: "حلبجة",           en: "Halabja" },
      { id: "kalar",       ar: "كلار",            en: "Kalar" },
      { id: "jamjamal",    ar: "جمجمال",          en: "Jamjamal" },
      { id: "ranya",       ar: "رانية",           en: "Ranya" },
      { id: "dukan",       ar: "دوكان",           en: "Dukan" },
      { id: "penjwin",     ar: "بنجوين",          en: "Penjwin" },
      { id: "dokan",       ar: "دربندخان",        en: "Darbandikhan" },
    ],
  },
  {
    id: "duhok", ar: "دهوك", en: "Duhok", lat: 36.8669, lng: 42.9866,
    districts: [
      { id: "duhok_city",  ar: "دهوك",            en: "Duhok City" },
      { id: "zakho",       ar: "زاخو",            en: "Zakho" },
      { id: "amadiya",     ar: "العمادية",         en: "Amadiyah" },
      { id: "aqra",        ar: "عقرة",            en: "Aqra" },
      { id: "bardarash",   ar: "بردرش",           en: "Bardarash" },
      { id: "shekhan",     ar: "الشيخان",         en: "Shekhan" },
    ],
  },
  {
    id: "kirkuk", ar: "كركوك", en: "Kirkuk", lat: 35.4681, lng: 44.3922,
    districts: [
      { id: "kirkuk_city", ar: "كركوك",           en: "Kirkuk City" },
      { id: "daquq",       ar: "داقوق",           en: "Daquq" },
      { id: "hawija",      ar: "الحويجة",         en: "Hawija" },
      { id: "dibis",       ar: "دبس",             en: "Dibis" },
    ],
  },
  {
    id: "anbar", ar: "الأنبار", en: "Anbar", lat: 33.4455, lng: 43.3001,
    districts: [
      { id: "ramadi",      ar: "الرمادي",         en: "Ramadi" },
      { id: "falluja",     ar: "الفلوجة",         en: "Falluja" },
      { id: "heet",        ar: "هيت",             en: "Heet" },
      { id: "qaim",        ar: "القائم",           en: "Al-Qaim" },
      { id: "haditha",     ar: "حديثة",           en: "Haditha" },
      { id: "rutba",       ar: "الرطبة",          en: "Rutba" },
      { id: "ana",         ar: "عانة",            en: "Ana" },
      { id: "rawa",        ar: "راوة",            en: "Rawa" },
    ],
  },
  {
    id: "diyala", ar: "ديالى", en: "Diyala", lat: 33.7456, lng: 44.6415,
    districts: [
      { id: "baquba",      ar: "بعقوبة",          en: "Baquba" },
      { id: "khanaqin",    ar: "خانقين",          en: "Khanaqin" },
      { id: "muqdadiya",   ar: "المقدادية",       en: "Muqdadiyah" },
      { id: "kifri",       ar: "كفري",            en: "Kifri" },
      { id: "balad_ruz",   ar: "بلدروز",          en: "Balad Ruz" },
    ],
  },
  {
    id: "saladin", ar: "صلاح الدين", en: "Saladin", lat: 34.5370, lng: 43.5800,
    districts: [
      { id: "tikrit",      ar: "تكريت",           en: "Tikrit" },
      { id: "baiji",       ar: "بيجي",            en: "Baiji" },
      { id: "samarra",     ar: "سامراء",          en: "Samarra" },
      { id: "balad",       ar: "بلد",             en: "Balad" },
      { id: "dour",        ar: "الدور",           en: "Al-Dour" },
      { id: "shirqat",     ar: "الشرقاط",         en: "Shirqat" },
      { id: "tuz",         ar: "طوز خورماتو",     en: "Tuz Khurmatu" },
    ],
  },
  {
    id: "wasit", ar: "واسط", en: "Wasit", lat: 32.5150, lng: 45.8162,
    districts: [
      { id: "kut",         ar: "الكوت",           en: "Kut" },
      { id: "numaniya",    ar: "النعمانية",       en: "Al-Numaniyah" },
      { id: "hay",         ar: "الحي",            en: "Al-Hay" },
      { id: "suwaira",     ar: "الصويرة",         en: "Al-Suwaira" },
      { id: "badra",       ar: "بدرة",            en: "Badra" },
    ],
  },
  {
    id: "babil", ar: "بابل", en: "Babil", lat: 32.4786, lng: 44.4208,
    districts: [
      { id: "hilla",       ar: "الحلة",           en: "Hilla" },
      { id: "mahawil",     ar: "المحاويل",        en: "Mahawil" },
      { id: "hashimiya",   ar: "الهاشمية",        en: "Hashimiyah" },
      { id: "musayyib",    ar: "المسيب",          en: "Musayyib" },
      { id: "nil",         ar: "النيل",           en: "Nile" },
    ],
  },
  {
    id: "karbala", ar: "كربلاء", en: "Karbala", lat: 32.6157, lng: 44.0243,
    districts: [
      { id: "karbala_city",ar: "كربلاء",          en: "Karbala City" },
      { id: "hindiya",     ar: "الهندية",         en: "Hindiyah" },
      { id: "ain_tamur",   ar: "عين التمر",       en: "Ain Tamur" },
    ],
  },
  {
    id: "najaf", ar: "النجف", en: "Najaf", lat: 32.0000, lng: 44.3356,
    districts: [
      { id: "najaf_city",  ar: "النجف",           en: "Najaf City" },
      { id: "kufa",        ar: "الكوفة",          en: "Kufa" },
      { id: "manathera",   ar: "المناذرة",        en: "Manathera" },
      { id: "abu_sukhair", ar: "أبو صخير",        en: "Abu Sukhair" },
    ],
  },
  {
    id: "qadisiyah", ar: "القادسية", en: "Qadisiyah", lat: 32.0000, lng: 44.9500,
    districts: [
      { id: "diwaniya",    ar: "الديوانية",       en: "Diwaniyah" },
      { id: "shamiya",     ar: "الشامية",         en: "Shamiyah" },
      { id: "afak",        ar: "عفك",             en: "Afak" },
      { id: "hamza",       ar: "الحمزة",          en: "Al-Hamza" },
    ],
  },
  {
    id: "muthanna", ar: "المثنى", en: "Muthanna", lat: 31.3231, lng: 45.2847,
    districts: [
      { id: "samawa",      ar: "السماوة",         en: "Samawa" },
      { id: "rumaitha",    ar: "الرميثة",         en: "Rumaitha" },
      { id: "khidr",       ar: "الخضر",           en: "Al-Khidr" },
    ],
  },
  {
    id: "thi_qar", ar: "ذي قار", en: "Thi Qar", lat: 31.0446, lng: 46.2569,
    districts: [
      { id: "nasiriya",    ar: "الناصرية",        en: "Nasiriyah" },
      { id: "suq_shuyukh", ar: "سوق الشيوخ",      en: "Suq Al-Shuyukh" },
      { id: "shatrah",     ar: "الشطرة",          en: "Shatrah" },
      { id: "rifai",       ar: "الرفاعي",         en: "Al-Rifai" },
      { id: "jabayish",    ar: "الجبايش",         en: "Al-Jabayish" },
    ],
  },
  {
    id: "maysan", ar: "ميسان", en: "Maysan", lat: 31.8495, lng: 47.1517,
    districts: [
      { id: "amara",       ar: "العمارة",         en: "Amara" },
      { id: "qalat_salih", ar: "قلعة صالح",       en: "Qalat Salih" },
      { id: "majar_kabir", ar: "المجر الكبير",     en: "Al-Majar Al-Kabir" },
      { id: "ali_gharbi",  ar: "علي الغربي",      en: "Ali Al-Gharbi" },
    ],
  },
];

export function getGovernorate(id: string): Governorate | undefined {
  return IRAQ_GOVERNORATES.find((g) => g.id === id);
}

export function inferGovFromAddress(address: string): Governorate | undefined {
  if (!address) return undefined;
  return IRAQ_GOVERNORATES.find(
    (g) =>
      address.includes(g.ar) ||
      address.toLowerCase().includes(g.en.toLowerCase())
  );
}

export const SPECIALTY_ICONS: Record<string, string> = {
  cardiology:       "🫀",
  neurology:        "🧠",
  orthopedics:      "🦴",
  pediatrics:       "👶",
  dermatology:      "🧴",
  ophthalmology:    "👁️",
  "general-medicine": "🩺",
  dentistry:        "🦷",
  ent:              "👂",
  pulmonology:      "🫁",
  endocrinology:    "⚗️",
  rheumatology:     "🦾",
  urology:          "🔬",
  psychiatry:       "🧘",
  oncology:         "🎗️",
  obstetrics:       "🤱",
  nephrology:       "💉",
  hematology:       "🩸",
  surgery:          "🔪",
  emergency:        "🚨",
  radiology:        "🩻",
};

export function getSpecialtyIcon(specialtyId: string): string {
  return SPECIALTY_ICONS[specialtyId] ?? "🏥";
}

// Legacy alias for old code
export const GOVERNORATES = IRAQ_GOVERNORATES.map(({ id, ar, en }) => ({ id, ar, en }));
