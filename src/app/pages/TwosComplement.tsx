import { useState, useEffect } from 'react';
import { ComplementHeader } from '../components/complement/ComplementHeader';
import { BinaryInput } from '../components/complement/BinaryInput';
import { BitWidthSelector } from '../components/complement/BitWidthSelector';
import { ComplementResults } from '../components/complement/ComplementResults';
import { ComplementPresets } from '../components/complement/ComplementPresets';
import { ComplementActions } from '../components/complement/ComplementActions';

type ComplementType = '1s' | '2s' | 'both';

export function TwosComplement() {
  const [inputValue, setInputValue] = useState('');
  const [bitWidth, setBitWidth] = useState(8);
  const [onesComplement, setOnesComplement] = useState('');
  const [twosComplement, setTwosComplement] = useState('');
  const [error, setError] = useState('');

  // Pad or truncate binary string to specified bit width
  const padToBitWidth = (binary: string, width: number): string => {
    if (binary.length > width) {
      return binary.slice(-width); // Take rightmost bits
    }
    return binary.padStart(width, '0'); // Pad with leading zeros
  };

  // Calculate 1's complement (flip all bits)
  const calculateOnesComplement = (binary: string): string => {
    return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
  };

  // Calculate 2's complement (1's complement + 1)
  const calculateTwosComplement = (binary: string): string => {
    const ones = calculateOnesComplement(binary);
    
    // Add 1 to the 1's complement
    let carry = 1;
    const result = ones.split('').reverse().map(bit => {
      const sum = parseInt(bit) + carry;
      carry = sum > 1 ? 1 : 0;
      return (sum % 2).toString();
    }).reverse().join('');
    
    return result;
  };

  useEffect(() => {
    if (!inputValue) {
      setOnesComplement('');
      setTwosComplement('');
      setError('');
      return;
    }

    // Validate binary input
    if (!/^[01]+$/.test(inputValue)) {
      setError("Only 0s and 1s allowed");
      setOnesComplement('');
      setTwosComplement('');
      return;
    }

    if (inputValue.length < 8 || inputValue.length > 32) {
      setError("Enter 8–32 bits");
      setOnesComplement('');
      setTwosComplement('');
      return;
    }

    setError('');

    // Pad to bit width
    const paddedInput = padToBitWidth(inputValue, bitWidth);

    // Calculate complements
    const ones = calculateOnesComplement(paddedInput);
    const twos = calculateTwosComplement(paddedInput);

    setOnesComplement(ones);
    setTwosComplement(twos);
  }, [inputValue, bitWidth]);

  const handlePresetSelect = (action: 'invert' | 'add1' | '8bit-ones' | '16bit-ones') => {
    switch (action) {
      case 'invert':
        if (inputValue) {
          const padded = padToBitWidth(inputValue, bitWidth);
          const inverted = calculateOnesComplement(padded);
          setInputValue(inverted);
        }
        break;
      case 'add1':
        if (onesComplement) {
          setInputValue(twosComplement);
        }
        break;
      case '8bit-ones':
        setBitWidth(8);
        setInputValue('11111111');
        break;
      case '16bit-ones':
        setBitWidth(16);
        setInputValue('1111111111111111');
        break;
    }
  };

  const handleReset = () => {
    setInputValue('');
    setOnesComplement('');
    setTwosComplement('');
    setError('');
    setBitWidth(8);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <ComplementHeader />
      
      <BinaryInput 
        value={inputValue}
        onChange={setInputValue}
        error={error}
      />

      {/* Remove ComplementTypeSelector - always show both */}

      <BitWidthSelector 
        value={bitWidth}
        onChange={setBitWidth}
      />

      {/* Remove InvertButton */}

      <ComplementResults 
        inputValue={inputValue}
        onesComplement={onesComplement}
        twosComplement={twosComplement}
        bitWidth={bitWidth}
        showType="both"
      />

      <ComplementPresets 
        onSelectPreset={handlePresetSelect}
      />

      {/* Remove ExplanationCard - "How it works" */}

      <ComplementActions 
        onReset={handleReset}
        onesComplement={onesComplement}
        twosComplement={twosComplement}
        showType="both"
      />
    </div>
  );
}