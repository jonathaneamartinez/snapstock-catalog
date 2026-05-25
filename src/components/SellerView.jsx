import { useCartContext } from '../context/CartContext'
import { useI18n } from '../lib/i18n'

const fmtARS = (n) => n != null
  ? new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
    }).format(n)
  : '—'

/**
 * Vista fullscreen para mostrarle la lista al vendedor.
 * Sin distracciones: solo las cartas seleccionadas y el total.
 */
export default function SellerView({ onClose }) {
  const { items, total, remove, clear, color } = useCartContext()
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-base font-black text-gray-900 dark:text-gray-100">{t('seller_title')}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {t('seller_subtitle')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                     text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-bold text-sm"
        >
          {t('close')}
        </button>
      </div>

      {/* Lista de cartas */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <p className="text-4xl">🛍️</p>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{t('cart_empty_title')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map(card => (
              <SellerCard key={card.id} card={card} onRemove={() => remove(card.id)} color={color} />
            ))}
          </div>
        )}
      </div>

      {/* Footer con total */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('cart_total')}</span>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{fmtARS(total)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { clear(); onClose() }}
              className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700
                         text-gray-500 dark:text-gray-400 text-sm font-semibold
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {t('seller_clear')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-white text-sm font-bold
                         hover:opacity-90 transition"
              style={{ backgroundColor: color }}
            >
              {t('seller_back')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SellerCard({ card, onRemove, color }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
      {/* Imagen */}
      <div className="relative flex items-center justify-center p-2 bg-white dark:bg-gray-900">
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40
                     text-red-400 text-xs flex items-center justify-center
                     hover:bg-red-200 dark:hover:bg-red-900 transition z-10"
        >
          ✕
        </button>
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.nombre}
            className="w-full max-w-[120px] rounded-lg object-contain drop-shadow-sm"
            style={{ aspectRatio: '5/7' }}
          />
        ) : (
          <div
            className="w-full max-w-[120px] rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            style={{ aspectRatio: '5/7' }}
          >
            <span className="text-2xl">🃏</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-2.5 py-2">
        <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">{card.nombre}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{card.set_name}</p>
        <p className="text-sm font-black mt-1.5" style={{ color }}>{fmtARS(card.precio_ars)}</p>
      </div>
    </div>
  )
}
