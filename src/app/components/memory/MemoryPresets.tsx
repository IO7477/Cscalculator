interface Preset {
  label: string;
  action: '1d-int' | '2d-char' | 'record' | '3d-float';
}

interface MemoryPresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: '1D int[100] i=5', action: '1d-int' },
  { label: '2D char[10][20] 2,3', action: '2d-char' },
  { label: 'Record offset field2', action: 'record' },
  { label: '3D float[5][6][7] 1,2,3', action: '3d-float' },
];

export function MemoryPresets({ onSelectPreset }: MemoryPresetsProps) {
  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick presets</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {presets.map((preset) => (
          <button
            key={preset.action}
            onClick={() => onSelectPreset(preset.action)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-[#1a1f2e] text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}