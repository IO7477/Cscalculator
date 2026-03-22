interface VisualizationModeSelectorProps {
  mode: 'array' | 'linkedlist';
  onChange: (mode: 'array' | 'linkedlist') => void;
}

export function VisualizationModeSelector({ mode, onChange }: VisualizationModeSelectorProps) {
  return (
    <div className="px-4 mt-4">
      <div className="text-xs text-gray-600 mb-2">Visualization Mode</div>
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        <button
          onClick={() => onChange('array')}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'array'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Array
        </button>
        <button
          onClick={() => onChange('linkedlist')}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'linkedlist'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Linked List
        </button>
      </div>
    </div>
  );
}
