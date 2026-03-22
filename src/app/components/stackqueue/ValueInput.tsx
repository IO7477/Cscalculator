interface ValueInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValueInput({ value, onChange }: ValueInputProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
        <label className="block text-xs text-gray-600 mb-1">Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 42"
          className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
        />
        <div className="text-xs text-gray-500 mt-1">Any short label or number</div>
      </div>
    </div>
  );
}
