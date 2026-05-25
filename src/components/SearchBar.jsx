import { useI18n } from '../lib/i18n'

export default function SearchBar({ value, onChange, color = '#3b82f6' }) {
  const { t } = useI18n()

  return (
    <div className="relative flex-1 min-w-0">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('search_placeholder')}
        className="w-full pl-9 pr-9 py-2.5 border border-gray-200 dark:border-gray-700
                   rounded-xl text-sm bg-white dark:bg-gray-800
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:outline-none transition"
        onFocus={e  => e.target.style.boxShadow = `0 0 0 2px ${color}35`}
        onBlur={e   => e.target.style.boxShadow = ''}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          ✕
        </button>
      )}
    </div>
  )
}
