import { getClient } from './clients'
import Catalog  from './pages/Catalog'
import QR       from './pages/QR'
import Landing  from './pages/Landing'
import NotFound from './pages/NotFound'

/**
 * Router mínimo sin dependencias — lee el pathname.
 *
 *   /              → Landing (lista de todas las tiendas)
 *   /qr            → QR codes de todas las tiendas (admin)
 *   /{slug}        → Catálogo de esa tienda
 *   /{slug}/qr     → QR code individual de esa tienda
 *   /desconocido   → NotFound
 *
 * Para agregar un cliente: editar src/clients.js únicamente.
 */
export default function App() {
  const parts  = window.location.pathname.split('/').filter(Boolean)
  const slug   = parts[0] ?? ''
  const sub    = parts[1] ?? ''   // 'qr' u otra sub-ruta futura

  // /qr  → todos los QRs
  if (slug === 'qr') return <QR />

  // /
  if (!slug) return <Landing />

  const client = getClient(slug)

  if (!client) return <NotFound slug={slug} />

  // /{slug}/qr
  if (sub === 'qr') return <QR client={client} />

  // /{slug}
  return <Catalog client={client} />
}
