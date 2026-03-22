export interface Operation {
  type: 'push' | 'pop' | 'enqueue' | 'dequeue';
  value?: string;
  result: string;
  timestamp: number;
}

interface OperationLogProps {
  operations: Operation[];
}

export function OperationLog({ operations }: OperationLogProps) {
  const getOperationText = (op: Operation) => {
    switch (op.type) {
      case 'push':
        return `Push(${op.value}) → ${op.result}`;
      case 'pop':
        return `Pop() → removed ${op.value}`;
      case 'enqueue':
        return `Enqueue(${op.value}) → ${op.result}`;
      case 'dequeue':
        return `Dequeue() → removed ${op.value}`;
      default:
        return '';
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-3 max-h-[200px] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Operations</h3>
        {operations.length === 0 ? (
          <p className="text-xs text-gray-400">No operations yet.</p>
        ) : (
          <div className="space-y-1">
            {operations.slice(-8).reverse().map((op, index) => (
              <div
                key={op.timestamp}
                className="text-xs font-mono text-gray-700 bg-white rounded px-2 py-1"
              >
                {getOperationText(op)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
