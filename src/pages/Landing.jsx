import { getAllClients } from '../clients'

export default function Landing() {
  const clients = getAllClients()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-4xl mb-2">⚡</p>
        <h1 className="text-xl font-black text-gray-900">SnapStock Catálogos</h1>
        <p className="text-sm text-gray-400 mt-1">Seleccioná una tienda para ver su stock</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {clients.map(({ slug, name, emoji, color, tagline }) => (
          <div key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm
                                     flex items-center gap-3 px-4 py-4
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
              <a href={`/${slug}`} className="font-bold text-gray-900 text-sm leading-none hover:underline">
                {name}
              </a>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{tagline}</p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/${slug}/qr`}
                title="Ver QR"
                className="text-gray-300 hover:text-gray-500 text-lg leading-none transition"
              >
                📱
              </a>
              <a
                href={`/${slug}`}
                className="text-gray-300 hover:text-gray-500 text-sm font-bold transition"
              >
                →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Link a todos los QRs juntos */}
      <a
        href="/qr"
        className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition"
      >
        🖨️ Imprimir todos los QR codes
      </a>

      <p className="text-[11px] text-gray-300 mt-4">Powered by SnapStock</p>
    </div>
  )
}
