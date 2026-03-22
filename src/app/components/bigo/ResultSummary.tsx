import { ComplexityClass } from './ComplexityChips';

interface ResultSummaryProps {
  complexity: ComplexityClass | null;
  description: string;
  examples: string;
}

export function ResultSummary({ complexity, description, examples }: ResultSummaryProps) {
  if (!complexity) return null;

  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Time complexity</span>
          <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-100 text-gray-900 text-xs font-medium uppercase">
            Worst-case
          </span>
        </div>

        {/* Main complexity */}
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {complexity}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Examples */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {examples}
        </p>
      </div>
    </div>
  );
}
