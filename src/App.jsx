import { getClient } from './clients'
import Catalog  from './pages/Catalog'
import Landing  from './pages/Landing'
import NotFound from './pages/NotFound'

/**
 * Router mínimo sin dependencias — lee el slug del pathname.
 *
 *   /              → Landing (lista de todas las tiendas)
 *   /singles-ut    → Catálogo de Singles UT
 *   /jonat         → Catálogo de Jonat TCG
 *   /ayrton        → Catálogo de Ayrton TCG
 *   /desconocido   → NotFound
 *
 * Para agregar un cliente: editar src/clients.js, no tocar este archivo.
 */
export default function App() {
  const slug   = window.location.pathname.split('/').filter(Boolean)[0] ?? ''
  const client = getClient(slug)

  if (!slug)    return <Landing />
  if (!client)  return <NotFound slug={slug} />
  return <Catalog client={client} />
}
