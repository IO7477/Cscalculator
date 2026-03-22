/**
 * STANDALONE 1'S & 2'S COMPLEMENT CALCULATOR - Single File Version
 * This file contains the complete Complement Calculator with all components inline
 * Can be copied and used independently
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, MoreVertical, Plus, Copy, Check, Info, ChevronDown } from 'lucide-react';

type ComplementType = '1s' | '2s' | 'both';

// ============================================================================
// COMPLEMENT HEADER COMPONENT
// ============================================================================
function ComplementHeader({ onBack }: { onBack: () => void }) {
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
              <h1 className="text-2xl font-bold text-gray-900">1's & 2's Complement</h1>
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
// BINARY INPUT COMPONENT
// ============================================================================
interface BinaryInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function BinaryInput({ value, onChange, error }: BinaryInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (newValue: string) => {
    // Only allow 0s and 1s
    const filtered = newValue.replace(/[^01]/g, '');
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
          <label className="text-xs font-medium text-gray-600">Binary number</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="10101010"
            className="w-full bg-transparent text-lg font-medium font-mono text-gray-900 outline-none mt-1 placeholder:text-gray-400"
          />
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || 'Enter 8–32 bits (0s and 1s only)'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLEMENT TYPE SELECTOR COMPONENT
// ============================================================================
interface ComplementTypeSelectorProps {
  selected: ComplementType;
  onChange: (type: ComplementType) => void;
}

function ComplementTypeSelector({ selected, onChange }: ComplementTypeSelectorProps) {
  const types: { value: ComplementType; label: string }[] = [
    { value: '1s', label: "1's Complement" },
    { value: '2s', label: "2's Complement" },
    { value: 'both', label: 'Both' },
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
// BIT WIDTH SELECTOR COMPONENT
// ============================================================================
interface BitWidthSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const bitWidths = [8, 16, 32];

function BitWidthSelector({ value, onChange }: BitWidthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 mt-4 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-2xl border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Bit width</span>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-gray-900">{value} bits</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-left">Common sizes: 8, 16, 32</p>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden">
            {bitWidths.map((width) => (
              <button
                key={width}
                onClick={() => {
                  onChange(width);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  width === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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
// INVERT BUTTON COMPONENT
// ============================================================================
function InvertButton() {
  return (
    <div className="flex justify-center my-3">
      <div className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-700">
          <div className="text-xs font-bold leading-none">1</div>
          <Plus className="w-3 h-3" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLEMENT RESULTS COMPONENT
// ============================================================================
interface ComplementResultsProps {
  inputValue: string;
  onesComplement: string;
  twosComplement: string;
  bitWidth: number;
  showType: ComplementType;
}

function ComplementResults({ 
  inputValue, 
  onesComplement, 
  twosComplement, 
  bitWidth,
  showType 
}: ComplementResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (onesComplement && twosComplement) {
      const text = showType === 'both' 
        ? `1's: ${onesComplement}\n2's: ${twosComplement}`
        : showType === '1s'
        ? onesComplement
        : twosComplement;
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = onesComplement || twosComplement;

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
          <p className="text-sm text-gray-500 py-4 text-center">Enter binary above</p>
        ) : (
          <div className="space-y-3">
            {(showType === '1s' || showType === 'both') && (
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">1's Complement</p>
                <p className="text-base font-mono text-white">{onesComplement}</p>
              </div>
            )}
            
            {(showType === '2s' || showType === 'both') && (
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">2's Complement</p>
                <p className="text-base font-mono text-white">{twosComplement}</p>
              </div>
            )}
            
            <p className="text-[10px] text-gray-500 pt-2 border-t border-gray-800">
              Input: {inputValue} ({bitWidth} bits)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPLEMENT PRESETS COMPONENT
// ============================================================================
interface Preset {
  label: string;
  action: 'invert' | 'add1' | '8bit-ones' | '16bit-ones';
}

interface ComplementPresetsProps {
  onSelectPreset: (action: Preset['action']) => void;
}

const presets: Preset[] = [
  { label: "Invert bits (1's)", action: 'invert' },
  { label: "Add 1 to 1's (2's)", action: 'add1' },
  { label: '8-bit all 1s', action: '8bit-ones' },
  { label: '16-bit all 1s', action: '16bit-ones' },
];

function ComplementPresets({ onSelectPreset }: ComplementPresetsProps) {
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
// EXPLANATION CARD COMPONENT
// ============================================================================
function ExplanationCard() {
  return (
    <div className="px-4 mt-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">How it works</h3>
        <p className="text-xs text-gray-700 mb-1.5">
          <span className="font-medium">1's Complement:</span> Flip all bits (0→1, 1→0)
        </p>
        <p className="text-xs text-gray-700 mb-3">
          <span className="font-medium">2's Complement:</span> 1's complement + 1
        </p>
        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full border border-blue-200">
          CS fundamentals
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLEMENT ACTIONS COMPONENT
// ============================================================================
interface ComplementActionsProps {
  onReset: () => void;
  onesComplement: string;
  twosComplement: string;
  showType: ComplementType;
}

function ComplementActions({ 
  onReset, 
  onesComplement, 
  twosComplement,
  showType 
}: ComplementActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const hasResults = onesComplement || twosComplement;
    if (hasResults) {
      const text = showType === 'both' 
        ? `1's: ${onesComplement}\n2's: ${twosComplement}`
        : showType === '1s'
        ? onesComplement
        : twosComplement;
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasResults = onesComplement || twosComplement;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-lg z-10">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onReset}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
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
              Copy all
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPLEMENT CALCULATOR COMPONENT
// ============================================================================
export default function ComplementCalculator() {
  const [inputValue, setInputValue] = useState('');
  const [complementType, setComplementType] = useState<ComplementType>('both');
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
    setComplementType('both');
    setBitWidth(8);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ComplementHeader onBack={() => alert('Navigate back to home')} />
      
      <BinaryInput 
        value={inputValue}
        onChange={setInputValue}
        error={error}
      />

      <ComplementTypeSelector 
        selected={complementType}
        onChange={setComplementType}
      />

      <BitWidthSelector 
        value={bitWidth}
        onChange={setBitWidth}
      />

      <InvertButton />

      <ComplementResults 
        inputValue={inputValue}
        onesComplement={onesComplement}
        twosComplement={twosComplement}
        bitWidth={bitWidth}
        showType={complementType}
      />

      <ComplementPresets 
        onSelectPreset={handlePresetSelect}
      />

      <ExplanationCard />

      <ComplementActions 
        onReset={handleReset}
        onesComplement={onesComplement}
        twosComplement={twosComplement}
        showType={complementType}
      />
    </div>
  );
}
