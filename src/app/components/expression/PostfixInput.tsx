interface PostfixInputProps {
  value: string;
  onChange: (value: string) => void;
  detectedType?: 'infix' | 'prefix' | 'postfix' | 'unknown';
}

export function PostfixInput({ value, onChange, detectedType }: PostfixInputProps) {
  const getTypeColor = () => {
    switch (detectedType) {
      case 'infix': return 'bg-blue-100 text-blue-700';
      case 'prefix': return 'bg-indigo-100 text-indigo-700';
      case 'postfix': return 'bg-gray-100 text-gray-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  const getTypeLabel = () => {
    switch (detectedType) {
      case 'infix': return '📝 Infix detected';
      case 'prefix': return '🔵 Prefix detected';
      case 'postfix': return '🟢 Postfix detected';
      default: return '❓ Unknown format';
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-600">Expression to evaluate</label>
          {detectedType && value && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {getTypeLabel()}
            </span>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 2 + 3 * 4  OR  2 3 4 * +  OR  + 2 * 3 4"
          className="w-full bg-transparent text-sm font-mono text-gray-900 outline-none placeholder:text-gray-400"
        />
        <div className="text-xs text-gray-500 mt-1">Supports infix, prefix, or postfix notation</div>
      </div>
    </div>
  );
}