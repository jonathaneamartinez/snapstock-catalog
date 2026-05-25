const LANG_FLAG = {
  en: '🇬🇧', ja: '🇯🇵', jp: '🇯🇵',
  zh: '🇨🇳', cn: '🇨🇳', es: '🇪🇸',
  fr: '🇫🇷', de: '🇩🇪', pt: '🇧🇷',
}
const COND_COLOR = {
  NM:  'bg-emerald-100 text-emerald-700',
  LP:  'bg-yellow-100  text-yellow-700',
  MP:  'bg-orange-100  text-orange-700',
  HP:  'bg-red-100     text-red-600',
  DMG: 'bg-red-200     text-red-700',
}

const fmtARS = (n) => n != null
  ? new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
    }).format(n)
  : '—'

export default function CardItem({ card, color = '#3b82f6' }) {
  const { nombre, set_name, card_number, language, image_url, precio_ars, condicion, quantity } = card
  const flag    = LANG_FLAG[language] ?? ''
  const condCls = COND_COLOR[condicion] ?? 'bg-gray-100 text-gray-600'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                    flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">

      {/* Imagen */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100
                      flex items-center justify-center p-2 pt-3">
        {quantity > 1 && (
          <span className="absolute top-2 right-2 text-white text-[10px] font-bold
                           px-1.5 py-0.5 rounded-full leading-none z-10"
                style={{ backgroundColor: color }}>
            x{quantity}
          </span>
        )}
        {image_url ? (
          <img
            src={image_url}
            alt={nombre}
            loading="lazy"
            className="w-full max-w-[140px] rounded-xl object-contain drop-shadow-md"
            style={{ aspectRatio: '5/7' }}
          />
        ) : (
          <div
            className="w-full max-w-[140px] rounded-xl flex items-center justify-center bg-gray-100"
            style={{ aspectRatio: '5/7' }}
          >
            <span className="text-3xl">🃏</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-3 py-2.5 flex-1">
        <p className="text-sm font-bold text-gray-800 leading-tight truncate" title={nombre}>
          {flag && <span className="mr-0.5">{flag}</span>}{nombre}
        </p>
        <p className="text-[11px] text-gray-400 truncate leading-tight">
          {set_name}{card_number ? ` · #${card_number}` : ''}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${condCls}`}>
            {condicion}
          </span>
          <span className="text-base font-black text-gray-900">
            {fmtARS(precio_ars)}
          </span>
        </div>
      </div>
    </div>
  )
}
