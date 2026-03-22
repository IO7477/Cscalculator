// RotateModeToggle.tsx
import { Info } from 'lucide-react';

interface RotateModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function RotateModeToggle({ enabled, onChange }: RotateModeToggleProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-7 rounded-full transition-colors ${
              enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Circular rotation (wraps around)
          </span>
        </div>
        <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </div>
    </div>
  );
}
