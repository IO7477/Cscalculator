export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

interface OperationSelectorProps {
  selected: Operation;
  onChange: (operation: Operation) => void;
}

export function OperationSelector({ selected, onChange }: OperationSelectorProps) {
  const operations: { value: Operation; label: string }[] = [
    { value: 'add', label: 'Add (+)' },
    { value: 'subtract', label: 'Subtract (−)' },
    { value: 'multiply', label: 'Multiply (×)' },
    { value: 'divide', label: 'Divide (÷)' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-700">
        {operations.map((op) => (
          <button
            key={op.value}
            onClick={() => onChange(op.value)}
            className={`flex-1 px-2 py-2 rounded-full text-xs font-medium transition-all ${
              selected === op.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}
