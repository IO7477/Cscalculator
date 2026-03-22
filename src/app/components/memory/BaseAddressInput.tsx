import { useState } from 'react';

interface BaseAddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BaseAddressInput({ value, onChange }: BaseAddressInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all p-4 ${
        isFocused ? 'border-purple-600 dark:border-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Base address (α)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="0x2000"
        className="w-full bg-transparent text-base font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Starting memory address (hex or decimal)
      </p>
    </div>
  );
}