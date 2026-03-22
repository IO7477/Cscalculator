import { ArrowDown } from 'lucide-react';

interface QueueVisualizationProps {
  items: string[];
}

export function QueueVisualization({ items }: QueueVisualizationProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3 min-h-[220px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Queue</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Size: {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex items-center justify-center h-[160px]">
            <p className="text-xs text-gray-400 text-center">
              Queue is empty. Use Enqueue to add items.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 mb-3 overflow-x-auto pb-2">
              {items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="min-w-[48px] w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-900 font-medium flex-shrink-0"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <ArrowDown className="w-3 h-3 text-gray-500 -rotate-90" />
                <span className="text-xs text-gray-500 font-medium">Front</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">Rear</span>
                <ArrowDown className="w-3 h-3 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
