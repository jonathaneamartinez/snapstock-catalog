import { useI18n } from '../lib/i18n'
import { translateSetName } from '../lib/setTranslations'

const LANG_CODES = ['en', 'ja', 'zh', 'es', 'fr', 'pt']

export default function Filters({ sets, filters, onChange, color = '#3b82f6', availableLangs = [] }) {
  const { t } = useI18n()
  const sel = (k, v) => onChange({ ...filters, [k]: v })

  const SORT_OPTIONS = [
    { value: 'name_asc',   label: t('sort_name_asc')   },
    { value: 'name_desc',  label: t('sort_name_desc')  },
    { value: 'price_asc',  label: t('sort_price_asc')  },
    { value: 'price_desc', label: t('sort_price_desc') },
    { value: 'set_asc',    label: t('sort_set')        },
  ]

  // Solo muestra idiomas que realmente tienen cartas en este catálogo
  const langOptions = [
    { code: '', label: t('all_languages') },
    ...LANG_CODES
      .filter(code => availableLangs.length === 0 || availableLangs.includes(code))
      .map(code => ({ code, label: t(`lang_${code}`) })),
  ]

  const selectCls = (active) =>
    `appearance-none border rounded-xl pl-3 pr-7 py-2.5 text-sm cursor-pointer
     focus:outline-none transition shrink-0
     bg-white dark:bg-gray-800
     text-gray-700 dark:text-gray-200
     ${active ? 'font-semibold' : 'border-gray-200 dark:border-gray-700'}`

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
          <option value="">{t('all_sets')}</option>
          {sets.map(s => <option key={s} value={s}>{translateSetName(s)}</option>)}
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
          {langOptions.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
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
          className="px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-900
                     bg-red-50 dark:bg-red-950
                     text-red-500 dark:text-red-400
                     text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900 transition shrink-0"
        >
          {t('clear')}
        </button>
      )}
    </div>
  )
}
