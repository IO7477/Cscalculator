// BinaryInput.tsx
import { useState } from 'react';

interface BinaryInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BinaryInput({ value, onChange, error }: BinaryInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (newValue: string) => {
    const filtered = newValue.replace(/[^01]/g, '');
    onChange(filtered);
  };

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
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Binary number</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="10101010"
            className="w-full bg-transparent text-lg font-medium font-mono text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || 'Enter 8–32 bits (0s and 1s only)'}
          </p>
        </div>
      </div>
    </div>
  );
}
