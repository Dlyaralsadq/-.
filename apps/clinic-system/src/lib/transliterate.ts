const AR_MAP: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
  'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
  'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'dh',
  'ع': "'", 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
  'ة': 'a', 'ء': "'", 'ئ': 'y', 'ؤ': 'w',
  'لا': 'la', 'لأ': 'la', 'لإ': 'li', 'لآ': 'laa',
  '\u064b': '', '\u064c': '', '\u064d': '', '\u064e': '',
  '\u064f': '', '\u0650': '', '\u0651': '', '\u0652': '',
};

export function arabicToEnglish(text: string): string {
  if (!text) return '';

  let result = '';
  let i = 0;

  while (i < text.length) {
    // Try two-char match first (لا etc.)
    const two = text.slice(i, i + 2);
    if (AR_MAP[two]) {
      result += AR_MAP[two];
      i += 2;
      continue;
    }
    const one = text[i];
    if (AR_MAP[one] !== undefined) {
      result += AR_MAP[one];
    } else if (one === ' ') {
      result += ' ';
    } else if (/[a-zA-Z0-9]/.test(one)) {
      result += one;
    }
    i++;
  }

  // Capitalize each word
  return result
    .split(' ')
    .map(w => w.length > 0 ? w[0].toUpperCase() + w.slice(1) : '')
    .join(' ')
    .replace(/'+/g, '')
    .trim();
}
