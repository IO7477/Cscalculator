import { useState } from 'react';
import { ArrayType } from './ArrayTypeSelector';

interface UpperBoundsInputProps {
  arrayType: ArrayType;
  ub2: string;
  ub3: string;
  ub4: string;
  ub5: string;
  ub6: string;
  dimensions: number;
  onUb2Change: (value: string) => void;
  onUb3Change: (value: string) => void;
  onUb4Change: (value: string) => void;
  onUb5Change: (value: string) => void;
  onUb6Change: (value: string) => void;
}

export function UpperBoundsInput({
  arrayType,
  ub2,
  ub3,
  ub4,
  ub5,
  ub6,
  dimensions,
  onUb2Change,
  onUb3Change,
  onUb4Change,
  onUb5Change,
  onUb6Change,
}: UpperBoundsInputProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (arrayType === '1d' || arrayType === 'record') {
    return null;
  }

  const handleNumberInput = (value: string, onChange: (val: string) => void) => {
    if (/^\d*$/.test(value)) {
      onChange(value);
    }
  };

  const boundFields = [
    { name: 'ub2', label: 'Upper bound 2 (UB₂)', value: ub2, onChange: onUb2Change, placeholder: '10', minDim: 2, example: 'A[10][15]' },
    { name: 'ub3', label: 'Upper bound 3 (UB₃)', value: ub3, onChange: onUb3Change, placeholder: '15', minDim: 3, example: 'A[5][10][15]' },
    { name: 'ub4', label: 'Upper bound 4 (UB₄)', value: ub4, onChange: onUb4Change, placeholder: '20', minDim: 4, example: 'A[5][10][15][20]' },
    { name: 'ub5', label: 'Upper bound 5 (UB₅)', value: ub5, onChange: onUb5Change, placeholder: '25', minDim: 5, example: 'A[5][10][15][20][25]' },
    { name: 'ub6', label: 'Upper bound 6 (UB₆)', value: ub6, onChange: onUb6Change, placeholder: '30', minDim: 6, example: 'A[5][10][15][20][25][30]' },
  ];

  // Determine how many bounds to show
  let numBounds = 0;
  if (arrayType === '2d') numBounds = 1;
  if (arrayType === '3d') numBounds = dimensions - 1;

  const visibleBounds = boundFields.slice(0, numBounds);

  return (
    <div className="px-4 mt-4">
      {/* Upper bounds in columns like index sections */}
      <div className="grid grid-cols-3 gap-3">
        {visibleBounds.map((field) => (
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
    </div>
  );
}