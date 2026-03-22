import { useState } from 'react';

interface OperationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function OperationInput({ value, onChange }: OperationInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-4 mt-4">
      <div 
        className={`rounded-2xl bg-gray-50 border transition-all ${
          isFocused ? 'border-blue-600 shadow-sm' : 'border-gray-200'
        }`}
      >
        <div className="p-3">
          <label className="text-xs font-medium text-gray-600">
            What does your algorithm do?
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g., Loop over array once and print each item"
            className="w-full bg-transparent text-sm text-gray-900 outline-none mt-1 placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used to label result & explanation
          </p>
        </div>
      </div>
    </div>
  );
}
