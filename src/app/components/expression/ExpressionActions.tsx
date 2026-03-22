interface ExpressionActionsProps {
  onClear: () => void;
  onCopySteps: () => void;
}

export function ExpressionActions({ onClear, onCopySteps }: ExpressionActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between mt-6">
      <button
        onClick={onClear}
        className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onCopySteps}
        className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Copy all steps
      </button>
    </div>
  );
}
