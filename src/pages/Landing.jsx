import { getAllClients } from '../clients'

/**
 * Página de inicio cuando no hay slug en la URL.
 * Muestra todos los catálogos disponibles.
 * En producción, cada cliente tiene su URL directa (/singles-ut, /ayrton, etc.)
 * y no debería ver esta pantalla — sirve para testing y para el admin.
 */
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
        {clients.map(({ slug, name, emoji, color, tagline, ownerNames }) => (
          <a
            key={slug}
            href={`/${slug}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4
                       flex items-center gap-3 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: `${color}18`, border: `2px solid ${color}40` }}
            >
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-none">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{tagline}</p>
            </div>
            <span className="text-gray-300 text-sm shrink-0">→</span>
          </a>
        ))}
      </div>

      <p className="text-[11px] text-gray-300 mt-8">Powered by SnapStock</p>
    </div>
  )
}
