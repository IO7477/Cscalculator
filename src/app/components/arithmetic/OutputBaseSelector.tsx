import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface OutputBaseSelectorProps {
  outputBase: number;
  onOutputBaseChange: (base: number) => void;
}

const commonBases = [
  { value: 2, label: 'Binary' },
  { value: 8, label: 'Octal' },
  { value: 10, label: 'Decimal' },
  { value: 16, label: 'Hexadecimal' },
];

export function OutputBaseSelector({ outputBase, onOutputBaseChange }: OutputBaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBaseLabel = (base: number) => {
    const common = commonBases.find(b => b.value === base);
    return common ? `${common.label} (${base})` : `Base ${base}`;
  };

  return (
    <div className="px-4 mt-4 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all"
      >
        <div className="text-left">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Output base</p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900 dark:text-white">{getBaseLabel(outputBase)}</p>
            <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Result shown in selected base</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
            {commonBases.map((base) => (
              <button
                key={base.value}
                onClick={() => {
                  onOutputBaseChange(base.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  outputBase === base.value
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="font-medium">{base.label} ({base.value})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
