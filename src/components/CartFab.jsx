import { useCartContext } from '../context/CartContext'

/**
 * Botón flotante (bottom-right) que muestra el conteo del carrito.
 * Al tocar abre el drawer.
 */
export default function CartFab({ onOpen }) {
  const { items, color } = useCartContext()
  if (items.length === 0) return null

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-4 z-40 flex items-center gap-2
                 pl-4 pr-3 py-3 rounded-2xl shadow-xl text-white font-bold text-sm
                 transition-all duration-200 active:scale-95 hover:opacity-90"
      style={{ backgroundColor: color }}
    >
      <span>🛍️ Mi lista</span>
      <span className="bg-white text-xs font-black rounded-xl px-2 py-0.5"
            style={{ color }}>
        {items.length}
      </span>
    </button>
  )
}
