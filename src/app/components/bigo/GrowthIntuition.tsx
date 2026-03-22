import { ComplexityClass } from './ComplexityChips';

interface GrowthIntuitionProps {
  complexity: ComplexityClass | null;
}

function calculateSteps(complexity: ComplexityClass | null, n: number): number {
  if (!complexity) return 0;
  switch (complexity) {
    case 'O(1)': return 1;
    case 'O(log n)': return Math.round(Math.log2(n));
    case 'O(n)': return n;
    case 'O(n log n)': return Math.round(n * Math.log2(n));
    case 'O(n²)': return n * n;
    case 'O(2ⁿ)': return n <= 20 ? Math.round(Math.pow(2, n)) : Infinity;
    case 'O(n!)': return n <= 10 ? factorial(n) : Infinity;
    default: return 0;
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function formatNumber(num: number): string {
  if (num === Infinity || num > 1e9) return '> 1 billion';
  if (num >= 1e6) return `≈ ${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `≈ ${(num / 1e3).toFixed(0)}K`;
  return `≈ ${num}`;
}

export function GrowthIntuition({ complexity }: GrowthIntuitionProps) {
  if (!complexity) return null;

  const sizes = [10, 100, 1000];
  const steps = sizes.map(n => calculateSteps(complexity, n));
  const maxSteps = Math.max(...steps.filter(s => s !== Infinity));

  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">How does it grow?</h3>

        {/* Table */}
        <div className="space-y-3">
          {sizes.map((size, index) => (
            <div key={size} className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">n = {size}</span>
              <span className="text-xs font-mono text-gray-900 dark:text-white">
                {formatNumber(steps[index])} steps
              </span>
            </div>
          ))}
        </div>

        {/* Visual bars */}
        <div className="space-y-2 pt-2">
          {sizes.map((size, index) => {
            const step = steps[index];
            const width = step === Infinity ? 100 : (step / maxSteps) * 100;
            return (
              <div key={size} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-12">n={size}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(width, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
          Not exact counts, just growth comparison.
        </p>
      </div>
    </div>
  );
}
