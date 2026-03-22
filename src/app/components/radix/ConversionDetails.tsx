interface ConversionDetailsProps {
  inputValue: string;
  outputValue: string;
  fromBase: number;
  toBase: number;
}

export function ConversionDetails({ inputValue, outputValue, fromBase, toBase }: ConversionDetailsProps) {
  const getDigitsAllowed = (base: number) => {
    if (base <= 10) {
      return `0–${base - 1}`;
    }
    const lastLetter = String.fromCharCode(65 + base - 11);
    return `0–9, A–${lastLetter}`;
  };

  if (!inputValue || !outputValue) {
    return null;
  }

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Details</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5">
          Input value (base {fromBase}): {inputValue}
        </p>
        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5">
          Output value (base {toBase}): {outputValue}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Digits allowed in base {toBase}: {getDigitsAllowed(toBase)}
        </p>
      </div>
    </div>
  );
}
