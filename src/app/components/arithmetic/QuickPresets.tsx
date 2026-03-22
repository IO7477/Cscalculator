interface Preset {
  label: string;
  action: 'binary-add-1' | 'hex-multiply-10' | 'octal-divide-2' | 'power-of-2';
}

interface QuickPresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: 'Binary add 1', action: 'binary-add-1' },
  { label: 'Hex multiply 10', action: 'hex-multiply-10' },
  { label: 'Octal divide 2', action: 'octal-divide-2' },
  { label: 'Power of 2 check', action: 'power-of-2' },
];

export function QuickPresets({ onSelectPreset }: QuickPresetsProps) {
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
