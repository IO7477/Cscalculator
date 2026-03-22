import { ComplexityClass } from './ComplexityChips';

interface ComparisonStripProps {
  currentComplexity: ComplexityClass | null;
  onCompare: (complexity: ComplexityClass) => void;
}

interface ComparisonItem {
  complexity: ComplexityClass;
  label: string;
}

export function ComparisonStrip({ currentComplexity, onCompare }: ComparisonStripProps) {
  const comparisons: ComparisonItem[] = [
    { complexity: 'O(1)', label: 'O(1) – constant' },
    { complexity: 'O(log n)', label: 'O(log n) – logarithmic' },
    { complexity: 'O(n)', label: 'O(n) – linear' },
    { complexity: 'O(n log n)', label: 'O(n log n) – linearithmic' },
    { complexity: 'O(n²)', label: 'O(n²) – quadratic' },
    { complexity: 'O(2ⁿ)', label: 'O(2ⁿ) – exponential' },
    { complexity: 'O(n!)', label: 'O(n!) – factorial' },
  ];

  if (!currentComplexity) return null;

  return (
    <div className="px-4 mt-4">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-3">
        Compare classes
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {comparisons.map((item) => (
          <button
            key={item.complexity}
            onClick={() => onCompare(item.complexity)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
              currentComplexity === item.complexity
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
