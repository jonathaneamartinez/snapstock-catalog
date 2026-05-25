import { useState } from 'react'
import { useCartContext } from '../context/CartContext'
import SellerView from './SellerView'

const fmtARS = (n) => n != null
  ? new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
    }).format(n)
  : '—'

/**
 * Bottom sheet que muestra el resumen del carrito.
 * Desde acá se puede abrir la vista vendedor fullscreen.
 */
export default function CartDrawer({ open, onClose }) {
  const { items, total, remove, clear, color } = useCartContext()
  const [sellerOpen, setSellerOpen] = useState(false)

  if (!open && !sellerOpen) return null

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Bottom sheet */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl
                        flex flex-col max-h-[80vh]"
             style={{ borderTop: `3px solid ${color}30` }}>

          {/* Handle + header */}
          <div className="flex flex-col items-center pt-3 pb-2 px-5">
            <div className="w-10 h-1 bg-gray-200 rounded-full mb-3" />
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="font-black text-gray-900 text-base leading-none">Mi lista</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {items.length} {items.length === 1 ? 'carta' : 'cartas'} · {fmtARS(total)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clear}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold transition"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center
                             text-gray-500 hover:bg-gray-200 transition text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Lista de ítems */}
          <div className="flex-1 overflow-y-auto px-4 pb-2">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-3xl mb-2">🛍️</p>
                <p className="text-sm text-gray-400">Todavía no agregaste cartas</p>
                <p className="text-xs text-gray-300 mt-1">Tocá el <strong>+</strong> en cualquier carta</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {items.map(card => (
                  <CartItem key={card.id} card={card} onRemove={() => remove(card.id)} color={color} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-2">
              {/* Total */}
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-gray-500">Total estimado</span>
                <span className="text-lg font-black text-gray-900">{fmtARS(total)}</span>
              </div>
              {/* CTA principal */}
              <button
                onClick={() => { onClose(); setSellerOpen(true) }}
                className="w-full py-3.5 rounded-2xl text-white text-sm font-bold
                           hover:opacity-90 transition active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: color }}
              >
                🛍️ Mostrar al vendedor
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vista fullscreen vendedor */}
      {sellerOpen && (
        <SellerView onClose={() => setSellerOpen(false)} />
      )}
    </>
  )
}

function CartItem({ card, onRemove, color }) {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Imagen chica */}
      {card.image_url ? (
        <img
          src={card.image_url}
          alt={card.nombre}
          className="w-10 h-14 object-cover rounded-lg shrink-0"
        />
      ) : (
        <div className="w-10 h-14 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-base">
          🃏
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{card.nombre}</p>
        <p className="text-[11px] text-gray-400 truncate">
          {card.set_name}{card.card_number ? ` · #${card.card_number}` : ''}
        </p>
        <p className="text-sm font-black mt-0.5" style={{ color }}>
          {fmtARS(card.precio_ars)}
        </p>
      </div>

      {/* Quitar */}
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center
                   text-gray-400 hover:bg-red-100 hover:text-red-400 transition shrink-0 text-xs font-bold"
      >
        ✕
      </button>
    </div>
  )
}
