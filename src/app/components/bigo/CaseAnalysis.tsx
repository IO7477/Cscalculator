import { TrendingDown, Activity, TrendingUp } from 'lucide-react';

interface CaseAnalysisProps {
  bestCase?: string;
  averageCase?: string;
  worstCase?: string;
  spaceComplexity?: string;
}

export function CaseAnalysis({ bestCase, averageCase, worstCase, spaceComplexity }: CaseAnalysisProps) {
  if (!bestCase && !averageCase && !worstCase) return null;

  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Complexity Analysis
        </h3>

        <div className="space-y-2">
          {bestCase && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Case</span>
              </div>
              <code className="text-sm font-semibold text-green-700 dark:text-green-400">{bestCase}</code>
            </div>
          )}

          {averageCase && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Case</span>
              </div>
              <code className="text-sm font-semibold text-blue-700 dark:text-blue-400">{averageCase}</code>
            </div>
          )}

          {worstCase && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Worst Case</span>
              </div>
              <code className="text-sm font-semibold text-orange-700 dark:text-orange-400">{worstCase}</code>
            </div>
          )}

          {spaceComplexity && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mt-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Space Complexity</span>
              </div>
              <code className="text-sm font-semibold text-purple-700 dark:text-purple-400">{spaceComplexity}</code>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 <strong>Note:</strong> Big O typically refers to worst-case time complexity unless specified otherwise.
          </p>
        </div>
      </div>
    </div>
  );
}
