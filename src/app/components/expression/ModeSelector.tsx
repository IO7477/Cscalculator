interface ModeSelectorProps {
  mode: 'convert' | 'evaluate';
  onChange: (mode: 'convert' | 'evaluate') => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        <button
          onClick={() => onChange('convert')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'convert'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Convert Expression
        </button>
        <button
          onClick={() => onChange('evaluate')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'evaluate'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Evaluate Expression
        </button>
      </div>
    </div>
  );
}