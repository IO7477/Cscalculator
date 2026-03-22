import { useState, useEffect } from 'react';
import { RadixHeader } from '../components/radix/RadixHeader';
import { NumberInput } from '../components/radix/NumberInput';
import { BaseSelector } from '../components/radix/BaseSelector';
import { SwapButton } from '../components/radix/SwapButton';
import { ResultCard } from '../components/radix/ResultCard';
import { QuickPresets } from '../components/radix/QuickPresets';
import { ConversionDetails } from '../components/radix/ConversionDetails';
import { PinnedActions } from '../components/radix/PinnedActions';

export function RadixConverter() {
  const [inputValue, setInputValue] = useState('');
  const [baseFrom, setBaseFrom] = useState(10);
  const [baseTo, setBaseTo] = useState(16);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const isValidDigit = (digit: string, base: number): boolean => {
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
    const maxChar = validChars[base - 1];
    return digit >= '0' && digit <= maxChar;
  };

  const validateInput = (value: string, base: number): boolean => {
    if (!value) {
      setError('');
      return false;
    }

    for (const char of value) {
      if (!isValidDigit(char, base)) {
        setError(`Invalid digit '${char}' for base ${base}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const convertNumber = (value: string, fromBase: number, toBase: number): string => {
    if (!value) return '';
    
    try {
      // Convert to decimal first
      const decimal = parseInt(value, fromBase);
      
      if (isNaN(decimal)) {
        return '';
      }

      // Convert from decimal to target base
      return decimal.toString(toBase).toUpperCase();
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (validateInput(inputValue, baseFrom)) {
      const converted = convertNumber(inputValue, baseFrom, baseTo);
      setResult(converted);
    } else {
      setResult('');
    }
  }, [inputValue, baseFrom, baseTo]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSwap = () => {
    const tempBase = baseFrom;
    setBaseFrom(baseTo);
    setBaseTo(tempBase);
    
    // Swap input and result if result exists
    if (result) {
      setInputValue(result);
    }
  };

  const handlePresetSelect = (from: number, to: number) => {
    setBaseFrom(from);
    setBaseTo(to);
  };

  const handleReset = () => {
    setInputValue('');
    setResult('');
    setError('');
    setBaseFrom(10);
    setBaseTo(16);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <RadixHeader />
      
      <NumberInput 
        value={inputValue}
        onChange={handleInputChange}
        baseFrom={baseFrom}
        error={error}
      />

      <div className="px-4 mt-4 space-y-3">
        <BaseSelector 
          label="From base"
          value={baseFrom}
          onChange={setBaseFrom}
        />
        <BaseSelector 
          label="To base"
          value={baseTo}
          onChange={setBaseTo}
        />
        <p className="text-xs text-gray-500">Range: base 2 to base 32</p>
      </div>

      <SwapButton onSwap={handleSwap} />

      <ResultCard 
        result={result}
        fromBase={baseFrom}
        toBase={baseTo}
      />

      <QuickPresets 
        onSelectPreset={handlePresetSelect}
        currentFromBase={baseFrom}
        currentToBase={baseTo}
      />

      <ConversionDetails 
        inputValue={inputValue}
        outputValue={result}
        fromBase={baseFrom}
        toBase={baseTo}
      />

      <PinnedActions 
        onReset={handleReset}
        result={result}
      />
    </div>
  );
}