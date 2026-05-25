import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getAllClients } from '../clients'
import { useI18n } from '../lib/i18n'
import { useDarkMode } from '../hooks/useDarkMode'

const BASE_URL = import.meta.env.VITE_CATALOG_BASE_URL ?? 'https://snapstock-catalog.vercel.app'

/**
 * Página de QR codes.
 *
 *   /qr           → todos los clientes (vista admin para imprimir todos juntos)
 *   /{slug}/qr    → QR individual de una tienda (para compartir / mostrar en stand)
 */
export default function QR({ client }) {
  const clients = client ? [{ slug: slugFromClient(client), ...client }] : getAllClients()
  const isSingle = !!client
  const { t, lang, setLang } = useI18n()
  const { dark, toggle: toggleDark } = useDarkMode()

  useEffect(() => {
    document.title = client ? `QR · ${client.name}` : 'QR Codes · SnapStock'
  }, [client])

  const handleShare = async () => {
    const url = `${BASE_URL}/${slugFromClient(client)}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${client.name} — Catálogo`,
          text: `Mirá el catálogo de cartas de ${client.name}`,
          url,
        })
      } catch (_) { /* cancelado por el usuario */ }
    } else {
      // Fallback desktop: copiar al portapapeles
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black text-gray-900 dark:text-gray-100">
              {client ? `${client.emoji} ${client.name}` : '⚡ SnapStock'}
            </h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {client ? t('qr_single_subtitle') : t('qr_all_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-base
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {lang === 'es' ? '🇦🇷' : '🇺🇸'}
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              title={dark ? 'Modo claro' : 'Modo oscuro'}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-base
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {isSingle ? (
              /* Vista individual → botón Compartir nativo */
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border
                           text-xs font-semibold transition"
                style={{ borderColor: `${client.color}50`, color: client.color, backgroundColor: `${client.color}08` }}
              >
                <ShareIcon /> {t('qr_share')}
              </button>
            ) : (
              /* Vista admin → imprimir todos */
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700
                           text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {t('qr_print')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* QR Cards */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className={`grid gap-6 ${clients.length === 1 ? 'justify-center' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {clients.map(c => (
            <QRCard key={c.slug} client={c} />
          ))}
        </div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          header { display: none !important; }
          body   { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function QRCard({ client }) {
  const url = `${BASE_URL}/${client.slug}`
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center gap-4">

      {/* Branding */}
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
          style={{ backgroundColor: `${client.color}18`, border: `2px solid ${client.color}40` }}
        >
          {client.emoji}
        </div>
        <p className="font-black text-gray-900 dark:text-gray-100 text-base leading-none">{client.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{client.tagline}</p>
      </div>

      {/* QR */}
      <div
        className="p-3 rounded-2xl"
        style={{ border: `3px solid ${client.color}30`, backgroundColor: `${client.color}08` }}
      >
        <QRCodeSVG
          value={url}
          size={180}
          fgColor={client.color}
          bgColor="transparent"
          level="M"
          imageSettings={{ src: '', excavate: false }}
        />
      </div>

      {/* URL + botón copiar */}
      <div className="w-full">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium text-center mb-1.5">
          {t('qr_scan_hint')}
        </p>
        <button
          onClick={handleCopy}
          title="Copiar link"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl
                     border transition group no-print"
          style={{
            borderColor: copied ? `${client.color}60` : '#e5e7eb',
            backgroundColor: copied ? `${client.color}10` : '#f9fafb',
          }}
        >
          <span
            className="text-xs font-bold truncate"
            style={{ color: client.color }}
          >
            {url}
          </span>
          <span className="shrink-0 text-base leading-none">
            {copied ? '✅' : <CopyIcon color={client.color} />}
          </span>
        </button>
        {copied && (
          <p className="text-[10px] text-center mt-1 font-semibold" style={{ color: client.color }}>
            {t('qr_copied')}
          </p>
        )}
      </div>

      {/* Link directo (no-print) */}
      <a
        href={`/${client.slug}`}
        className="no-print text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline transition"
      >
        {t('qr_open_catalog')}
      </a>
    </div>
  )
}

// ── Iconos ───────────────────────────────────────────────────────────────────

function CopyIcon({ color = '#6b7280' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.8"
         className="w-4 h-4" aria-hidden="true">
      <rect x="7" y="7" width="9" height="9" rx="1.5"/>
      <path d="M4 13V4h9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-4 h-4" aria-hidden="true">
      <circle cx="15" cy="4"  r="1.5"/>
      <circle cx="15" cy="16" r="1.5"/>
      <circle cx="5"  cy="10" r="1.5"/>
      <path d="M5 10l8.5-5.5M5 10l8.5 5.5" strokeLinecap="round"/>
    </svg>
  )
}

// Helper: buscar slug por store_id
function slugFromClient(client) {
  const all = getAllClients()
  return all.find(c => c.store_id === client.store_id)?.slug ?? ''
}
