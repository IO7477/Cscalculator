interface OperationButtonsProps {
  mode: 'stack' | 'queue';
  onPrimary: () => void;
  onSecondary: () => void;
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
}

export function OperationButtons({
  mode,
  onPrimary,
  onSecondary,
  isPrimaryDisabled,
  isSecondaryDisabled,
}: OperationButtonsProps) {
  const primaryLabel = mode === 'stack' ? 'Push' : 'Enqueue';
  const secondaryLabel = mode === 'stack' ? 'Pop' : 'Dequeue';
  const helperText =
    mode === 'stack'
      ? 'Top of stack is at the right.'
      : 'Front of queue is on the left.';

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrimary}
          disabled={isPrimaryDisabled}
          className="flex-1 h-10 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {primaryLabel}
        </button>
        <button
          onClick={onSecondary}
          disabled={isSecondaryDisabled}
          className="flex-1 h-10 rounded-full bg-white border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {secondaryLabel}
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">{helperText}</div>
    </div>
  );
}
