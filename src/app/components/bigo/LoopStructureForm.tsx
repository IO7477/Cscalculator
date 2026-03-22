interface LoopStructureFormProps {
  loopType: string;
  workPerElement: string;
  onLoopTypeChange: (value: string) => void;
  onWorkPerElementChange: (value: string) => void;
}

export function LoopStructureForm({ 
  loopType, 
  workPerElement, 
  onLoopTypeChange, 
  onWorkPerElementChange 
}: LoopStructureFormProps) {
  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl bg-white border border-gray-200 p-3 space-y-4">
        {/* Loop Structure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Loop structure</label>
          <select
            value={loopType}
            onChange={(e) => onLoopTypeChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="single">Single loop</option>
            <option value="nested">Nested loops</option>
            <option value="divide">Divide & conquer</option>
            <option value="none">No loop</option>
          </select>
        </div>

        {/* Work per element */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Work per element</label>
          <select
            value={workPerElement}
            onChange={(e) => onWorkPerElementChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="O(1)">O(1) each</option>
            <option value="O(log n)">O(log n) each</option>
            <option value="O(n)">O(n) each</option>
          </select>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500">
          This helps infer O(n), O(n²), O(n log n)…
        </p>
      </div>
    </div>
  );
}
