const LANG_OPTIONS = [
  { code: '',   label: 'Todos los idiomas' },
  { code: 'en', label: '🇬🇧 Inglés'    },
  { code: 'ja', label: '🇯🇵 Japonés'   },
  { code: 'zh', label: '🇨🇳 Chino'     },
  { code: 'es', label: '🇪🇸 Español'   },
  { code: 'fr', label: '🇫🇷 Francés'   },
  { code: 'pt', label: '🇧🇷 Portugués' },
]

const SORT_OPTIONS = [
  { value: 'name_asc',   label: 'A → Z'     },
  { value: 'name_desc',  label: 'Z → A'     },
  { value: 'price_asc',  label: 'Precio ↑'  },
  { value: 'price_desc', label: 'Precio ↓'  },
  { value: 'set_asc',    label: 'Por set'   },
]

export default function Filters({ sets, filters, onChange, color = '#3b82f6' }) {
  const sel = (k, v) => onChange({ ...filters, [k]: v })

  const selectCls = (active) =>
    `appearance-none border rounded-xl pl-3 pr-7 py-2.5 text-sm bg-white
     cursor-pointer focus:outline-none transition shrink-0
     ${active ? 'font-semibold' : 'border-gray-200 text-gray-700'}`

  const activeStyle = (active) => active
    ? { borderColor: `${color}80`, backgroundColor: `${color}10`, color }
    : {}

  return (
    <div className="flex flex-wrap gap-2">

      {/* Set */}
      <div className="relative">
        <select
          value={filters.set}
          onChange={e => sel('set', e.target.value)}
          className={selectCls(!!filters.set)}
          style={activeStyle(!!filters.set)}
        >
          <option value="">Todos los sets</option>
          {sets.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▾</span>
      </div>

      {/* Idioma */}
      <div className="relative">
        <select
          value={filters.lang}
          onChange={e => sel('lang', e.target.value)}
          className={selectCls(!!filters.lang)}
          style={activeStyle(!!filters.lang)}
        >
          {LANG_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▾</span>
      </div>

      {/* Orden */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={e => sel('sort', e.target.value)}
          className={selectCls(false)}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▾</span>
      </div>

      {/* Limpiar filtros */}
      {(filters.set || filters.lang || filters.search) && (
        <button
          onClick={() => onChange({ set: '', lang: '', sort: filters.sort, search: '' })}
          className="px-3 py-2.5 rounded-xl border border-red-200 bg-red-50
                     text-red-500 text-xs font-semibold hover:bg-red-100 transition shrink-0"
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  )
}
