import { ArrowRight } from 'lucide-react';

interface LinkedListQueueVisualizationProps {
  items: string[];
  statusMessage?: string;
}

export function LinkedListQueueVisualization({
  items,
  statusMessage,
}: LinkedListQueueVisualizationProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Queue (Linked List)</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Nodes: {items.length}
          </span>
        </div>

        {statusMessage && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-medium ${
            statusMessage.includes('underflow')
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {statusMessage}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">front → NULL ← rear</div>
              <p className="text-xs text-gray-400">Queue is empty</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <div className="text-xs text-blue-600 font-semibold">front →</div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {items.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-1">
                  <div className="border-2 border-green-400 rounded-lg p-2 bg-green-50 min-w-[80px]">
                    <div className="text-xs text-gray-500 mb-1">data</div>
                    <div className="text-sm font-bold text-green-900 mb-2">{item}</div>
                    <div className="text-xs text-gray-500">next →</div>
                  </div>
                  {index < items.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              ))}
              <div className="text-xs text-gray-400 flex-shrink-0">NULL</div>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <div className="text-xs text-orange-600 font-semibold">
                ← rear (points to last node)
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          <div className="space-y-1">
            <div>• <span className="font-mono">front</span> points to first node (dequeue here)</div>
            <div>• <span className="font-mono">rear</span> points to last node (enqueue here)</div>
            <div>• No capacity limit (dynamic memory)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
