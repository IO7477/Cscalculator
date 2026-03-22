export interface EnhancedOperation {
  type: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'peek' | 'front' | 'rear';
  value?: string;
  result: string;
  timestamp: number;
  complexity: string;
  steps?: number;
}

interface EnhancedOperationLogProps {
  operations: EnhancedOperation[];
}

export function EnhancedOperationLog({ operations }: EnhancedOperationLogProps) {
  const getOperationText = (op: EnhancedOperation) => {
    switch (op.type) {
      case 'push': return `push(${op.value})`;
      case 'pop': return `pop() → ${op.value}`;
      case 'enqueue': return `enqueue(${op.value})`;
      case 'dequeue': return `dequeue() → ${op.value}`;
      case 'peek': return `peek() → ${op.value}`;
      case 'front': return `front() → ${op.value}`;
      case 'rear': return `rear() → ${op.value}`;
      default: return '';
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 max-h-[240px] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Operation History</h3>
        {operations.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500">No operations yet.</p>
        ) : (
          <div className="space-y-1.5">
            {operations.slice(-10).reverse().map((op) => (
              <div
                key={op.timestamp}
                className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-mono font-semibold text-gray-800 dark:text-white">
                    {getOperationText(op)}
                  </div>
                  <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono rounded">
                    {op.complexity}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Result: <span className="font-mono">{op.result}</span>
                </div>
                {op.steps && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    Steps: {op.steps}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
