import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface OperandInputsProps {
  operand1: string;
  operand2: string;
  base1: number;
  base2: number;
  onOperand1Change: (value: string) => void;
  onOperand2Change: (value: string) => void;
  onBase1Change: (base: number) => void;
  onBase2Change: (base: number) => void;
  operatorSymbol: string;
}

const commonBases = [
  { value: 2, label: 'Binary' },
  { value: 8, label: 'Octal' },
  { value: 10, label: 'Decimal' },
  { value: 16, label: 'Hexadecimal' },
];

export function OperandInputs({
  operand1,
  operand2,
  base1,
  base2,
  onOperand1Change,
  onOperand2Change,
  onBase1Change,
  onBase2Change,
  operatorSymbol,
}: OperandInputsProps) {
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isBase1Open, setIsBase1Open] = useState(false);
  const [isBase2Open, setIsBase2Open] = useState(false);

  const getValidChars = (base: number) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    return chars.slice(0, base);
  };

  const handleOperandChange = (value: string, base: number, onChange: (val: string) => void) => {
    const validChars = getValidChars(base);
    const regex = new RegExp(`^[${validChars}]*$`, 'i');
    if (regex.test(value) || value === '') {
      onChange(value);
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="flex gap-3 items-center">
        {/* Operand 1 */}
        <div className="flex-1 relative">
          <div
            className={`rounded-2xl bg-gray-50 dark:bg-gray-800 border transition-all ${
              isFocused1
                ? 'border-blue-600 shadow-sm'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-3">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Operand 1</label>
              <input
                type="text"
                value={operand1}
                onChange={(e) => handleOperandChange(e.target.value, base1, onOperand1Change)}
                onFocus={() => setIsFocused1(true)}
                onBlur={() => setIsFocused1(false)}
                placeholder="1010"
                className="w-full bg-transparent text-lg font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <button
                onClick={() => setIsBase1Open(!isBase1Open)}
                className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Base {base1}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Base 1 Dropdown */}
          {isBase1Open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsBase1Open(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
                {commonBases.map((base) => (
                  <button
                    key={base.value}
                    onClick={() => {
                      onBase1Change(base.value);
                      setIsBase1Open(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      base1 === base.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="font-medium">{base.label} ({base.value})</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Operator Symbol */}
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{operatorSymbol}</span>
        </div>

        {/* Operand 2 */}
        <div className="flex-1 relative">
          <div
            className={`rounded-2xl bg-gray-50 dark:bg-gray-800 border transition-all ${
              isFocused2
                ? 'border-blue-600 shadow-sm'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-3">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Operand 2</label>
              <input
                type="text"
                value={operand2}
                onChange={(e) => handleOperandChange(e.target.value, base2, onOperand2Change)}
                onFocus={() => setIsFocused2(true)}
                onBlur={() => setIsFocused2(false)}
                placeholder="110"
                className="w-full bg-transparent text-lg font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <button
                onClick={() => setIsBase2Open(!isBase2Open)}
                className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Base {base2}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Base 2 Dropdown */}
          {isBase2Open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsBase2Open(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 overflow-hidden">
                {commonBases.map((base) => (
                  <button
                    key={base.value}
                    onClick={() => {
                      onBase2Change(base.value);
                      setIsBase2Open(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      base2 === base.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="font-medium">{base.label} ({base.value})</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
