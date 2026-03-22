interface MetricsPanelProps {
  mode: 'stack' | 'queue';
  size: number;
  capacity: number;
  operationCount: number;
  visualizationMode: 'array' | 'linkedlist';
}

export function MetricsPanel({
  mode,
  size,
  capacity,
  operationCount,
  visualizationMode,
}: MetricsPanelProps) {
  const utilization = capacity > 0 ? ((size / capacity) * 100).toFixed(1) : '0';
  const loadFactor = size / capacity;

  return (
    <div className="px-4 mt-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">📊 Metrics & Analysis</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-lg p-2">
            <div className="text-xs text-gray-500 mb-1">Total Operations</div>
            <div className="text-lg font-bold text-blue-600">{operationCount}</div>
          </div>
          
          {visualizationMode === 'array' && (
            <div className="bg-white rounded-lg p-2">
              <div className="text-xs text-gray-500 mb-1">Utilization</div>
              <div className="text-lg font-bold text-purple-600">{utilization}%</div>
            </div>
          )}
        </div>

        {visualizationMode === 'array' && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Load Factor</span>
              <span>{size} / {capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  loadFactor >= 0.9 ? 'bg-red-500' :
                  loadFactor >= 0.7 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(loadFactor * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-2">
          <div className="text-xs font-semibold text-gray-700 mb-2">Time Complexity</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {mode === 'stack' ? (
              <>
                <div>
                  <span className="text-gray-500">push:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">pop:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">peek:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">isEmpty:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-gray-500">enqueue:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">dequeue:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">front:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-500">rear:</span>
                  <span className="ml-1 font-mono text-green-600">O(1)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {visualizationMode === 'linkedlist' && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-800">
            ℹ️ Linked list has no capacity limit (uses dynamic memory)
          </div>
        )}
      </div>
    </div>
  );
}
