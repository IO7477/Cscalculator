import { useState, useEffect } from 'react';
import { BitwiseHeader } from '../components/bitwise/BitwiseHeader';
import { NumberInput } from '../components/bitwise/NumberInput';
import { OperationTypeSelector } from '../components/bitwise/OperationTypeSelector';
import { ShiftParametersCard } from '../components/bitwise/ShiftParametersCard';
import { RotateModeToggle } from '../components/bitwise/RotateModeToggle';
import { BitwiseResults } from '../components/bitwise/BitwiseResults';
import { BitwisePresets } from '../components/bitwise/BitwisePresets';
import { BitVisualization } from '../components/bitwise/BitVisualization';
import { BitwiseActions } from '../components/bitwise/BitwiseActions';

type OperationType = 'left-shift' | 'right-shift' | 'rotate';

export function BitwiseOperations() {
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

  // Perform bitwise operations
  const performOperation = (num: number, op: OperationType, shift: number, width: number): number => {
    // Create mask for bit width
    const mask = width === 32 ? 0xFFFFFFFF : (1 << width) - 1;
    num = num & mask; // Ensure number fits in bit width

    switch (op) {
      case 'left-shift':
        return (num << shift) & mask;
      
      case 'right-shift':
        // Logical right shift (zero fill)
        return (num >>> shift) & mask;
      
      case 'rotate':
        if (circularRotation) {
          // Rotate left (circular)
          const leftPart = (num << shift) & mask;
          const rightPart = (num >>> (width - shift)) & mask;
          return (leftPart | rightPart) & mask;
        } else {
          // Simple left shift without wrap
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

    // Perform operation
    const result = performOperation(num, operationType, shiftAmount, bitWidth);
    
    setResultDecimal(result);
    setResultBinary(result.toString(2).padStart(bitWidth, '0'));
    setResultHex(result.toString(16).toUpperCase());

    // Create description
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
        setShiftAmount(bitWidth - 8); // Rotate right is rotate left by (width - amount)
        setCircularRotation(true);
        break;
      case '32-bit-align':
        setBitWidth(32);
        setShiftAmount(0);
        break;
      case 'sign-extend':
        // Sign extend - set to 16 bit and show example
        setBitWidth(16);
        if (!inputValue) {
          setInputValue('32768'); // Example with sign bit set
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <BitwiseHeader />

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