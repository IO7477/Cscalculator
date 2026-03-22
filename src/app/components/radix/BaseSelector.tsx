import { Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BaseSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const baseOptions = [
  { value: 2, label: 'Binary (2)' },
  { value: 8, label: 'Octal (8)' },
  { value: 10, label: 'Decimal (10)' },
  { value: 16, label: 'Hexadecimal (16)' },
  { value: 32, label: 'Base 32' },
];

export function BaseSelector({ label, value, onChange }: BaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = baseOptions.find((opt) => opt.value === value) || baseOptions[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
          <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900 dark:text-white">{selectedOption.label}</span>
          <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
            {baseOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  option.value === value
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
