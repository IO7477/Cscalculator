import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface BigOActionsProps {
  onReset: () => void;
  summaryText: string;
  hasResult: boolean;
}

export function BigOActions({ onReset, summaryText, hasResult }: BigOActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summaryText) return;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl">
      <div className="px-4 py-4 flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={onReset}
          className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Reset
        </button>

        <button
          onClick={handleCopy}
          disabled={!hasResult}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            hasResult
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
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
              Copy summary
            </>
          )}
        </button>
      </div>
    </div>
  );
}
