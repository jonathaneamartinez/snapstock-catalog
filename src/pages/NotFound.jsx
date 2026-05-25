import { useI18n } from '../lib/i18n'
import { useDarkMode } from '../hooks/useDarkMode'

export default function NotFound({ slug }) {
  const { t, lang, setLang } = useI18n()
  const { dark, toggle: toggleDark } = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 text-center">

      {/* Toggles top-right */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg
                     bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
        >
          {lang === 'es' ? '🇦🇷' : '🇺🇸'}
        </button>
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg
                     bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <p className="text-5xl mb-4">🔍</p>
      <h1 className="text-lg font-black text-gray-800 dark:text-gray-100">{t('notfound_title')}</h1>
      {slug && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {t('notfound_sub')}
        </p>
      )}
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition"
      >
        {t('notfound_back')}
      </a>
    </div>
  )
}
