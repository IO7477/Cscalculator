export interface EvaluationStep {
  token: string;
  stackBefore: string;
  stackAfter: string;
  operation?: string;
}

interface EvaluationTraceProps {
  steps: EvaluationStep[];
  result: number | null;
  currentStep?: number;
}

export function EvaluationTrace({ steps, result, currentStep }: EvaluationTraceProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 max-h-[400px] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Evaluation Stack Trace</h3>

        {steps.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
            No evaluation steps yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">Token</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">Stack Before</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">Stack After</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">Operation</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      currentStep === index
                        ? 'bg-green-100 dark:bg-green-900/30 font-semibold'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <td className="py-2 px-2 font-mono text-gray-900 dark:text-white">{step.token}</td>
                    <td className="py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{step.stackBefore}</td>
                    <td className="py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{step.stackAfter}</td>
                    <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{step.operation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result !== null && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
            <div className="text-sm font-semibold text-green-900 dark:text-green-300">
              Final Result: <span className="font-mono text-lg">{result}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
