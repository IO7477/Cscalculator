interface QuickPresetsProps {
  mode: 'stack' | 'queue';
  onPreset: (action: string) => void;
}

export function QuickPresets({ mode, onPreset }: QuickPresetsProps) {
  const stackPresets = [
    { label: 'Fill [1,2,3]', action: 'fill-123' },
    { label: 'Fill [A,B,C]', action: 'fill-abc' },
    { label: 'Reverse', action: 'reverse' },
    { label: 'Clear', action: 'clear' },
  ];

  const queuePresets = [
    { label: 'Fill [A,B,C]', action: 'fill-abc' },
    { label: 'Fill [1,2,3]', action: 'fill-123' },
    { label: 'Rotate', action: 'rotate' },
    { label: 'Clear', action: 'clear' },
  ];

  const presets = mode === 'stack' ? stackPresets : queuePresets;

  return (
    <div className="px-4 mt-4">
      <div className="text-xs text-gray-600 mb-2">Quick presets</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => (
          <button
            key={preset.action}
            onClick={() => onPreset(preset.action)}
            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
