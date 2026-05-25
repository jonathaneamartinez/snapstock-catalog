import { useState, useEffect, useCallback } from 'react'

/**
 * Carrito anónimo persistido en localStorage.
 * Clave por store para que cada tienda tenga su propio carrito.
 *
 * Cada ítem: { id, nombre, set_name, card_number, image_url, precio_ars, condicion, language }
 */
export function useCart(storeId) {
  const KEY = `snapstock_cart_${storeId}`

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // Persistir en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch { /* quota exceeded — ignorar */ }
  }, [items, KEY])

  const isInCart = useCallback(
    (id) => items.some(i => i.id === id),
    [items]
  )

  const toggle = useCallback((card) => {
    setItems(prev =>
      prev.some(i => i.id === card.id)
        ? prev.filter(i => i.id !== card.id)   // quitar
        : [...prev, card]                       // agregar
    )
  }, [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + (i.precio_ars ?? 0), 0)

  return { items, total, isInCart, toggle, remove, clear }
}
