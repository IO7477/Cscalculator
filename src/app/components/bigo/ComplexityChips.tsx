export type ComplexityClass = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)' | 'O(n!)';

interface ComplexityChipsProps {
  selected: ComplexityClass | null;
  onChange: (complexity: ComplexityClass) => void;
}

export function ComplexityChips({ selected, onChange }: ComplexityChipsProps) {
  const complexities: ComplexityClass[] = [
    'O(1)',
    'O(log n)',
    'O(n)',
    'O(n log n)',
    'O(n²)',
    'O(2ⁿ)',
    'O(n!)',
  ];

  return (
    <div className="px-4 mt-4">
      <label className="text-xs font-medium text-gray-600 block mb-3">
        Choose complexity class
      </label>
      <div className="flex flex-wrap gap-2">
        {complexities.map((complexity) => (
          <button
            key={complexity}
            onClick={() => onChange(complexity)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              selected === complexity
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {complexity}
          </button>
        ))}
      </div>
    </div>
  );
}
