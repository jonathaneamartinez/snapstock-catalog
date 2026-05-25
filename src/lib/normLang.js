/**
 * Normaliza variantes de código de idioma al código canónico.
 * 'jp'/'japanese' → 'ja'  |  'cn'/'chinese' → 'zh'  |  null → 'en'
 */
export function normLang(code) {
  const c = (code ?? '').toLowerCase().trim()
  if (!c) return 'en'
  if (['ja', 'jp', 'japanese'].includes(c)) return 'ja'
  if (['zh', 'cn', 'chinese'].includes(c))  return 'zh'
  if (['pt', 'br'].includes(c))             return 'pt'
  return c
}

export function sameLang(a, b) {
  return normLang(a) === normLang(b)
}
