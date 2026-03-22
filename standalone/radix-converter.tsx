/**
 * STANDALONE RADIX CONVERTER - Single File Version
 * This file contains the complete Radix Converter with all components inline
 * Can be copied and used independently
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, MoreVertical, ArrowUpDown, Copy, Check, RotateCcw } from 'lucide-react';

// ============================================================================
// RADIX HEADER COMPONENT
// ============================================================================
function RadixHeader({ onBack }: { onBack: () => void }) {
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
              <h1 className="text-2xl font-bold text-gray-900">Radix Converter</h1>
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
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
}

function NumberInput({ label, value, onChange, placeholder, helper, error }: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

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
          <label className="text-xs font-medium text-gray-600">{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-lg font-medium font-mono text-gray-900 outline-none mt-1 placeholder:text-gray-400"
          />
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helper}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BASE SELECTOR COMPONENT
// ============================================================================
interface BaseSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function BaseSelector({ label, value, onChange }: BaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const commonBases = [
    { value: 2, label: 'Binary (2)', color: 'blue' },
    { value: 8, label: 'Octal (8)', color: 'purple' },
    { value: 10, label: 'Decimal (10)', color: 'green' },
    { value: 16, label: 'Hexadecimal (16)', color: 'orange' },
  ];

  const getBaseLabel = (base: number) => {
    const common = commonBases.find(b => b.value === base);
    if (common) return common.label;
    return `Base ${base}`;
  };

  return (
    <div className="px-4 mt-4 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-2xl border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <div className="text-left">
          <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-base font-semibold text-gray-900">{getBaseLabel(value)}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 px-2 py-1">Common bases</p>
              {commonBases.map((base) => (
                <button
                  key={base.value}
                  onClick={() => {
                    onChange(base.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors ${
                    value === base.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {base.label}
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="text-xs font-medium text-gray-500 px-2 py-1">All bases (2-36)</p>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 35 }, (_, i) => i + 2).map((base) => {
                    const isCommon = commonBases.some(b => b.value === base);
                    if (isCommon) return null;
                    
                    return (
                      <button
                        key={base}
                        onClick={() => {
                          onChange(base);
                          setIsOpen(false);
                        }}
                        className={`px-2 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                          value === base ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {base}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// SWAP BUTTON COMPONENT
// ============================================================================
function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center my-3">
      <button
        onClick={onClick}
        className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all"
      >
        <ArrowUpDown className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}

// ============================================================================
// RESULT CARD COMPONENT
// ============================================================================
interface ResultCardProps {
  label: string;
  value: string;
  base: number;
  onCopy: () => void;
  copied: boolean;
}

function ResultCard({ label, value, base, onCopy, copied }: ResultCardProps) {
  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-300">{label}</span>
          <button
            onClick={onCopy}
            className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        </div>
        
        {value ? (
          <div>
            <p className="text-xl font-mono font-medium text-white break-all">{value}</p>
            <p className="text-xs text-gray-500 mt-2">Base {base}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">Enter a number above</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK PRESETS COMPONENT
// ============================================================================
interface QuickPresetsProps {
  onSelectPreset: (preset: string) => void;
}

function QuickPresets({ onSelectPreset }: QuickPresetsProps) {
  const presets = [
    { label: 'Bin↔Dec', from: 2, to: 10 },
    { label: 'Dec↔Hex', from: 10, to: 16 },
    { label: 'Oct↔Hex', from: 8, to: 16 },
    { label: 'Bin↔Hex', from: 2, to: 16 },
  ];

  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-medium text-gray-600 mb-2">Quick presets</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onSelectPreset(preset.label)}
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
// CONVERSION DETAILS COMPONENT
// ============================================================================
interface ConversionDetailsProps {
  inputValue: string;
  fromBase: number;
  toBase: number;
  outputValue: string;
}

function ConversionDetails({ inputValue, fromBase, toBase, outputValue }: ConversionDetailsProps) {
  if (!inputValue || !outputValue) return null;

  return (
    <div className="px-4 mt-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Conversion details</h3>
        <div className="space-y-2 text-xs text-gray-700">
          <p>
            <span className="font-medium">From:</span> {inputValue} (base {fromBase})
          </p>
          <p>
            <span className="font-medium">To:</span> {outputValue} (base {toBase})
          </p>
          {fromBase !== 10 && (
            <p>
              <span className="font-medium">Decimal value:</span>{' '}
              {parseInt(inputValue, fromBase)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PINNED ACTIONS COMPONENT
// ============================================================================
interface PinnedActionsProps {
  onReset: () => void;
  onCopy: () => void;
  copied: boolean;
  hasResult: boolean;
}

function PinnedActions({ onReset, onCopy, copied, hasResult }: PinnedActionsProps) {
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
          onClick={onCopy}
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
              Copy result
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN RADIX CONVERTER COMPONENT
// ============================================================================
export default function RadixConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [outputValue, setOutputValue] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  // Valid characters for each base
  const getValidChars = (base: number): string => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    return chars.slice(0, base);
  };

  // Validate input for the selected base
  const validateInput = (value: string, base: number): boolean => {
    if (!value) return true;
    const validChars = getValidChars(base);
    const regex = new RegExp(`^[${validChars}]+$`, 'i');
    return regex.test(value);
  };

  // Convert between bases
  useEffect(() => {
    if (!inputValue) {
      setOutputValue('');
      setError('');
      return;
    }

    // Validate input
    if (!validateInput(inputValue, fromBase)) {
      setError(`Invalid characters for base ${fromBase}`);
      setOutputValue('');
      return;
    }

    setError('');

    try {
      // Convert from input base to decimal, then to output base
      const decimalValue = parseInt(inputValue, fromBase);
      
      if (isNaN(decimalValue)) {
        setError('Invalid number');
        setOutputValue('');
        return;
      }

      const result = decimalValue.toString(toBase).toUpperCase();
      setOutputValue(result);
    } catch (err) {
      setError('Conversion error');
      setOutputValue('');
    }
  }, [inputValue, fromBase, toBase]);

  const handleSwap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    if (outputValue) {
      setInputValue(outputValue);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setOutputValue('');
    setError('');
    setFromBase(10);
    setToBase(16);
  };

  const handleCopyResult = async () => {
    if (outputValue) {
      await navigator.clipboard.writeText(outputValue);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  const handleCopy = async () => {
    if (outputValue) {
      await navigator.clipboard.writeText(outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePresetSelect = (preset: string) => {
    const presetMap: Record<string, { from: number; to: number }> = {
      'Bin↔Dec': { from: 2, to: 10 },
      'Dec↔Hex': { from: 10, to: 16 },
      'Oct↔Hex': { from: 8, to: 16 },
      'Bin↔Hex': { from: 2, to: 16 },
    };

    const selected = presetMap[preset];
    if (selected) {
      setFromBase(selected.from);
      setToBase(selected.to);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <RadixHeader onBack={() => alert('Navigate back to home')} />
      
      <NumberInput
        label="Input number"
        value={inputValue}
        onChange={setInputValue}
        placeholder="Enter number..."
        helper={`Valid characters for base ${fromBase}: ${getValidChars(fromBase).toUpperCase()}`}
        error={error}
      />

      <BaseSelector
        label="From base"
        value={fromBase}
        onChange={setFromBase}
      />

      <SwapButton onClick={handleSwap} />

      <BaseSelector
        label="To base"
        value={toBase}
        onChange={setToBase}
      />

      <ResultCard
        label="Result"
        value={outputValue}
        base={toBase}
        onCopy={handleCopy}
        copied={copied}
      />

      <QuickPresets onSelectPreset={handlePresetSelect} />

      <ConversionDetails
        inputValue={inputValue}
        fromBase={fromBase}
        toBase={toBase}
        outputValue={outputValue}
      />

      <div className="h-8" />

      <PinnedActions
        onReset={handleReset}
        onCopy={handleCopyResult}
        copied={copiedResult}
        hasResult={!!outputValue}
      />
    </div>
  );
}
