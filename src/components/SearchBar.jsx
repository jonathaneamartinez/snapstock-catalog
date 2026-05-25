export default function SearchBar({ value, onChange, total, filtered }) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar carta…"
        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >✕</button>
      )}
    </div>
  )
}
