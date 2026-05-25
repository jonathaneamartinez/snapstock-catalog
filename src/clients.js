/**
 * REGISTRO DE CLIENTES — snapstock-catalog
 * ─────────────────────────────────────────────────────────────────────────────
 * Para agregar un cliente nuevo:
 *   1. Añadir una entrada en CLIENTS con su slug (sin espacios, minúsculas)
 *   2. Completar store_id (desde SnapStock → env vars → VITE_STORE_ID del cliente)
 *   3. Deploy → disponible en catalogo.snapstock.app/{slug}
 *
 * NO hay que crear un proyecto Vercel nuevo ni configurar nada más.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CLIENTS = {
  'singles-ut': {
    store_id:   'bffc0b0a-1214-4396-ae0e-f796783b7029',
    name:       'Singles UT',
    ownerNames: ['Sebas', 'Melody'],
    color:      '#3b82f6',   // azul
    emoji:      '⚡',
    tagline:    'El mejor stock de singles de Argentina',
  },

  'jonat': {
    store_id:   '9bd85bd6-1b22-42e6-a070-862b63f37820',
    name:       'Jonat TCG',
    ownerNames: ['Jonathan'],
    color:      '#8b5cf6',   // violeta
    emoji:      '🃏',
    tagline:    'Cartas singles al mejor precio',
  },

  'ayrton': {
    store_id:   'a0c5e828-5dce-4a03-8b69-fa52a5096c34',
    name:       'Ayrton TCG',
    ownerNames: ['Ayrton', 'Agustín'],
    color:      '#10b981',   // verde
    emoji:      '🌟',
    tagline:    'Tu tienda de confianza',
  },

  // ── Plantilla para cliente nuevo ──────────────────────────────────────────
  // 'nuevo-cliente': {
  //   store_id:   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //   name:       'Nombre de la tienda',
  //   ownerNames: ['Nombre del dueño'],
  //   color:      '#f59e0b',
  //   emoji:      '🔥',
  //   tagline:    'Descripción corta',
  // },
}

/** Dado un slug de URL, devuelve la config del cliente o null */
export function getClient(slug) {
  return CLIENTS[slug?.toLowerCase()] ?? null
}

/** Lista de todos los clientes activos (para la landing) */
export function getAllClients() {
  return Object.entries(CLIENTS).map(([slug, cfg]) => ({ slug, ...cfg }))
}
