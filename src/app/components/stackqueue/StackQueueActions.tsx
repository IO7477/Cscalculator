interface StackQueueActionsProps {
  onReset: () => void;
  onCopy: () => void;
}

export function StackQueueActions({ onReset, onCopy }: StackQueueActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between mt-6">
      <button
        onClick={onReset}
        className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Reset structure
      </button>
      <button
        onClick={onCopy}
        className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Copy state
      </button>
    </div>
  );
}
