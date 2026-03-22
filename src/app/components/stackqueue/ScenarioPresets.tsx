interface ScenarioPresetsProps {
  mode: 'stack' | 'queue';
  onScenario: (scenario: string) => void;
  isStepMode: boolean;
  onStepModeToggle: () => void;
}

export function ScenarioPresets({
  mode,
  onScenario,
  isStepMode,
  onStepModeToggle,
}: ScenarioPresetsProps) {
  const stackScenarios = [
    { label: '📚 Function Calls', action: 'function-calls' },
    { label: '↩️ Undo Stack', action: 'undo-stack' },
    { label: '🔄 Reverse', action: 'reverse' },
    { label: '🗑️ Clear', action: 'clear' },
  ];

  const queueScenarios = [
    { label: '🏭 Producer-Consumer', action: 'producer-consumer' },
    { label: '🎫 Task Scheduling', action: 'task-scheduling' },
    { label: '🔄 Rotate', action: 'rotate' },
    { label: '🗑️ Clear', action: 'clear' },
  ];

  const scenarios = mode === 'stack' ? stackScenarios : queueScenarios;

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-600">Scenario Presets</div>
        <button
          onClick={onStepModeToggle}
          className={`px-2 py-1 text-xs rounded-full font-medium transition-colors ${
            isStepMode
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isStepMode ? '⏸️ Step Mode ON' : '▶️ Step Mode OFF'}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.action}
            onClick={() => onScenario(scenario.action)}
            className="px-3 py-1.5 rounded-full border border-blue-300 bg-blue-50 text-xs text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap font-medium"
          >
            {scenario.label}
          </button>
        ))}
      </div>
      {isStepMode && (
        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800">
          ⏸️ Step-through mode enabled. Operations will execute one at a time.
        </div>
      )}
    </div>
  );
}
