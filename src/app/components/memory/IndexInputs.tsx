import { useState } from 'react';
import { ArrayType } from './ArrayTypeSelector';

interface IndexInputsProps {
  arrayType: ArrayType;
  indexI: string;
  indexJ: string;
  indexK: string;
  indexL: string;
  indexM: string;
  indexN: string;
  elementSize: string;
  dimensions: number;
  onIndexIChange: (value: string) => void;
  onIndexJChange: (value: string) => void;
  onIndexKChange: (value: string) => void;
  onIndexLChange: (value: string) => void;
  onIndexMChange: (value: string) => void;
  onIndexNChange: (value: string) => void;
  onElementSizeChange: (value: string) => void;
}

export function IndexInputs({
  arrayType,
  indexI,
  indexJ,
  indexK,
  indexL,
  indexM,
  indexN,
  elementSize,
  dimensions,
  onIndexIChange,
  onIndexJChange,
  onIndexKChange,
  onIndexLChange,
  onIndexMChange,
  onIndexNChange,
  onElementSizeChange,
}: IndexInputsProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (arrayType === 'record') {
    return null; // Records handled separately
  }

  const handleNumberInput = (value: string, onChange: (val: string) => void) => {
    if (/^\d*$/.test(value)) {
      onChange(value);
    }
  };

  const indexFields = [
    { name: 'i', label: 'Index i', value: indexI, onChange: onIndexIChange, placeholder: '2', min: 1 },
    { name: 'j', label: 'Index j', value: indexJ, onChange: onIndexJChange, placeholder: '3', min: 2 },
    { name: 'k', label: 'Index k', value: indexK, onChange: onIndexKChange, placeholder: '1', min: 3 },
    { name: 'l', label: 'Index l', value: indexL, onChange: onIndexLChange, placeholder: '0', min: 4 },
    { name: 'm', label: 'Index m', value: indexM, onChange: onIndexMChange, placeholder: '0', min: 5 },
    { name: 'n', label: 'Index n', value: indexN, onChange: onIndexNChange, placeholder: '0', min: 6 },
  ];

  // Determine how many indices to show
  let numIndices = 1; // Default for 1D
  if (arrayType === '2d') numIndices = 2;
  if (arrayType === '3d') numIndices = dimensions;

  const visibleIndices = indexFields.slice(0, numIndices);

  return (
    <div className="px-4 mt-4 space-y-4">
      {/* Index Inputs - side-by-side for i/j with gap */}
      {numIndices === 2 ? (
        <div className="flex gap-4">
          {visibleIndices.map((field) => (
            <div key={field.name} className="flex-1">
              <div 
                className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all p-4 ${ 
                  focusedField === field.name ? 'border-purple-600 dark:border-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-base font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {visibleIndices.map((field) => (
            <div key={field.name} className="flex-1">
              <div 
                className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all p-4 ${
                  focusedField === field.name ? 'border-purple-600 dark:border-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-base font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Element Size Input */}
      <div 
        className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all p-4 ${
          focusedField === 'esize' ? 'border-purple-600 dark:border-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Element size (bytes)</label>
        <input
          type="text"
          value={elementSize}
          onChange={(e) => handleNumberInput(e.target.value, onElementSizeChange)}
          onFocus={() => setFocusedField('esize')}
          onBlur={() => setFocusedField(null)}
          placeholder="4"
          className="w-full bg-transparent text-base font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          esize from declaration
        </p>
      </div>
    </div>
  );
}