import { useState } from 'react';
import { Code } from 'lucide-react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeInput({ value, onChange }: CodeInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-4 mt-4">
      <div
        className={`rounded-2xl bg-white dark:bg-gray-800 border transition-all ${
          isFocused
            ? 'border-blue-600 shadow-lg'
            : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Paste your code or algorithm
            </label>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`function example(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(arr[i]);\n  }\n}`}
            className="w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none p-3 rounded-xl font-mono min-h-[200px] resize-y placeholder:text-gray-400 dark:placeholder:text-gray-600"
            spellCheck={false}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports JavaScript, Python, Java, C++, and pseudocode
            </p>
            {value && (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {value.split('\n').length} lines
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
