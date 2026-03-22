import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultCardProps {
  result: string;
  fromBase: number;
  toBase: number;
}

export function ResultCard({ result, fromBase, toBase }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBaseName = (base: number) => {
    const names: Record<number, string> = {
      2: 'Binary',
      8: 'Octal',
      10: 'Decimal',
      16: 'Hex',
    };
    return names[base] || `Base ${base}`;
  };

  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Result</span>
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full uppercase">
            Read-only
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900 dark:text-white font-mono flex-1 overflow-x-auto whitespace-nowrap">
            {result || <span className="text-gray-400 dark:text-gray-500 text-sm">Converted value will appear here</span>}
          </p>
          {result && (
            <button
              onClick={handleCopy}
              className="ml-3 w-7 h-7 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>
        {result && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {getBaseName(fromBase)} ({fromBase}) → {getBaseName(toBase)} ({toBase})
          </p>
        )}
      </div>
    </div>
  );
}
