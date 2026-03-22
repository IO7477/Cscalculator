export type CalculatorMode = 'pick' | 'analyze';

interface ModeSelectorProps {
  selected: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export function ModeSelector({ selected, onChange }: ModeSelectorProps) {
  const modes: { value: CalculatorMode; label: string }[] = [
    { value: 'pick', label: 'Pick complexity' },
    { value: 'analyze', label: 'Analyze code' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected === mode.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
