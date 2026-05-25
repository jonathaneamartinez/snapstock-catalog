import { getAllClients } from '../clients'
import { useI18n } from '../lib/i18n'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Landing() {
  const clients = getAllClients()
  const { t, lang, setLang } = useI18n()
  const { dark, toggle: toggleDark } = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 py-12">

      {/* Toggles top-right */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg
                     bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          {lang === 'es' ? '🇦🇷' : '🇺🇸'}
        </button>
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg
                     bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
          title={dark ? 'Modo claro' : 'Modo oscuro'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="text-center mb-8">
        <p className="text-4xl mb-2">⚡</p>
        <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">{t('landing_title')}</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('landing_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {clients.map(({ slug, name, emoji, color, tagline }) => (
          <div key={slug}
               className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800
                          shadow-sm flex items-center gap-3 px-4 py-4
                          hover:shadow-md transition-all hover:-translate-y-0.5">
            {/* Icono */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: `${color}18`, border: `2px solid ${color}40` }}
            >
              {emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <a href={`/${slug}`} className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-none hover:underline">
                {name}
              </a>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{tagline}</p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/${slug}/qr`}
                title="Ver QR"
                className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-lg leading-none transition"
              >
                📱
              </a>
              <a
                href={`/${slug}`}
                className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-sm font-bold transition"
              >
                {t('landing_open')}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Link a todos los QRs juntos */}
      <a
        href="/qr"
        className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        🖨️ Imprimir todos los QR codes
      </a>

      <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-4">{t('powered_by')}</p>
    </div>
  )
}
