import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface BitwiseResultsProps {
  inputValue: string;
  resultDecimal: number | null;
  resultBinary: string;
  resultHex: string;
  bitWidth: number;
  operationDescription: string;
}

export function BitwiseResults({
  inputValue,
  resultDecimal,
  resultBinary,
  resultHex,
  bitWidth,
  operationDescription,
}: BitwiseResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (resultDecimal !== null) {
      const text = `Decimal: ${resultDecimal}\nBinary: ${resultBinary}\nHex: ${resultHex}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = resultDecimal !== null;

  // Format binary with spaces every 4 bits
  const formatBinary = (binary: string) => {
    return binary.match(/.{1,4}/g)?.join(' ') || binary;
  };

  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Results</span>
          {hasResults && (
            <button
              onClick={handleCopyAll}
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

        {!hasResults ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Set parameters above</p>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Decimal</p>
              <p className="text-base font-mono text-gray-900 dark:text-white">{resultDecimal}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Binary ({bitWidth} bits)</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{formatBinary(resultBinary)}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Hex</p>
              <p className="text-base font-mono text-gray-900 dark:text-white">{resultHex}</p>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-800">
              {operationDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
