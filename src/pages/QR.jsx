import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getAllClients } from '../clients'

const BASE_URL = import.meta.env.VITE_CATALOG_BASE_URL ?? 'https://snapstock-catalog.vercel.app'

/**
 * Página de QR codes.
 *
 *   /qr           → todos los clientes (vista admin para imprimir todos juntos)
 *   /{slug}/qr    → QR individual de una tienda (para imprimir / mostrar en stand)
 */
export default function QR({ client }) {
  const clients = client ? [{ slug: slugFromClient(client), ...client }] : getAllClients()

  useEffect(() => {
    document.title = client ? `QR · ${client.name}` : 'QR Codes · SnapStock'
  }, [client])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black text-gray-900">
              {client ? `${client.emoji} ${client.name}` : '⚡ SnapStock'}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {client ? 'Código QR para tu stand' : 'Códigos QR de todas las tiendas'}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200
                       text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            🖨️ Imprimir
          </button>
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4">

      {/* Branding */}
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
          style={{ backgroundColor: `${client.color}18`, border: `2px solid ${client.color}40` }}
        >
          {client.emoji}
        </div>
        <p className="font-black text-gray-900 text-base leading-none">{client.name}</p>
        <p className="text-xs text-gray-400 mt-1">{client.tagline}</p>
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
          imageSettings={{
            src: '',
            excavate: false,
          }}
        />
      </div>

      {/* URL */}
      <div className="text-center">
        <p className="text-[11px] text-gray-400 font-medium">Escaneá para ver el catálogo</p>
        <p
          className="text-xs font-bold mt-0.5 break-all"
          style={{ color: client.color }}
        >
          {url}
        </p>
      </div>

      {/* Link directo (no-print) */}
      <a
        href={`/${client.slug}`}
        className="no-print text-xs text-gray-400 hover:text-gray-600 underline transition"
      >
        Abrir catálogo →
      </a>
    </div>
  )
}

// Helper: buscar slug por store_id
function slugFromClient(client) {
  const all = getAllClients()
  return all.find(c => c.store_id === client.store_id)?.slug ?? ''
}
