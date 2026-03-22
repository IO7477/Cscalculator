import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultCardProps {
  result: string;
  operand1: string;
  operand2: string;
  base1: number;
  base2: number;
  outputBase: number;
  operatorSymbol: string;
  hasResult: boolean;
}

export function ResultCard({
  result,
  operand1,
  operand2,
  base1,
  base2,
  outputBase,
  operatorSymbol,
  hasResult,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSubscript = (base: number) => {
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    return base.toString().split('').map(d => subscripts[parseInt(d)]).join('');
  };

  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Result</span>
          {hasResult && (
            <button
              onClick={handleCopy}
              className="w-7 h-7 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {!hasResult ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Enter operands above</p>
        ) : (
          <div>
            <p className="text-xl font-mono font-medium text-gray-900 dark:text-white break-all">{result}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {operand1}{getSubscript(base1)} {operatorSymbol} {operand2}{getSubscript(base2)} = {result}{getSubscript(outputBase)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
