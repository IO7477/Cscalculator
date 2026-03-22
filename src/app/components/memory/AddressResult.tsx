import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface AddressResultProps {
  arrayNotation: string;
  addressHex: string;
  addressDecimal: number;
  addressBinary: string;
  hasResult: boolean;
}

export function AddressResult({
  arrayNotation,
  addressHex,
  addressDecimal,
  addressBinary,
  hasResult,
}: AddressResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (addressHex) {
      await navigator.clipboard.writeText(addressHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="rounded-xl bg-gray-100 dark:bg-[#0a0e14] p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {hasResult ? `Address of ${arrayNotation}` : 'Calculated Address'}
          </span>
          {hasResult && (
            <button
              onClick={handleCopy}
              className="w-7 h-7 bg-purple-600 dark:bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors"
              aria-label="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Copy className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>

        {!hasResult ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Enter array parameters above</p>
        ) : (
          <div className="space-y-2">
            <p className="text-2xl font-mono font-medium text-gray-900 dark:text-white">{addressHex}</p>
            <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                <span className="font-medium">Decimal:</span> {addressDecimal}
              </p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
                <span className="font-medium">Binary:</span> {addressBinary}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
