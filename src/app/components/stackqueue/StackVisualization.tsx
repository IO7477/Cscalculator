import { ArrowDown } from 'lucide-react';

interface StackVisualizationProps {
  items: string[];
}

export function StackVisualization({ items }: StackVisualizationProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3 min-h-[220px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Stack</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Size: {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex items-center justify-center h-[160px]">
            <p className="text-xs text-gray-400 text-center">
              Stack is empty. Use Push to add items.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex flex-col-reverse gap-1">
              {items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-900 font-medium relative"
                >
                  {item}
                  {index === items.length - 1 && (
                    <div className="absolute -right-14 flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-gray-500 rotate-90" />
                      <span className="text-xs text-gray-500 font-medium">Top</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
