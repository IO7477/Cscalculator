/**
 * STANDALONE ARITHMETIC OPERATIONS - Single File Version
 * This file contains the complete Arithmetic Operations calculator with all components inline
 * Can be copied and used independently
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, MoreVertical, Plus, Minus, X, Divide, Equal, Copy, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

// ============================================================================
// ARITHMETIC HEADER COMPONENT
// ============================================================================
function ArithmeticHeader({ onBack }: { onBack: () => void }) {
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
              <h1 className="text-2xl font-bold text-gray-900">Arithmetic Operations</h1>
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
// OPERATION SELECTOR COMPONENT
// ============================================================================
interface OperationSelectorProps {
  selected: Operation;
  onChange: (operation: Operation) => void;
}

function OperationSelector({ selected, onChange }: OperationSelectorProps) {
  const operations: { value: Operation; label: string }[] = [
    { value: 'add', label: 'Add (+)' },
    { value: 'subtract', label: 'Subtract (−)' },
    { value: 'multiply', label: 'Multiply (×)' },
    { value: 'divide', label: 'Divide (÷)' },
  ];

  return (
    <div className="px-4 mt-4">
      <div className="bg-gray-50 rounded-full p-1 flex gap-1">
        {operations.map((op) => (
          <button
            key={op.value}
            onClick={() => onChange(op.value)}
            className={`flex-1 px-2 py-2 rounded-full text-xs font-medium transition-all ${
              selected === op.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// OPERAND INPUTS COMPONENT
// ============================================================================
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

function OperandInputs({
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
            className={`rounded-2xl bg-gray-50 border transition-all ${
              isFocused1 ? 'border-blue-600 shadow-sm' : 'border-gray-200'
            }`}
          >
            <div className="p-3">
              <label className="text-xs font-medium text-gray-600">Operand 1</label>
              <input
                type="text"
                value={operand1}
                onChange={(e) => handleOperandChange(e.target.value, base1, onOperand1Change)}
                onFocus={() => setIsFocused1(true)}
                onBlur={() => setIsFocused1(false)}
                placeholder="1010"
                className="w-full bg-transparent text-lg font-mono font-medium text-gray-900 outline-none mt-1 placeholder:text-gray-400"
              />
              <button
                onClick={() => setIsBase1Open(!isBase1Open)}
                className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Base {base1}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {isBase1Open && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsBase1Open(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                {commonBases.map((base) => (
                  <button
                    key={base.value}
                    onClick={() => {
                      onBase1Change(base.value);
                      setIsBase1Open(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      base1 === base.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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
          <span className="text-2xl font-bold text-gray-700">{operatorSymbol}</span>
        </div>

        {/* Operand 2 */}
        <div className="flex-1 relative">
          <div 
            className={`rounded-2xl bg-gray-50 border transition-all ${
              isFocused2 ? 'border-blue-600 shadow-sm' : 'border-gray-200'
            }`}
          >
            <div className="p-3">
              <label className="text-xs font-medium text-gray-600">Operand 2</label>
              <input
                type="text"
                value={operand2}
                onChange={(e) => handleOperandChange(e.target.value, base2, onOperand2Change)}
                onFocus={() => setIsFocused2(true)}
                onBlur={() => setIsFocused2(false)}
                placeholder="110"
                className="w-full bg-transparent text-lg font-mono font-medium text-gray-900 outline-none mt-1 placeholder:text-gray-400"
              />
              <button
                onClick={() => setIsBase2Open(!isBase2Open)}
                className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Base {base2}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {isBase2Open && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsBase2Open(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                {commonBases.map((base) => (
                  <button
                    key={base.value}
                    onClick={() => {
                      onBase2Change(base.value);
                      setIsBase2Open(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      base2 === base.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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

// ============================================================================
// OUTPUT BASE SELECTOR COMPONENT
// ============================================================================
interface OutputBaseSelectorProps {
  outputBase: number;
  onOutputBaseChange: (base: number) => void;
}

function OutputBaseSelector({ outputBase, onOutputBaseChange }: OutputBaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBaseLabel = (base: number) => {
    const common = commonBases.find(b => b.value === base);
    return common ? `${common.label} (${base})` : `Base ${base}`;
  };

  return (
    <div className="px-4 mt-4 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-2xl border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <div className="text-left">
          <p className="text-xs font-medium text-gray-600 mb-1">Output base</p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900">{getBaseLabel(outputBase)}</p>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Result shown in selected base</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden">
            {commonBases.map((base) => (
              <button
                key={base.value}
                onClick={() => {
                  onOutputBaseChange(base.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  outputBase === base.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span className="font-medium">{base.label} ({base.value})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// CALCULATE BUTTON COMPONENT
// ============================================================================
function CalculateButton() {
  return (
    <div className="flex justify-center my-4">
      <div className="w-11 h-11 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
        <Equal className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  );
}

// ============================================================================
// RESULT CARD COMPONENT
// ============================================================================
interface ResultCardProps {
  result: string;
  operand1: string;
  operand2: string;
  base1: number;
  base2: number;
  outputBase: number;
  operatorSymbol: string;
  hasResult: boolean;
}

function ResultCard({
  result,
  operand1,
  operand2,
  base1,
  base2,
  outputBase,
  operatorSymbol,
  hasResult,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSubscript = (base: number) => {
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    return base.toString().split('').map(d => subscripts[parseInt(d)]).join('');
  };

  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-300">Result</span>
          {hasResult && (
            <button
              onClick={handleCopy}
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

        {!hasResult ? (
          <p className="text-sm text-gray-500 py-4 text-center">Enter operands above</p>
        ) : (
          <div>
            <p className="text-xl font-mono font-medium text-white break-all">{result}</p>
            <p className="text-xs text-gray-400 mt-3">
              {operand1}{getSubscript(base1)} {operatorSymbol} {operand2}{getSubscript(base2)} = {result}{getSubscript(outputBase)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP BY STEP CARD COMPONENT
// ============================================================================
interface StepByStepCardProps {
  operation: Operation;
  operand1Binary: string;
  operand2Binary: string;
  resultBinary: string;
  hasResult: boolean;
}

function StepByStepCard({
  operation,
  operand1Binary,
  operand2Binary,
  resultBinary,
  hasResult,
}: StepByStepCardProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!hasResult) return null;

  const getOperationTitle = () => {
    switch (operation) {
      case 'add': return 'Addition steps (base 2)';
      case 'subtract': return 'Subtraction steps (base 2)';
      case 'multiply': return 'Multiplication steps (base 2)';
      case 'divide': return 'Division steps (base 2)';
    }
  };

  const getOperatorSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
    }
  };

  const maxLen = Math.max(operand1Binary.length, operand2Binary.length, resultBinary.length);
  const op1 = operand1Binary.padStart(maxLen, ' ');
  const op2 = operand2Binary.padStart(maxLen, ' ');
  const res = resultBinary.padStart(maxLen, ' ');

  return (
    <div className="px-4 mt-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{getOperationTitle()}</h3>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {showSteps ? (
              <>
                Hide steps
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show steps
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {showSteps && (
          <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
            <pre className="font-mono text-sm text-gray-900 whitespace-pre">
              <div className="flex flex-col gap-0.5">
                <div className="text-gray-600">  {op1}  ← Operand 1</div>
                <div className="text-gray-600">{getOperatorSymbol()} {op2}  ← Operand 2</div>
                <div className="text-gray-400">{'-'.repeat(maxLen + 2)}</div>
                <div className="font-bold text-blue-700">  {res}  ← Result</div>
              </div>
            </pre>
            <p className="text-xs text-gray-500 mt-3">
              {operation === 'add' && 'Binary addition is performed column by column from right to left with carry propagation.'}
              {operation === 'subtract' && 'Binary subtraction uses borrowing when needed, similar to decimal subtraction.'}
              {operation === 'multiply' && 'Binary multiplication uses shift and add method for each bit.'}
              {operation === 'divide' && 'Binary division follows long division process with quotient and remainder.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK PRESETS COMPONENT
// ============================================================================
interface Preset {
  label: string;
  action: 'binary-add-1' | 'hex-multiply-10' | 'octal-divide-2' | 'power-of-2';
}

interface QuickPresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: 'Binary add 1', action: 'binary-add-1' },
  { label: 'Hex multiply 10', action: 'hex-multiply-10' },
  { label: 'Octal divide 2', action: 'octal-divide-2' },
  { label: 'Power of 2 check', action: 'power-of-2' },
];

function QuickPresets({ onSelectPreset }: QuickPresetsProps) {
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
// OVERFLOW WARNING COMPONENT
// ============================================================================
interface OverflowWarningProps {
  visible: boolean;
  message: string;
}

function OverflowWarning({ visible, message }: OverflowWarningProps) {
  if (!visible) return null;

  return (
    <div className="px-4 mt-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <p className="text-sm text-gray-800 flex-1">{message}</p>
      </div>
    </div>
  );
}

// ============================================================================
// ARITHMETIC ACTIONS COMPONENT
// ============================================================================
interface ArithmeticActionsProps {
  onClear: () => void;
  hasResult: boolean;
  fullStepsText: string;
}

function ArithmeticActions({
  onClear,
  hasResult,
  fullStepsText,
}: ArithmeticActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySteps = async () => {
    if (fullStepsText) {
      await navigator.clipboard.writeText(fullStepsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-lg z-10">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onClear}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleCopySteps}
          disabled={!hasResult}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            hasResult
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
              Copy full steps
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ARITHMETIC OPERATIONS COMPONENT
// ============================================================================
export default function ArithmeticOperations() {
  const [operation, setOperation] = useState<Operation>('add');
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [base1, setBase1] = useState(2);
  const [base2, setBase2] = useState(2);
  const [outputBase, setOutputBase] = useState(16);
  const [result, setResult] = useState('');
  const [operand1Binary, setOperand1Binary] = useState('');
  const [operand2Binary, setOperand2Binary] = useState('');
  const [resultBinary, setResultBinary] = useState('');
  const [overflowWarning, setOverflowWarning] = useState(false);
  const [overflowMessage, setOverflowMessage] = useState('');

  const getOperatorSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
    }
  };

  const performCalculation = (
    op1: string,
    op2: string,
    b1: number,
    b2: number,
    outBase: number,
    op: Operation
  ) => {
    if (!op1 || !op2) {
      setResult('');
      setOperand1Binary('');
      setOperand2Binary('');
      setResultBinary('');
      setOverflowWarning(false);
      return;
    }

    try {
      const decimal1 = parseInt(op1, b1);
      const decimal2 = parseInt(op2, b2);

      if (isNaN(decimal1) || isNaN(decimal2)) {
        setResult('Error: Invalid input');
        return;
      }

      let resultDecimal: number;
      switch (op) {
        case 'add':
          resultDecimal = decimal1 + decimal2;
          break;
        case 'subtract':
          resultDecimal = decimal1 - decimal2;
          if (resultDecimal < 0) {
            setOverflowWarning(true);
            setOverflowMessage('Result is negative - showing absolute value');
            resultDecimal = Math.abs(resultDecimal);
          } else {
            setOverflowWarning(false);
          }
          break;
        case 'multiply':
          resultDecimal = decimal1 * decimal2;
          break;
        case 'divide':
          if (decimal2 === 0) {
            setResult('Error: Division by zero');
            setOverflowWarning(true);
            setOverflowMessage('Cannot divide by zero');
            return;
          }
          resultDecimal = Math.floor(decimal1 / decimal2);
          break;
        default:
          resultDecimal = 0;
      }

      const maxValue = Math.pow(2, 32) - 1;
      if (resultDecimal > maxValue) {
        setOverflowWarning(true);
        setOverflowMessage(`Result exceeds 32-bit limit (${maxValue})`);
      } else if (!overflowWarning) {
        setOverflowWarning(false);
      }

      const resultStr = resultDecimal.toString(outBase).toUpperCase();
      setResult(resultStr);

      setOperand1Binary(decimal1.toString(2));
      setOperand2Binary(decimal2.toString(2));
      setResultBinary(resultDecimal.toString(2));

    } catch (error) {
      setResult('Error: Calculation failed');
      setOverflowWarning(true);
      setOverflowMessage('An error occurred during calculation');
    }
  };

  useEffect(() => {
    performCalculation(operand1, operand2, base1, base2, outputBase, operation);
  }, [operand1, operand2, base1, base2, outputBase, operation]);

  const handlePresetSelect = (action: 'binary-add-1' | 'hex-multiply-10' | 'octal-divide-2' | 'power-of-2') => {
    switch (action) {
      case 'binary-add-1':
        setOperation('add');
        setBase1(2);
        setBase2(2);
        setOutputBase(2);
        setOperand1('1010');
        setOperand2('1');
        break;
      case 'hex-multiply-10':
        setOperation('multiply');
        setBase1(16);
        setBase2(16);
        setOutputBase(16);
        setOperand1('A');
        setOperand2('10');
        break;
      case 'octal-divide-2':
        setOperation('divide');
        setBase1(8);
        setBase2(8);
        setOutputBase(8);
        setOperand1('20');
        setOperand2('2');
        break;
      case 'power-of-2':
        setOperation('multiply');
        setBase1(2);
        setBase2(2);
        setOutputBase(10);
        setOperand1('10');
        setOperand2('10');
        break;
    }
  };

  const handleClear = () => {
    setOperand1('');
    setOperand2('');
    setBase1(2);
    setBase2(2);
    setOutputBase(16);
    setOperation('add');
    setResult('');
    setOperand1Binary('');
    setOperand2Binary('');
    setResultBinary('');
    setOverflowWarning(false);
    setOverflowMessage('');
  };

  const getFullStepsText = () => {
    if (!result || result.startsWith('Error')) return '';
    
    const getSubscript = (base: number) => {
      const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
      return base.toString().split('').map(d => subscripts[parseInt(d)]).join('');
    };

    return `Arithmetic Operation Result
    
Operation: ${operation.charAt(0).toUpperCase() + operation.slice(1)}
Operand 1: ${operand1}${getSubscript(base1)} (base ${base1})
Operand 2: ${operand2}${getSubscript(base2)} (base ${base2})
Result: ${result}${getSubscript(outputBase)} (base ${outputBase})

Binary representation:
  ${operand1Binary}  ← Operand 1
${getOperatorSymbol()} ${operand2Binary}  ← Operand 2
${'─'.repeat(Math.max(operand1Binary.length, operand2Binary.length) + 2)}
  ${resultBinary}  ← Result`;
  };

  const hasResult = result !== '' && !result.startsWith('Error');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ArithmeticHeader onBack={() => alert('Navigate back to home')} />

      <OperationSelector
        selected={operation}
        onChange={setOperation}
      />

      <OperandInputs
        operand1={operand1}
        operand2={operand2}
        base1={base1}
        base2={base2}
        onOperand1Change={setOperand1}
        onOperand2Change={setOperand2}
        onBase1Change={setBase1}
        onBase2Change={setBase2}
        operatorSymbol={getOperatorSymbol()}
      />

      <OutputBaseSelector
        outputBase={outputBase}
        onOutputBaseChange={setOutputBase}
      />

      <CalculateButton />

      <ResultCard
        result={result}
        operand1={operand1}
        operand2={operand2}
        base1={base1}
        base2={base2}
        outputBase={outputBase}
        operatorSymbol={getOperatorSymbol()}
        hasResult={hasResult}
      />

      <StepByStepCard
        operation={operation}
        operand1Binary={operand1Binary}
        operand2Binary={operand2Binary}
        resultBinary={resultBinary}
        hasResult={hasResult}
      />

      <QuickPresets onSelectPreset={handlePresetSelect} />

      <OverflowWarning
        visible={overflowWarning}
        message={overflowMessage}
      />

      <div className="h-8" />

      <ArithmeticActions
        onClear={handleClear}
        hasResult={hasResult}
        fullStepsText={getFullStepsText()}
      />
    </div>
  );
}
