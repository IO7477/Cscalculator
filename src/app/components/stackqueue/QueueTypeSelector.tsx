interface QueueTypeSelectorProps {
  queueType: 'linear' | 'circular';
  onChange: (type: 'linear' | 'circular') => void;
}

export function QueueTypeSelector({ queueType, onChange }: QueueTypeSelectorProps) {
  return (
    <div className="px-4 mt-4">
      <div className="text-xs text-gray-600 mb-2">Queue Type</div>
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        <button
          onClick={() => onChange('linear')}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            queueType === 'linear'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Linear
        </button>
        <button
          onClick={() => onChange('circular')}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            queueType === 'circular'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Circular
        </button>
      </div>
    </div>
  );
}
