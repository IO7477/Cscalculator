import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StepBreakdownProps {
  steps: string[];
  hasResult: boolean;
}

export function StepBreakdown({ steps, hasResult }: StepBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!hasResult || steps.length === 0) return null;

  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Show calculation</h3>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <pre className="font-mono text-xs text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {steps.map((step, index) => (
                  <div key={index} className={index === steps.length - 1 ? 'text-blue-700 dark:text-blue-400 font-bold' : ''}>
                    {step}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
