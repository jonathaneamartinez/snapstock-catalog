import { createContext, useContext } from 'react'
import { useCart } from '../hooks/useCart'

const CartContext = createContext(null)

export function CartProvider({ storeId, color, children }) {
  const cart = useCart(storeId)
  return (
    <CartContext.Provider value={{ ...cart, color }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => useContext(CartContext)
