import { useState, useEffect, useMemo } from 'react'
import { fetchCatalog } from './lib/catalog'
import CardItem  from './components/CardItem'
import SearchBar from './components/SearchBar'
import Filters   from './components/Filters'

const STORE_NAME  = import.meta.env.VITE_STORE_NAME  ?? 'Tienda'
const STORE_COLOR = import.meta.env.VITE_STORE_COLOR ?? '#3b82f6'

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

export default function App() {
  const [catalog,  setCatalog]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [filters,  setFilters]  = useState(INIT_FILTERS)
  const [lastUpd,  setLastUpd]  = useState(null)

  useEffect(() => {
    fetchCatalog()
      .then(data => {
        setCatalog(data)
        setLastUpd(new Date())
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Sets únicos disponibles
  const sets = useMemo(
    () => [...new Set(catalog.map(c => c.set_name).filter(Boolean))].sort(),
    [catalog]
  )

  // Aplicar filtros + búsqueda + orden
  const visible = useMemo(() => {
    let list = catalog

    if (filters.set)    list = list.filter(c => c.set_name === filters.set)
    if (filters.lang) {
      const norm = { jp: 'ja', cn: 'zh' }
      const target = norm[filters.lang] ?? filters.lang
      list = list.filter(c => {
        const lang = c.language ?? 'en'
        return (norm[lang] ?? lang) === target
      })
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(c =>
        c.nombre?.toLowerCase().includes(q) ||
        c.set_name?.toLowerCase().includes(q)
      )
    }

    return applySort(list, filters.sort)
  }, [catalog, filters])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header sticky */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h1 className="text-sm font-black text-gray-900 leading-none">{STORE_NAME}</h1>
                <p className="text-[11px] text-gray-400 leading-none mt-0.5">Catálogo · Cartas disponibles</p>
              </div>
            </div>
            {!loading && (
              <span className="shrink-0 text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {visible.length} {visible.length === 1 ? 'carta' : 'cartas'}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <SearchBar
              value={filters.search}
              onChange={v => setFilters(f => ({ ...f, search: v }))}
            />
            <Filters
              sets={sets}
              filters={filters}
              onChange={setFilters}
            />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-5">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 rounded-full animate-spin"
                 style={{ borderColor: `${STORE_COLOR}25`, borderTopColor: STORE_COLOR }} />
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

        {!loading && !error && visible.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-700 font-semibold text-sm">Sin resultados</p>
            <p className="text-gray-400 text-xs mt-1">Probá con otra búsqueda o limpiá los filtros</p>
            <button
              onClick={() => setFilters(INIT_FILTERS)}
              className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: STORE_COLOR }}
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="grid gap-3"
               style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {visible.map(card => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}

        {!loading && lastUpd && (
          <p className="text-center text-[10px] text-gray-300 mt-8 pb-6">
            Actualizado {lastUpd.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            {' · '}Precios en ARS
          </p>
        )}
      </main>
    </div>
  )
}
