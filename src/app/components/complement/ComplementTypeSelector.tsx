type ComplementType = '1s' | '2s' | 'both';

interface ComplementTypeSelectorProps {
  selected: ComplementType;
  onChange: (type: ComplementType) => void;
}

export function ComplementTypeSelector({ selected, onChange }: ComplementTypeSelectorProps) {
  const types: { value: ComplementType; label: string }[] = [
    { value: '1s', label: "1's Complement" },
    { value: '2s', label: "2's Complement" },
    { value: 'both', label: 'Both' },
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
