import { supabase } from './supabase'

/**
 * Trae todo el stock disponible de un store, con datos de la carta.
 * @param {string} storeId — UUID del store
 * @returns {Promise<Array>}
 */
export async function fetchCatalog(storeId) {
  if (!storeId) throw new Error('storeId requerido')

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      id,
      quantity,
      sale_price_ars,
      condicion,
      cards (
        id,
        name,
        set_name,
        card_number,
        language,
        image_url
      )
    `)
    .eq('store_id', storeId)
    .eq('status', 'disponible')
    .gt('quantity', 0)
    .not('sale_price_ars', 'is', null)

  if (error) throw error

  return (data ?? [])
    .filter(row => row.cards)
    .map(row => ({
      id:          row.id,
      quantity:    row.quantity,
      precio_ars:  row.sale_price_ars,
      condicion:   row.condicion,
      nombre:      row.cards.name,
      set_name:    row.cards.set_name,
      card_number: row.cards.card_number,
      language:    row.cards.language,
      image_url:   row.cards.image_url,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
}
