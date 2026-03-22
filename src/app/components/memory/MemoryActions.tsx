import { Save, Check } from 'lucide-react';
import { useState } from 'react';

interface MemoryActionsProps {
  onClearAll: () => void;
  hasResult: boolean;
  calculationText: string;
}

export function MemoryActions({
  onClearAll,
  hasResult,
  calculationText,
}: MemoryActionsProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (calculationText) {
      await navigator.clipboard.writeText(calculationText);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1f2e] border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={handleSave}
          disabled={!hasResult}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            hasResult
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save calculation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
