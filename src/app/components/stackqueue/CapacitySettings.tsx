interface CapacitySettingsProps {
  capacity: number;
  onChange: (capacity: number) => void;
  currentSize: number;
}

export function CapacitySettings({ capacity, onChange, currentSize }: CapacitySettingsProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-600">Capacity (Max size)</label>
          <span className="text-xs text-gray-500">
            {currentSize} / {capacity}
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="10"
          value={capacity}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">3</span>
          <span className="text-xs font-medium text-gray-700">{capacity}</span>
          <span className="text-xs text-gray-400">10</span>
        </div>
      </div>
    </div>
  );
}
