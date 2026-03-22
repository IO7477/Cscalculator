import { Copy, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface BitwiseActionsProps {
  onReset: () => void;
  resultDecimal: number | null;
  resultBinary: string;
  resultHex: string;
}

export function BitwiseActions({
  onReset,
  resultDecimal,
  resultBinary,
  resultHex,
}: BitwiseActionsProps) {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleCopyAll}
          disabled={!hasResults}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            hasResults
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy all formats
            </>
          )}
        </button>
      </div>
    </div>
  );
}
