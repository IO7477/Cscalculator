interface ArrayQueueVisualizationProps {
  items: (string | null)[];
  capacity: number;
  frontPointer: number;
  rearPointer: number;
  queueType: 'linear' | 'circular';
  statusMessage?: string;
}

export function ArrayQueueVisualization({
  items,
  capacity,
  frontPointer,
  rearPointer,
  queueType,
  statusMessage,
}: ArrayQueueVisualizationProps) {
  const arrayView = Array(capacity).fill(null).map((_, i) => items[i] || null);

  const size = frontPointer === -1 ? 0 :
    queueType === 'circular'
      ? (rearPointer >= frontPointer ? rearPointer - frontPointer + 1 : capacity - frontPointer + rearPointer + 1)
      : (rearPointer - frontPointer + 1);

  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Queue ({queueType === 'circular' ? 'Circular' : 'Linear'} Array)
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              Size: {size}
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-medium ${
            statusMessage.includes('overflow')
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              : statusMessage.includes('underflow')
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
          }`}>
            {statusMessage}
          </div>
        )}

        <div className="space-y-1">
          {arrayView.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">[{index}]</div>
              <div className={`flex-1 h-9 rounded-lg flex items-center justify-center text-sm font-medium border ${
                item !== null
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-900 dark:text-green-200'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600'
              } ${
                index === frontPointer && index === rearPointer
                  ? 'ring-2 ring-purple-400 dark:ring-purple-500'
                  : index === frontPointer
                  ? 'ring-2 ring-blue-400 dark:ring-blue-500'
                  : index === rearPointer
                  ? 'ring-2 ring-orange-400 dark:ring-orange-500'
                  : ''
              }`}>
                {item !== null ? item : '_'}
              </div>
              <div className="text-xs font-semibold w-16">
                {index === frontPointer && index === rearPointer && frontPointer !== -1 && (
                  <span className="text-purple-600 dark:text-purple-400">F,R</span>
                )}
                {index === frontPointer && index !== rearPointer && frontPointer !== -1 && (
                  <span className="text-blue-600 dark:text-blue-400">← Front</span>
                )}
                {index === rearPointer && index !== frontPointer && rearPointer !== -1 && (
                  <span className="text-orange-600 dark:text-orange-400">← Rear</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-3 text-xs mb-2">
            <div>
              <div className="text-gray-500 dark:text-gray-400">front</div>
              <div className="font-semibold text-gray-900 dark:text-white">{frontPointer >= 0 ? frontPointer : '-1 (empty)'}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">rear</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rearPointer >= 0 ? rearPointer : '-1 (empty)'}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">isEmpty</div>
              <div className="font-semibold text-gray-900 dark:text-white">{frontPointer === -1 ? 'true' : 'false'}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">isFull</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {queueType === 'circular'
                  ? ((rearPointer + 1) % capacity === frontPointer && frontPointer !== -1 ? 'true' : 'false')
                  : (rearPointer >= capacity - 1 ? 'true' : 'false')
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">size()</div>
              <div className="font-semibold text-gray-900 dark:text-white">{size}</div>
            </div>
          </div>

          {queueType === 'circular' && (
            <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs text-purple-800 dark:text-purple-300">
              <strong>Circular:</strong> rear wraps using (rear + 1) % {capacity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
