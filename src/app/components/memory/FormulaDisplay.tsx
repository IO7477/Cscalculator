interface FormulaDisplayProps {
  formula: string;
}

export function FormulaDisplay({ formula }: FormulaDisplayProps) {
  if (!formula) return null;

  return (
    <div className="px-4 mt-4">
      <div className="rounded-xl bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 p-4">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Formula</label>
        <p className="text-sm font-mono text-gray-900 dark:text-white leading-relaxed break-all">
          {formula}
        </p>
      </div>
    </div>
  );
}