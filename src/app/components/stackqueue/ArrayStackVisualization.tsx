interface ArrayStackVisualizationProps {
  items: (string | null)[];
  capacity: number;
  topPointer: number;
  statusMessage?: string;
}

export function ArrayStackVisualization({
  items,
  capacity,
  topPointer,
  statusMessage,
}: ArrayStackVisualizationProps) {
  const arrayView = Array(capacity).fill(null).map((_, i) => items[i] || null);

  return (
    <div className="px-4 mt-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Stack (Array)</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              Size: {topPointer + 1}
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              Top: {topPointer >= 0 ? topPointer : '-'}
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
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600'
              } ${index === topPointer ? 'ring-2 ring-purple-400 dark:ring-purple-500' : ''}`}>
                {item !== null ? item : '_'}
              </div>
              {index === topPointer && (
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold w-12">← TOP</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">isEmpty</div>
            <div className="font-semibold text-gray-900 dark:text-white">{topPointer < 0 ? 'true' : 'false'}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">isFull</div>
            <div className="font-semibold text-gray-900 dark:text-white">{topPointer >= capacity - 1 ? 'true' : 'false'}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">size()</div>
            <div className="font-semibold text-gray-900 dark:text-white">{topPointer + 1}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
