import { ArrowRight } from 'lucide-react';

interface LinkedListStackVisualizationProps {
  items: string[];
  statusMessage?: string;
}

export function LinkedListStackVisualization({
  items,
  statusMessage,
}: LinkedListStackVisualizationProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Stack (Linked List)</h3>
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
              <div className="text-xs text-gray-400 mb-1">top → NULL</div>
              <p className="text-xs text-gray-400">Stack is empty</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-purple-600 font-semibold mb-2">top ↓</div>
            {items.slice().reverse().map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-2">
                <div className="flex-1 border-2 border-blue-400 rounded-lg p-2 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">data</div>
                      <div className="text-sm font-bold text-blue-900">{item}</div>
                    </div>
                    <div className="border-l-2 border-blue-300 pl-2 ml-2">
                      <div className="text-xs text-gray-500 mb-1">next</div>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-400 text-center">↓ NULL</div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          <div className="space-y-1">
            <div>• <span className="font-mono">top</span> always points to the most recent node</div>
            <div>• No capacity limit (dynamic memory)</div>
            <div>• Each node has <span className="font-mono">data</span> and <span className="font-mono">next</span> pointer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
