import { useCartContext } from '../context/CartContext'

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

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900">Mi lista de cartas</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {items.length} {items.length === 1 ? 'carta' : 'cartas'} seleccionadas
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center
                     text-gray-500 hover:bg-gray-200 transition font-bold text-sm"
        >
          ✕
        </button>
      </div>

      {/* Lista de cartas */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <p className="text-4xl">🛍️</p>
            <p className="text-gray-500 font-semibold text-sm">La lista está vacía</p>
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
        <div className="border-t border-gray-100 px-5 py-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Total estimado</span>
            <span className="text-2xl font-black text-gray-900">{fmtARS(total)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { clear(); onClose() }}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500
                         text-sm font-semibold hover:bg-gray-50 transition"
            >
              🗑 Vaciar lista
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-white text-sm font-bold
                         hover:opacity-90 transition"
              style={{ backgroundColor: color }}
            >
              ← Seguir eligiendo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SellerCard({ card, onRemove, color }) {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
      {/* Imagen */}
      <div className="relative flex items-center justify-center p-2 bg-white">
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-100
                     text-red-400 text-xs flex items-center justify-center
                     hover:bg-red-200 transition z-10"
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
            className="w-full max-w-[120px] rounded-lg bg-gray-100 flex items-center justify-center"
            style={{ aspectRatio: '5/7' }}
          >
            <span className="text-2xl">🃏</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-2.5 py-2">
        <p className="text-xs font-bold text-gray-800 leading-tight truncate">{card.nombre}</p>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{card.set_name}</p>
        <p className="text-sm font-black mt-1.5" style={{ color }}>{fmtARS(card.precio_ars)}</p>
      </div>
    </div>
  )
}
