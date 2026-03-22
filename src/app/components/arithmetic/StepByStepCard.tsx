import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Operation } from './OperationSelector';

interface StepByStepCardProps {
  operation: Operation;
  operand1Binary: string;
  operand2Binary: string;
  resultBinary: string;
  hasResult: boolean;
}

export function StepByStepCard({
  operation,
  operand1Binary,
  operand2Binary,
  resultBinary,
  hasResult,
}: StepByStepCardProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!hasResult) return null;

  const getOperationTitle = () => {
    switch (operation) {
      case 'add': return 'Addition steps (base 2)';
      case 'subtract': return 'Subtraction steps (base 2)';
      case 'multiply': return 'Multiplication steps (base 2)';
      case 'divide': return 'Division steps (base 2)';
    }
  };

  const getOperatorSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
    }
  };

  const maxLen = Math.max(operand1Binary.length, operand2Binary.length, resultBinary.length);
  const op1 = operand1Binary.padStart(maxLen, ' ');
  const op2 = operand2Binary.padStart(maxLen, ' ');
  const res = resultBinary.padStart(maxLen, ' ');

  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{getOperationTitle()}</h3>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {showSteps ? (
              <>
                Hide steps
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show steps
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {showSteps && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 overflow-x-auto">
            <pre className="font-mono text-sm text-gray-900 dark:text-white whitespace-pre">
              <div className="flex flex-col gap-0.5">
                <div className="text-gray-600 dark:text-gray-400">  {op1}  ← Operand 1</div>
                <div className="text-gray-600 dark:text-gray-400">{getOperatorSymbol()} {op2}  ← Operand 2</div>
                <div className="text-gray-400 dark:text-gray-600">{'-'.repeat(maxLen + 2)}</div>
                <div className="font-bold text-blue-700 dark:text-blue-400">  {res}  ← Result</div>
              </div>
            </pre>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {operation === 'add' && 'Binary addition is performed column by column from right to left with carry propagation.'}
              {operation === 'subtract' && 'Binary subtraction uses borrowing when needed, similar to decimal subtraction.'}
              {operation === 'multiply' && 'Binary multiplication uses shift and add method for each bit.'}
              {operation === 'divide' && 'Binary division follows long division process with quotient and remainder.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
