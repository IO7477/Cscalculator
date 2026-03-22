/**
 * STANDALONE BITWISE OPERATIONS - Single File Version
 * This file contains the complete Bitwise Shift & Rotate calculator with all components inline
 * Can be copied and used independently
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, MoreVertical, ArrowLeftRight, RotateCw, Copy, Check, Info, ChevronDown, RotateCcw } from 'lucide-react';

type OperationType = 'left-shift' | 'right-shift' | 'rotate';

// ============================================================================
// BITWISE HEADER COMPONENT
// ============================================================================
function BitwiseHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative bg-white rounded-b-3xl shadow-sm pb-4">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <p className="text-xs font-medium text-gray-600">Toolbox</p>
              <h1 className="text-2xl font-bold text-gray-900">Bitwise Shift & Rotate</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <HelpCircle className="w-4 h-4 text-gray-700" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NUMBER INPUT COMPONENT
// ============================================================================
interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function NumberInput({ value, onChange, error }: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (newValue: string) => {
    const filtered = newValue.replace(/[^0-9]/g, '');
    onChange(filtered);
  };

  return (
    <div className="px-4 mt-4">
      <div 
        className={`rounded-2xl bg-gray-50 border transition-all ${
          error 
            ? 'border-red-600' 
            : isFocused 
            ? 'border-blue-600 shadow-sm' 
            : 'border-gray-200'
        }`}
      >
        <div className="p-3">
          <label className="text-xs font-medium text-gray-600">Number (decimal)</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="123456"
            className="w-full bg-transparent text-lg font-medium text-gray-900 outline-none mt-1 placeholder:text-gray-400"
          />
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || 'Integer 0–2³²‑1'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OPERATION TYPE SELECTOR COMPONENT
// ============================================================================
interface OperationTypeSelectorProps {
  selected: OperationType;
  onChange: (type: OperationType) => void;
}

function OperationTypeSelector({ selected, onChange }: OperationTypeSelectorProps) {
  const types: { value: OperationType; label: string }[] = [
    { value: 'left-shift', label: 'Left Shift (<<)' },
    { value: 'right-shift', label: 'Right Shift (>>)' },
    { value: 'rotate', label: 'Rotate' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              selected === type.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SHIFT PARAMETERS CARD COMPONENT
// ============================================================================
interface ShiftParametersCardProps {
  shiftAmount: number;
  bitWidth: number;
  onShiftAmountChange: (amount: number) => void;
  onBitWidthChange: (width: number) => void;
}

const bitWidths = [8, 16, 32];

function ShiftParametersCard({
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
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-600">Shift amount</span>
          {isEditingShift ? (
            <input
              type="text"
              value={tempShift}
              onChange={(e) => setTempShift(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={handleShiftBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleShiftBlur()}
              autoFocus
              className="w-16 text-base font-semibold text-gray-900 text-right outline-none border-b-2 border-blue-600"
            />
          ) : (
            <button
              onClick={() => {
                setIsEditingShift(true);
                setTempShift(shiftAmount.toString());
              }}
              className="flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
            >
              <span className="text-base font-semibold text-gray-900">{shiftAmount}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Bit width</span>
          <button
            onClick={() => setIsBitWidthOpen(!isBitWidthOpen)}
            className="flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
          >
            <span className="text-base font-semibold text-gray-900">{bitWidth} bits</span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isBitWidthOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Shift by 0–{maxShift} positions
        </p>
      </div>

      {isBitWidthOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsBitWidthOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden">
            {bitWidths.map((width) => (
              <button
                key={width}
                onClick={() => {
                  onBitWidthChange(width);
                  setIsBitWidthOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  width === bitWidth ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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

// ============================================================================
// ROTATE MODE TOGGLE COMPONENT
// ============================================================================
interface RotateModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function RotateModeToggle({ enabled, onChange }: RotateModeToggleProps) {
  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-7 rounded-full transition-colors ${
              enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Circular rotation (wraps around)
          </span>
        </div>
        <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
}

// ============================================================================
// PERFORM OPERATION BUTTON COMPONENT
// ============================================================================
interface PerformOperationButtonProps {
  operationType: OperationType;
}

function PerformOperationButton({ operationType }: PerformOperationButtonProps) {
  return (
    <div className="flex justify-center my-4">
      <div className="w-11 h-11 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
        {operationType === 'rotate' ? (
          <RotateCw className="w-5 h-5 text-gray-700" />
        ) : (
          <ArrowLeftRight className="w-5 h-5 text-gray-700" />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BITWISE RESULTS COMPONENT
// ============================================================================
interface BitwiseResultsProps {
  inputValue: string;
  resultDecimal: number | null;
  resultBinary: string;
  resultHex: string;
  bitWidth: number;
  operationDescription: string;
}

function BitwiseResults({
  inputValue,
  resultDecimal,
  resultBinary,
  resultHex,
  bitWidth,
  operationDescription,
}: BitwiseResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (resultDecimal !== null) {
      const text = `Decimal: ${resultDecimal}\nBinary: ${resultBinary}\nHex: ${resultHex}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = resultDecimal !== null;

  const formatBinary = (binary: string) => {
    return binary.match(/.{1,4}/g)?.join(' ') || binary;
  };

  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-300">Results</span>
          {hasResults && (
            <button
              onClick={handleCopyAll}
              className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {!hasResults ? (
          <p className="text-sm text-gray-500 py-4 text-center">Set parameters above</p>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Decimal</p>
              <p className="text-base font-mono text-white">{resultDecimal}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Binary ({bitWidth} bits)</p>
              <p className="text-sm font-mono text-white break-all">{formatBinary(resultBinary)}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Hex</p>
              <p className="text-base font-mono text-white">{resultHex}</p>
            </div>

            <p className="text-[10px] text-gray-500 pt-2 border-t border-gray-800">
              {operationDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BITWISE PRESETS COMPONENT
// ============================================================================
interface Preset {
  label: string;
  action: 'left-1' | 'right-1' | 'rotate-left-8' | 'rotate-right-8' | '32-bit-align' | 'sign-extend';
}

interface BitwisePresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: '<< 1', action: 'left-1' },
  { label: '>> 1', action: 'right-1' },
  { label: 'Rotate left 8', action: 'rotate-left-8' },
  { label: 'Rotate right 8', action: 'rotate-right-8' },
  { label: '32-bit align', action: '32-bit-align' },
  { label: 'Sign extend', action: 'sign-extend' },
];

function BitwisePresets({ onSelectPreset }: BitwisePresetsProps) {
  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-medium text-gray-600 mb-2">Quick presets</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => (
          <button
            key={preset.action}
            onClick={() => onSelectPreset(preset.action)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BIT VISUALIZATION COMPONENT
// ============================================================================
interface BitVisualizationProps {
  binary: string;
  bitWidth: number;
  shiftAmount: number;
}

function BitVisualization({ binary, bitWidth, shiftAmount }: BitVisualizationProps) {
  const paddedBinary = binary.padStart(bitWidth, '0');
  const bits = paddedBinary.split('');

  return (
    <div className="px-4 mt-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Bit view ({bitWidth} bits)</h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">MSB</span>
          <span className="text-xs font-medium text-gray-500">LSB</span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {bits.map((bit, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold transition-colors ${
                bit === '1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
              title={`Bit ${bitWidth - 1 - index}`}
            >
              {bit}
            </div>
          ))}
        </div>

        {shiftAmount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${(shiftAmount / (bitWidth - 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Shift: {shiftAmount}
            </span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">Groups:</span>{' '}
              <span className="font-mono text-gray-700">
                {paddedBinary.match(/.{1,8}/g)?.join(' | ') || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BITWISE ACTIONS COMPONENT
// ============================================================================
interface BitwiseActionsProps {
  onReset: () => void;
  resultDecimal: number | null;
  resultBinary: string;
  resultHex: string;
}

function BitwiseActions({
  onReset,
  resultDecimal,
  resultBinary,
  resultHex,
}: BitwiseActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (resultDecimal !== null) {
      const text = `Decimal: ${resultDecimal}\nBinary: ${resultBinary}\nHex: ${resultHex}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = resultDecimal !== null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-lg z-10">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleCopyAll}
          disabled={!hasResults}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            hasResults
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy all formats
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN BITWISE OPERATIONS COMPONENT
// ============================================================================
export default function BitwiseOperations() {
  const [inputValue, setInputValue] = useState('');
  const [operationType, setOperationType] = useState<OperationType>('left-shift');
  const [shiftAmount, setShiftAmount] = useState(3);
  const [bitWidth, setBitWidth] = useState(32);
  const [circularRotation, setCircularRotation] = useState(true);
  const [resultDecimal, setResultDecimal] = useState<number | null>(null);
  const [resultBinary, setResultBinary] = useState('');
  const [resultHex, setResultHex] = useState('');
  const [operationDescription, setOperationDescription] = useState('');
  const [error, setError] = useState('');

  const performOperation = (num: number, op: OperationType, shift: number, width: number): number => {
    const mask = width === 32 ? 0xFFFFFFFF : (1 << width) - 1;
    num = num & mask;

    switch (op) {
      case 'left-shift':
        return (num << shift) & mask;
      case 'right-shift':
        return (num >>> shift) & mask;
      case 'rotate':
        if (circularRotation) {
          const leftPart = (num << shift) & mask;
          const rightPart = (num >>> (width - shift)) & mask;
          return (leftPart | rightPart) & mask;
        } else {
          return (num << shift) & mask;
        }
      default:
        return num;
    }
  };

  useEffect(() => {
    if (!inputValue) {
      setResultDecimal(null);
      setResultBinary('');
      setResultHex('');
      setOperationDescription('');
      setError('');
      return;
    }

    const num = parseInt(inputValue, 10);
    const maxValue = Math.pow(2, 32) - 1;

    if (isNaN(num) || num < 0) {
      setError('Invalid number');
      setResultDecimal(null);
      setResultBinary('');
      setResultHex('');
      return;
    }

    if (num > maxValue) {
      setError(`Number exceeds 2³²‑1 (${maxValue})`);
      setResultDecimal(null);
      setResultBinary('');
      setResultHex('');
      return;
    }

    setError('');

    const result = performOperation(num, operationType, shiftAmount, bitWidth);
    
    setResultDecimal(result);
    setResultBinary(result.toString(2).padStart(bitWidth, '0'));
    setResultHex(result.toString(16).toUpperCase());

    let opSymbol = '';
    switch (operationType) {
      case 'left-shift':
        opSymbol = '<<';
        break;
      case 'right-shift':
        opSymbol = '>>';
        break;
      case 'rotate':
        opSymbol = circularRotation ? '⟲' : '<<';
        break;
    }
    setOperationDescription(`${num} ${opSymbol} ${shiftAmount} = ${result}`);
  }, [inputValue, operationType, shiftAmount, bitWidth, circularRotation]);

  const handlePresetSelect = (action: 'left-1' | 'right-1' | 'rotate-left-8' | 'rotate-right-8' | '32-bit-align' | 'sign-extend') => {
    switch (action) {
      case 'left-1':
        setOperationType('left-shift');
        setShiftAmount(1);
        break;
      case 'right-1':
        setOperationType('right-shift');
        setShiftAmount(1);
        break;
      case 'rotate-left-8':
        setOperationType('rotate');
        setShiftAmount(8);
        setCircularRotation(true);
        break;
      case 'rotate-right-8':
        setOperationType('rotate');
        setShiftAmount(bitWidth - 8);
        setCircularRotation(true);
        break;
      case '32-bit-align':
        setBitWidth(32);
        setShiftAmount(0);
        break;
      case 'sign-extend':
        setBitWidth(16);
        if (!inputValue) {
          setInputValue('32768');
        }
        break;
    }
  };

  const handleReset = () => {
    setInputValue('');
    setOperationType('left-shift');
    setShiftAmount(3);
    setBitWidth(32);
    setCircularRotation(true);
    setResultDecimal(null);
    setResultBinary('');
    setResultHex('');
    setOperationDescription('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <BitwiseHeader onBack={() => alert('Navigate back to home')} />

      <NumberInput
        value={inputValue}
        onChange={setInputValue}
        error={error}
      />

      <OperationTypeSelector
        selected={operationType}
        onChange={setOperationType}
      />

      <ShiftParametersCard
        shiftAmount={shiftAmount}
        bitWidth={bitWidth}
        onShiftAmountChange={setShiftAmount}
        onBitWidthChange={setBitWidth}
      />

      {operationType === 'rotate' && (
        <RotateModeToggle
          enabled={circularRotation}
          onChange={setCircularRotation}
        />
      )}

      <PerformOperationButton operationType={operationType} />

      <BitwiseResults
        inputValue={inputValue}
        resultDecimal={resultDecimal}
        resultBinary={resultBinary}
        resultHex={resultHex}
        bitWidth={bitWidth}
        operationDescription={operationDescription}
      />

      <BitwisePresets onSelectPreset={handlePresetSelect} />

      {resultBinary && (
        <BitVisualization
          binary={resultBinary}
          bitWidth={bitWidth}
          shiftAmount={shiftAmount}
        />
      )}

      <div className="h-8" />

      <BitwiseActions
        onReset={handleReset}
        resultDecimal={resultDecimal}
        resultBinary={resultBinary}
        resultHex={resultHex}
      />
    </div>
  );
}
