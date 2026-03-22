type OperationType = 'left-shift' | 'right-shift' | 'rotate';

interface OperationTypeSelectorProps {
  selected: OperationType;
  onChange: (type: OperationType) => void;
}

export function OperationTypeSelector({ selected, onChange }: OperationTypeSelectorProps) {
  const types: { value: OperationType; label: string }[] = [
    { value: 'left-shift', label: 'Left Shift (<<)' },
    { value: 'right-shift', label: 'Right Shift (>>)' },
    { value: 'rotate', label: 'Rotate' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-700">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              selected === type.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
