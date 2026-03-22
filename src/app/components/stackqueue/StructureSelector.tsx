interface StructureSelectorProps {
  mode: 'stack' | 'queue';
  onChange: (mode: 'stack' | 'queue') => void;
}

export function StructureSelector({ mode, onChange }: StructureSelectorProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        <button
          onClick={() => onChange('stack')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'stack'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Stack (LIFO)
        </button>
        <button
          onClick={() => onChange('queue')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'queue'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Queue (FIFO)
        </button>
      </div>
    </div>
  );
}
