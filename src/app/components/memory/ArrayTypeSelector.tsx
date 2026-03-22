export type ArrayType = '1d' | '2d' | '3d' | 'record';

interface ArrayTypeSelectorProps {
  selected: ArrayType;
  onChange: (type: ArrayType) => void;
  dimensions?: number;
  onDimensionsChange?: (dims: number) => void;
}

export function ArrayTypeSelector({ selected, onChange, dimensions = 3, onDimensionsChange }: ArrayTypeSelectorProps) {
  const types: { value: ArrayType; label: string }[] = [
    { value: '1d', label: '1D Array' },
    { value: '2d', label: '2D Array' },
    { value: '3d', label: '3D+ Array' },
    { value: 'record', label: 'Record' },
  ];

  return (
    <div className="px-4 mt-4 space-y-3">
      <div className="bg-gray-100 dark:bg-[#1a1f2e] rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-700">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`flex-1 px-2 py-2 rounded-full text-xs font-medium transition-all ${
              selected === type.value
                ? 'bg-purple-600 dark:bg-purple-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Dimension selector for 3D+ arrays */}
      {selected === '3d' && onDimensionsChange && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dimensions:</label>
          <select
            value={dimensions}
            onChange={(e) => onDimensionsChange(parseInt(e.target.value))}
            className="flex-1 px-4 py-2 bg-white dark:bg-[#131820] border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 focus:border-transparent"
          >
            <option value={3}>3D Array (i, j, k)</option>
            <option value={4}>4D Array (i, j, k, l)</option>
            <option value={5}>5D Array (i, j, k, l, m)</option>
            <option value={6}>6D Array (i, j, k, l, m, n)</option>
          </select>
        </div>
      )}
    </div>
  );
}