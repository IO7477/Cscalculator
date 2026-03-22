interface OperationButtons2Props {
  mode: 'stack' | 'queue';
  onPush?: () => void;
  onPop?: () => void;
  onPeek?: () => void;
  onEnqueue?: () => void;
  onDequeue?: () => void;
  onFrontPeek?: () => void;
  onRearPeek?: () => void;
  isPushDisabled?: boolean;
  isPopDisabled?: boolean;
  isEnqueueDisabled?: boolean;
  isDequeueDisabled?: boolean;
  isPeekDisabled?: boolean;
}

export function OperationButtons2({
  mode,
  onPush,
  onPop,
  onPeek,
  onEnqueue,
  onDequeue,
  onFrontPeek,
  onRearPeek,
  isPushDisabled,
  isPopDisabled,
  isEnqueueDisabled,
  isDequeueDisabled,
  isPeekDisabled,
}: OperationButtons2Props) {
  if (mode === 'stack') {
    return (
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onPush}
            disabled={isPushDisabled}
            className="h-10 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Push
          </button>
          <button
            onClick={onPop}
            disabled={isPopDisabled}
            className="h-10 rounded-full bg-white border border-gray-300 text-gray-800 font-medium text-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pop
          </button>
          <button
            onClick={onPeek}
            disabled={isPeekDisabled}
            className="h-10 rounded-full bg-white border border-purple-300 text-purple-700 font-medium text-xs hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Peek
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Top of stack is at the right. All operations: O(1)
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          onClick={onEnqueue}
          disabled={isEnqueueDisabled}
          className="h-10 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enqueue
        </button>
        <button
          onClick={onDequeue}
          disabled={isDequeueDisabled}
          className="h-10 rounded-full bg-white border border-gray-300 text-gray-800 font-medium text-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dequeue
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onFrontPeek}
          disabled={isPeekDisabled}
          className="h-9 rounded-full bg-white border border-purple-300 text-purple-700 font-medium text-xs hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Front Peek
        </button>
        <button
          onClick={onRearPeek}
          disabled={isPeekDisabled}
          className="h-9 rounded-full bg-white border border-purple-300 text-purple-700 font-medium text-xs hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rear Peek
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">
        Front is on the left. All operations: O(1)
      </div>
    </div>
  );
}
