interface Preset {
  label: string;
  action: 'invert' | 'add1' | '8bit-ones' | '16bit-ones';
}

interface ComplementPresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: "Invert bits (1's)", action: 'invert' },
  { label: "Add 1 to 1's (2's)", action: 'add1' },
  { label: '8-bit all 1s', action: '8bit-ones' },
  { label: '16-bit all 1s', action: '16bit-ones' },
];

export function ComplementPresets({ onSelectPreset }: ComplementPresetsProps) {
  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick presets</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => (
          <button
            key={preset.action}
            onClick={() => onSelectPreset(preset.action)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
