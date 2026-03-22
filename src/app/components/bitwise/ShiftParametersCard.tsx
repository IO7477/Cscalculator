import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ShiftParametersCardProps {
  shiftAmount: number;
  bitWidth: number;
  onShiftAmountChange: (amount: number) => void;
  onBitWidthChange: (width: number) => void;
}

const bitWidths = [8, 16, 32];

export function ShiftParametersCard({
  shiftAmount,
  bitWidth,
  onShiftAmountChange,
  onBitWidthChange,
}: ShiftParametersCardProps) {
  const [isEditingShift, setIsEditingShift] = useState(false);
  const [tempShift, setTempShift] = useState(shiftAmount.toString());
  const [isBitWidthOpen, setIsBitWidthOpen] = useState(false);

  const handleShiftBlur = () => {
    setIsEditingShift(false);
    const value = parseInt(tempShift) || 0;
    const clamped = Math.max(0, Math.min(31, value));
    onShiftAmountChange(clamped);
    setTempShift(clamped.toString());
  };

  const maxShift = bitWidth - 1;

  return (
    <div className="px-4 mt-4 relative">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
        {/* Shift Amount Row */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Shift amount</span>
          {isEditingShift ? (
            <input
              type="text"
              value={tempShift}
              onChange={(e) => setTempShift(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={handleShiftBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleShiftBlur()}
              autoFocus
              className="w-16 text-base font-semibold text-gray-900 dark:text-white text-right outline-none border-b-2 border-blue-600 bg-transparent"
            />
          ) : (
            <button
              onClick={() => {
                setIsEditingShift(true);
                setTempShift(shiftAmount.toString());
              }}
              className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
            >
              <span className="text-base font-semibold text-gray-900 dark:text-white">{shiftAmount}</span>
              <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Bit Width Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Bit width</span>
          <button
            onClick={() => setIsBitWidthOpen(!isBitWidthOpen)}
            className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          >
            <span className="text-base font-semibold text-gray-900 dark:text-white">{bitWidth} bits</span>
            <ChevronDown className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform ${isBitWidthOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Shift by 0–{maxShift} positions
        </p>
      </div>

      {/* Bit Width Dropdown */}
      {isBitWidthOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsBitWidthOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
            {bitWidths.map((width) => (
              <button
                key={width}
                onClick={() => {
                  onBitWidthChange(width);
                  setIsBitWidthOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  width === bitWidth
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="font-medium">{width} bits</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
