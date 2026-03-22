import { Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BitWidthSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const bitWidths = [8, 16, 32];

export function BitWidthSelector({ value, onChange }: BitWidthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 mt-4 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Bit width</span>
          <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-gray-900 dark:text-white">{value} bits</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">Common sizes: 8, 16, 32</p>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
            {bitWidths.map((width) => (
              <button
                key={width}
                onClick={() => {
                  onChange(width);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  width === value
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="font-medium">{width} bits</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
