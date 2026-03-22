import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ComplementResultsProps {
  inputValue: string;
  onesComplement: string;
  twosComplement: string;
  bitWidth: number;
  showType: '1s' | '2s' | 'both';
}

export function ComplementResults({
  inputValue,
  onesComplement,
  twosComplement,
  bitWidth,
  showType,
}: ComplementResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (onesComplement && twosComplement) {
      const text = showType === 'both'
        ? `1's: ${onesComplement}\n2's: ${twosComplement}`
        : showType === '1s'
        ? onesComplement
        : twosComplement;

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = onesComplement || twosComplement;

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
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Enter binary above</p>
        ) : (
          <div className="space-y-3">
            {(showType === '1s' || showType === 'both') && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">1's Complement</p>
                <p className="text-base font-mono text-gray-900 dark:text-white">{onesComplement}</p>
              </div>
            )}

            {(showType === '2s' || showType === 'both') && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">2's Complement</p>
                <p className="text-base font-mono text-gray-900 dark:text-white">{twosComplement}</p>
              </div>
            )}

            <p className="text-[10px] text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-800">
              Input: {inputValue} ({bitWidth} bits)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
