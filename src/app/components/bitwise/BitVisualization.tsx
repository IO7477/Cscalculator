interface BitVisualizationProps {
  binary: string;
  bitWidth: number;
  shiftAmount: number;
}

export function BitVisualization({ binary, bitWidth, shiftAmount }: BitVisualizationProps) {
  const paddedBinary = binary.padStart(bitWidth, '0');
  const bits = paddedBinary.split('');

  return (
    <div className="px-4 mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bit view ({bitWidth} bits)</h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">MSB</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">LSB</span>
        </div>

        {/* Bit visualization */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {bits.map((bit, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold transition-colors ${
                bit === '1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
              title={`Bit ${bitWidth - 1 - index}`}
            >
              {bit}
            </div>
          ))}
        </div>

        {/* Shift position indicator */}
        {shiftAmount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${(shiftAmount / (bitWidth - 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Shift: {shiftAmount}
            </span>
          </div>
        )}

        {/* Bit groups */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Groups:</span>{' '}
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {paddedBinary.match(/.{1,8}/g)?.join(' | ') || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
