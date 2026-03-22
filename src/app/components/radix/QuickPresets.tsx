interface Preset {
  label: string;
  fromBase: number;
  toBase: number;
}

interface QuickPresetsProps {
  onSelectPreset: (fromBase: number, toBase: number) => void;
  currentFromBase: number;
  currentToBase: number;
}

const presets: Preset[] = [
  { label: 'Bin ↔ Dec', fromBase: 2, toBase: 10 },
  { label: 'Dec ↔ Hex', fromBase: 10, toBase: 16 },
  { label: 'Hex ↔ Bin', fromBase: 16, toBase: 2 },
  { label: 'Oct ↔ Dec', fromBase: 8, toBase: 10 },
];

export function QuickPresets({ onSelectPreset, currentFromBase, currentToBase }: QuickPresetsProps) {
  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick presets</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => {
          const isActive =
            (preset.fromBase === currentFromBase && preset.toBase === currentToBase) ||
            (preset.fromBase === currentToBase && preset.toBase === currentFromBase);

          return (
            <button
              key={preset.label}
              onClick={() => onSelectPreset(preset.fromBase, preset.toBase)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-500 text-white border-2 border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
