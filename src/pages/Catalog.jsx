import { useState, useEffect, useMemo } from 'react'
import { fetchCatalog } from '../lib/catalog'
import { normLang } from '../lib/normLang'
import { CartProvider } from '../context/CartContext'
import CardItem    from '../components/CardItem'
import SearchBar   from '../components/SearchBar'
import Filters     from '../components/Filters'
import CartFab     from '../components/CartFab'
import CartDrawer  from '../components/CartDrawer'

const INIT_FILTERS = { set: '', lang: '', sort: 'name_asc', search: '' }

function applySort(list, sort) {
  const s = [...list]
  switch (sort) {
    case 'name_desc':  return s.sort((a, b) => b.nombre.localeCompare(a.nombre))
    case 'price_asc':  return s.sort((a, b) => (a.precio_ars ?? 0) - (b.precio_ars ?? 0))
    case 'price_desc': return s.sort((a, b) => (b.precio_ars ?? 0) - (a.precio_ars ?? 0))
    case 'set_asc':    return s.sort((a, b) => (a.set_name ?? '').localeCompare(b.set_name ?? ''))
    default:           return s.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
}

export default function Catalog({ client }) {
  return (
    <CartProvider storeId={client.store_id} color={client.color}>
      <CatalogInner client={client} />
    </CartProvider>
  )
}

function CatalogInner({ client }) {
  const { store_id, name, color, emoji, tagline } = client

  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filters, setFilters] = useState(INIT_FILTERS)
  const [lastUpd, setLastUpd] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setLoading(true); setError(null)
    fetchCatalog(store_id)
      .then(data => { setCatalog(data); setLastUpd(new Date()) })
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false))
  }, [store_id])

  useEffect(() => {
    document.title = `${name} · Catálogo`
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [name, color])

  // Sets disponibles para el idioma seleccionado (cascada: lang → sets)
  const sets = useMemo(() => {
    const base = filters.lang
      ? catalog.filter(c => normLang(c.language) === normLang(filters.lang))
      : catalog
    return [...new Set(base.map(c => c.set_name).filter(Boolean))].sort()
  }, [catalog, filters.lang])

  // Idiomas que realmente tienen cartas en este catálogo
  const availableLangs = useMemo(
    () => [...new Set(catalog.map(c => normLang(c.language)).filter(Boolean))],
    [catalog]
  )

  // Si el set activo ya no pertenece al idioma seleccionado, lo resetea
  useEffect(() => {
    if (filters.set && !sets.includes(filters.set)) {
      setFilters(f => ({ ...f, set: '' }))
    }
  }, [sets])  // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    let list = catalog
    if (filters.lang) list = list.filter(c => normLang(c.language) === normLang(filters.lang))
    if (filters.set)  list = list.filter(c => c.set_name === filters.set)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(c =>
        c.nombre?.toLowerCase().includes(q)     ||
        c.set_name?.toLowerCase().includes(q)   ||
        c.card_number?.toLowerCase().includes(q)
      )
    }
    return applySort(list, filters.sort)
  }, [catalog, filters])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header sticky */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${color}18`, border: `2px solid ${color}40` }}
              >
                {emoji}
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-900 leading-none">{name}</h1>
                <p className="text-[11px] text-gray-400 leading-none mt-0.5">{tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!loading && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {visible.length} {visible.length === 1 ? 'carta' : 'cartas'}
                </span>
              )}
              <a
                href={`${window.location.pathname}/qr`}
                title="Ver QR de esta tienda"
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:scale-110 transition-transform"
                style={{ color }}
              >
                <QRIcon />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <SearchBar
              value={filters.search}
              onChange={v => setFilters(f => ({ ...f, search: v }))}
              color={color}
            />
            <Filters sets={sets} filters={filters} onChange={setFilters} color={color} availableLangs={availableLangs} />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-5 pb-28">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 rounded-full animate-spin"
                 style={{ borderColor: `${color}25`, borderTopColor: color }} />
            <p className="text-sm text-gray-400">Cargando catálogo…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-500 text-sm">No se pudo cargar el catálogo.</p>
            <p className="text-gray-400 text-xs mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && visible.length === 0 && catalog.length > 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-700 font-semibold text-sm">Sin resultados</p>
            <p className="text-gray-400 text-xs mt-1">Probá con otra búsqueda o limpiá los filtros</p>
            <button
              onClick={() => setFilters(INIT_FILTERS)}
              className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: color }}
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

        {!loading && !error && catalog.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-700 font-semibold text-sm">Sin stock disponible</p>
            <p className="text-gray-400 text-xs mt-1">Volvé a revisar más tarde</p>
          </div>
        )}

        {/* Grilla: 2 cols mobile, crece en pantallas más grandes */}
        {!loading && !error && visible.length > 0 && (
          <>
            {/* Título instructivo */}
            <div className="flex items-start gap-2.5 mb-4 px-0.5">
              <span className="text-lg leading-none mt-0.5">🛍️</span>
              <p className="text-[13px] text-gray-500 leading-snug">
                <span className="font-bold text-gray-700">Conocé las cartas de la tienda</span>
                {' '}y seleccionalas para luego mostrárselas al vendedor
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {visible.map(card => (
                <CardItem key={card.id} card={card} color={color} />
              ))}
            </div>
          </>
        )}

        {!loading && lastUpd && (
          <p className="text-center text-[10px] text-gray-300 mt-8">
            Actualizado {lastUpd.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            {' · '}Precios en ARS · Powered by SnapStock
          </p>
        )}
      </main>

      {/* Carrito flotante */}
      <CartFab onOpen={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

function QRIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      {/* Top-left square */}
      <rect x="3"  y="3"  width="4" height="4" rx="0.5"/>
      <rect x="2"  y="2"  width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Top-right square */}
      <rect x="15" y="3"  width="4" height="4" rx="0.5"/>
      <rect x="14" y="2"  width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Bottom-left square */}
      <rect x="3"  y="15" width="4" height="4" rx="0.5"/>
      <rect x="2"  y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Data dots bottom-right area */}
      <rect x="14" y="14" width="2" height="2" rx="0.3"/>
      <rect x="17" y="14" width="2" height="2" rx="0.3"/>
      <rect x="20" y="14" width="2" height="2" rx="0.3"/>
      <rect x="14" y="17" width="2" height="2" rx="0.3"/>
      <rect x="17" y="17" width="5" height="2" rx="0.3"/>
      <rect x="20" y="20" width="2" height="2" rx="0.3"/>
      <rect x="14" y="20" width="5" height="2" rx="0.3"/>
    </svg>
  )
}
