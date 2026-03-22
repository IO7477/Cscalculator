export interface ConversionStep {
  token: string;
  stack: string;
  output: string;
  action?: string;
}

interface ConversionStepsProps {
  steps: ConversionStep[];
  currentStep?: number;
  stepThrough: boolean;
  onToggleStepThrough: () => void;
}

export function ConversionSteps({
  steps,
  currentStep,
  stepThrough,
  onToggleStepThrough,
}: ConversionStepsProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 max-h-[400px] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conversion Steps</h3>
          <button
            onClick={onToggleStepThrough}
            className={`px-2 py-1 text-xs rounded-full font-medium transition-colors ${
              stepThrough
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {stepThrough ? 'Step through' : 'All steps'}
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
            No conversion steps yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">TOKEN</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">STACK</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-semibold">OUTPUT</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      currentStep === index
                        ? 'bg-blue-100 dark:bg-blue-900/30 font-semibold'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <td className="py-2 px-2 font-mono text-gray-900 dark:text-white">{step.token}</td>
                    <td className="py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{step.stack}</td>
                    <td className="py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{step.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {steps.length > 0 && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            💡 Algorithm uses stack to handle operator precedence and parentheses
          </div>
        )}
      </div>
    </div>
  );
}
