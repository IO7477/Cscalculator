interface Preset {
  label: string;
  action: 'left-1' | 'right-1' | 'rotate-left-8' | 'rotate-right-8' | '32-bit-align' | 'sign-extend';
}

interface BitwisePresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: '<< 1', action: 'left-1' },
  { label: '>> 1', action: 'right-1' },
  { label: 'Rotate left 8', action: 'rotate-left-8' },
  { label: 'Rotate right 8', action: 'rotate-right-8' },
  { label: '32-bit align', action: '32-bit-align' },
  { label: 'Sign extend', action: 'sign-extend' },
];

export function BitwisePresets({ onSelectPreset }: BitwisePresetsProps) {
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
