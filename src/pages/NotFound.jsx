export default function NotFound({ slug }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h1 className="text-lg font-black text-gray-800">Tienda no encontrada</h1>
      {slug && (
        <p className="text-sm text-gray-400 mt-1">
          No existe un catálogo para <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{slug}</code>
        </p>
      )}
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition"
      >
        Ver todas las tiendas
      </a>
    </div>
  )
}
