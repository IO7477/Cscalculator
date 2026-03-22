import { useState } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  baseFrom: number;
  error?: string;
}

export function NumberInput({ value, onChange, baseFrom, error }: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-4 mt-4">
      <div
        className={`rounded-2xl bg-gray-50 dark:bg-gray-800 border transition-all ${
          error
            ? 'border-red-600'
            : isFocused
            ? 'border-blue-600 shadow-sm'
            : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="p-3">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Number to convert</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter value"
            className="w-full bg-transparent text-lg font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || `Supports base 2–32`}
          </p>
        </div>
      </div>
    </div>
  );
}
