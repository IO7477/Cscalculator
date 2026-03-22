interface InfixInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function InfixInput({ value, onChange }: InfixInputProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
        <label className="block text-xs text-gray-600 mb-1">Infix expression</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 2 + 3 * 4"
          className="w-full bg-transparent text-sm font-mono text-gray-900 outline-none placeholder:text-gray-400"
        />
        <div className="text-xs text-gray-500 mt-1">Operands, +, -, *, /, ^, ( )</div>
      </div>
    </div>
  );
}
