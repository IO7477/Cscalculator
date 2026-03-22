interface EvaluationResultProps {
  result: number | null;
  hasTrace: boolean;
  onViewTrace?: () => void;
}

export function EvaluationResult({ result, hasTrace, onViewTrace }: EvaluationResultProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-green-600 dark:bg-green-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/80">Answer</span>
        </div>
        <div className="text-2xl font-mono font-bold text-white mb-2">
          {result !== null ? result : '—'}
        </div>
        {hasTrace && (
          <button
            onClick={onViewTrace}
            className="text-xs text-white/80 underline hover:text-white transition-colors"
          >
            Stack trace available →
          </button>
        )}
      </div>
    </div>
  );
}
