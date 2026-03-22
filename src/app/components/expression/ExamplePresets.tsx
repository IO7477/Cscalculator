interface ExamplePresetsProps {
  onExample: (expression: string) => void;
}

export function ExamplePresets({ onExample }: ExamplePresetsProps) {
  const examples = [
    { label: 'Simple: 2+3*4', value: '2 + 3 * 4' },
    { label: 'Parentheses: (2+3)*4', value: '( 2 + 3 ) * 4' },
    { label: 'Complex: 8/4-3*5+6', value: '8 / 4 - 3 * 5 + 6' },
    { label: 'Power: 2^3^2', value: '2 ^ 3 ^ 2' },
    { label: 'PDF Example', value: '8 / 4 / 3 - 5 * 6 + 7 - 2 * 9 / ( 2 + 3 - 8 ) / 9' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="text-xs text-gray-600 mb-2">Examples</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExample(example.value)}
            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
