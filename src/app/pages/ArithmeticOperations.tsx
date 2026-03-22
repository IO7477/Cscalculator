import { useState, useEffect } from 'react';
import { ArithmeticHeader } from '../components/arithmetic/ArithmeticHeader';
import { OperationSelector, Operation } from '../components/arithmetic/OperationSelector';
import { OperandInputs } from '../components/arithmetic/OperandInputs';
import { OutputBaseSelector } from '../components/arithmetic/OutputBaseSelector';
import { CalculateButton } from '../components/arithmetic/CalculateButton';
import { ResultCard } from '../components/arithmetic/ResultCard';
import { StepByStepCard } from '../components/arithmetic/StepByStepCard';
import { QuickPresets } from '../components/arithmetic/QuickPresets';
import { OverflowWarning } from '../components/arithmetic/OverflowWarning';
import { ArithmeticActions } from '../components/arithmetic/ArithmeticActions';

export function ArithmeticOperations() {
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
      // Convert operands to decimal
      const decimal1 = parseInt(op1, b1);
      const decimal2 = parseInt(op2, b2);

      if (isNaN(decimal1) || isNaN(decimal2)) {
        setResult('Error: Invalid input');
        return;
      }

      // Perform operation
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

      // Check for overflow (32-bit limit)
      const maxValue = Math.pow(2, 32) - 1;
      if (resultDecimal > maxValue) {
        setOverflowWarning(true);
        setOverflowMessage(`Result exceeds 32-bit limit (${maxValue})`);
      } else if (!overflowWarning) {
        setOverflowWarning(false);
      }

      // Convert result to output base
      const resultStr = resultDecimal.toString(outBase).toUpperCase();
      setResult(resultStr);

      // Store binary representations for step-by-step
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <ArithmeticHeader />

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

      {/* Remove CalculateButton - = sign */}

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