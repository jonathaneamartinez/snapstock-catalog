import { useCartContext } from '../context/CartContext'

const LANG_FLAG = {
  en: '🇬🇧', ja: '🇯🇵', jp: '🇯🇵',
  zh: '🇨🇳', cn: '🇨🇳', es: '🇪🇸',
  fr: '🇫🇷', de: '🇩🇪', pt: '🇧🇷',
}
const COND_COLOR = {
  NM:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  LP:  'bg-yellow-100  text-yellow-700  dark:bg-yellow-900/40  dark:text-yellow-400',
  MP:  'bg-orange-100  text-orange-700  dark:bg-orange-900/40  dark:text-orange-400',
  HP:  'bg-red-100     text-red-600     dark:bg-red-900/40     dark:text-red-400',
  DMG: 'bg-red-200     text-red-700     dark:bg-red-900/50     dark:text-red-300',
}

const fmtARS = (n) => n != null
  ? new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
    }).format(n)
  : '—'

export default function CardItem({ card, color = '#3b82f6' }) {
  const { nombre, set_name, card_number, language, image_url, precio_ars, condicion, quantity } = card
  const flag    = LANG_FLAG[language] ?? ''
  const condCls = COND_COLOR[condicion] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'

  const { isInCart, toggle } = useCartContext()
  const inCart = isInCart(card.id)

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden
                  flex flex-col transition-all duration-150
                  hover:shadow-md hover:-translate-y-0.5
                  ${inCart ? 'ring-2' : 'border-gray-100 dark:border-gray-700'}`}
      style={inCart ? { ringColor: color, borderColor: color, boxShadow: `0 0 0 2px ${color}` } : {}}
    >
      {/* Imagen */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                      flex items-center justify-center p-2 pt-3">

        {/* Badge cantidad en stock */}
        {quantity > 1 && (
          <span className="absolute top-2 left-2 text-white text-[10px] font-bold
                           px-1.5 py-0.5 rounded-full leading-none z-10"
                style={{ backgroundColor: color }}>
            x{quantity}
          </span>
        )}

        {/* Botón agregar/quitar carrito */}
        <button
          onClick={() => toggle(card)}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center
                     text-sm font-black shadow-sm transition-all duration-150 active:scale-90"
          style={inCart
            ? { backgroundColor: color, color: 'white' }
            : { backgroundColor: 'white', color: '#9ca3af', border: '1.5px solid #e5e7eb' }
          }
          title={inCart ? 'Quitar de la lista' : 'Agregar a la lista'}
        >
          {inCart ? '✓' : '+'}
        </button>

        {image_url ? (
          <img
            src={image_url}
            alt={nombre}
            loading="lazy"
            onClick={() => toggle(card)}
            className="w-full max-w-[140px] rounded-xl object-contain drop-shadow-md cursor-pointer"
            style={{ aspectRatio: '5/7' }}
          />
        ) : (
          <div
            className="w-full max-w-[140px] rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 cursor-pointer"
            onClick={() => toggle(card)}
            style={{ aspectRatio: '5/7' }}
          >
            <span className="text-3xl">🃏</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-3 py-2.5 flex-1">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight truncate" title={nombre}>
          {flag && <span className="mr-0.5">{flag}</span>}{nombre}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate leading-tight">
          {set_name}{card_number ? ` · #${card_number}` : ''}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${condCls}`}>
            {condicion}
          </span>
          <span className="text-sm font-black text-gray-900 dark:text-gray-100">
            {fmtARS(precio_ars)}
          </span>
        </div>
      </div>
    </div>
  )
}
