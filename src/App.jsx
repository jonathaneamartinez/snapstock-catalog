import { getClient } from './clients'
import Catalog  from './pages/Catalog'
import QR       from './pages/QR'
import Landing  from './pages/Landing'
import NotFound from './pages/NotFound'
import { I18nProvider } from './lib/i18n'

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

  let page
  // /qr  → todos los QRs
  if (slug === 'qr') page = <QR />
  // /
  else if (!slug) page = <Landing />
  else {
    const client = getClient(slug)
    if (!client) page = <NotFound slug={slug} />
    // /{slug}/qr
    else if (sub === 'qr') page = <QR client={client} />
    // /{slug}
    else page = <Catalog client={client} />
  }

  return <I18nProvider>{page}</I18nProvider>
}
