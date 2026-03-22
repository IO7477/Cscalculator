import { useState, useEffect } from 'react';
import { MemoryHeader } from '../components/memory/MemoryHeader';
import { ArrayTypeSelector, ArrayType } from '../components/memory/ArrayTypeSelector';
import { BaseAddressInput } from '../components/memory/BaseAddressInput';
import { IndexInputs } from '../components/memory/IndexInputs';
import { UpperBoundsInput } from '../components/memory/UpperBoundsInput';
import { FormulaDisplay } from '../components/memory/FormulaDisplay';
import { ComputeButton } from '../components/memory/ComputeButton';
import { AddressResult } from '../components/memory/AddressResult';
import { StepBreakdown } from '../components/memory/StepBreakdown';
import { MemoryPresets } from '../components/memory/MemoryPresets';
import { MemoryActions } from '../components/memory/MemoryActions';

export function MemoryAddressCalculator() {
  const [arrayType, setArrayType] = useState<ArrayType>('2d');
  const [dimensions, setDimensions] = useState(3);
  const [baseAddress, setBaseAddress] = useState('0x2000');
  const [indexI, setIndexI] = useState('2');
  const [indexJ, setIndexJ] = useState('3');
  const [indexK, setIndexK] = useState('1');
  const [indexL, setIndexL] = useState('0');
  const [indexM, setIndexM] = useState('0');
  const [indexN, setIndexN] = useState('0');
  const [elementSize, setElementSize] = useState('4');
  const [ub2, setUb2] = useState('15');
  const [ub3, setUb3] = useState('7');
  const [ub4, setUb4] = useState('10');
  const [ub5, setUb5] = useState('8');
  const [ub6, setUb6] = useState('6');
  
  const [formula, setFormula] = useState('');
  const [addressHex, setAddressHex] = useState('');
  const [addressDecimal, setAddressDecimal] = useState(0);
  const [addressBinary, setAddressBinary] = useState('');
  const [arrayNotation, setArrayNotation] = useState('');
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);

  // Parse address input (hex or decimal)
  const parseAddress = (addr: string): number => {
    if (addr.toLowerCase().startsWith('0x')) {
      return parseInt(addr, 16);
    }
    return parseInt(addr, 10) || 0;
  };

  const formatBinary = (num: number): string => {
    const binary = num.toString(2).padStart(16, '0');
    return binary.match(/.{1,4}/g)?.join(' ') || binary;
  };

  useEffect(() => {
    calculateAddress();
  }, [arrayType, dimensions, baseAddress, indexI, indexJ, indexK, indexL, indexM, indexN, elementSize, ub2, ub3, ub4, ub5, ub6]);

  const calculateAddress = () => {
    // Check if we have minimum required inputs
    if (!baseAddress || !elementSize) {
      setFormula('');
      setAddressHex('');
      setAddressDecimal(0);
      setAddressBinary('');
      setArrayNotation('');
      setCalculationSteps([]);
      return;
    }

    const base = parseAddress(baseAddress);
    const esize = parseInt(elementSize) || 0;
    const indices = [
      parseInt(indexI) || 0,
      parseInt(indexJ) || 0,
      parseInt(indexK) || 0,
      parseInt(indexL) || 0,
      parseInt(indexM) || 0,
      parseInt(indexN) || 0,
    ];
    const upperBounds = [
      parseInt(ub2) || 0,
      parseInt(ub3) || 0,
      parseInt(ub4) || 0,
      parseInt(ub5) || 0,
      parseInt(ub6) || 0,
    ];

    let resultAddress = base;
    let formulaStr = '';
    let notation = '';
    let steps: string[] = [];

    switch (arrayType) {
      case '1d': {
        if (!indexI) return;
        notation = `A[${indices[0]}]`;
        formulaStr = `A[${indices[0]}] = ${baseAddress} + ${indices[0]} × ${esize}`;
        
        const offset1d = indices[0] * esize;
        resultAddress = base + offset1d;
        
        steps = [
          `A[i] = α + i × esize`,
          `A[${indices[0]}] = ${baseAddress} + ${indices[0]} × ${esize}`,
          `     = ${base} + ${offset1d}`,
          `     = ${resultAddress} ✓`
        ];
        break;
      }

      case '2d': {
        if (!indexI || !indexJ || !ub2) return;
        notation = `A[${indices[0]}][${indices[1]}]`;
        formulaStr = `A[${indices[0]}][${indices[1]}] = ${baseAddress} + (${indices[0]} × ${upperBounds[0]} + ${indices[1]}) × ${esize}`;
        
        const offset2d_i = indices[0] * upperBounds[0];
        const offset2d_ij = offset2d_i + indices[1];
        const offset2d = offset2d_ij * esize;
        resultAddress = base + offset2d;
        
        steps = [
          `A[i][j] = α + (i × UB₂ + j) × esize`,
          `A[${indices[0]}][${indices[1]}] = ${baseAddress} + (${indices[0]} × ${upperBounds[0]} + ${indices[1]}) × ${esize}`,
          `          = ${base} + (${offset2d_i} + ${indices[1]}) × ${esize}`,
          `          = ${base} + ${offset2d_ij} × ${esize}`,
          `          = ${base} + ${offset2d}`,
          `          = ${resultAddress} ✓`
        ];
        break;
      }

      case '3d': {
        // Multi-dimensional calculation (3D to 6D)
        const dim = dimensions;
        const indexLabels = ['i', 'j', 'k', 'l', 'm', 'n'];
        const ubLabels = ['UB₂', 'UB₃', 'UB₄', 'UB₅', 'UB₆'];
        
        // Build notation
        notation = `A[${indices.slice(0, dim).join('][')}]`;
        
        // Calculate offset using the general formula
        let offset = 0;
        let currentMultiplier = 1;
        
        // Work backwards from the last index
        for (let d = dim - 1; d >= 0; d--) {
          offset += indices[d] * currentMultiplier;
          if (d > 0) {
            currentMultiplier *= upperBounds[d - 1];
          }
        }
        
        const totalOffset = offset * esize;
        resultAddress = base + totalOffset;
        
        // Build formula string
        let formulaParts = [];
        let temp = indices[0].toString();
        for (let d = 1; d < dim; d++) {
          temp = `(${temp} × ${upperBounds[d - 1]} + ${indices[d]})`;
        }
        formulaStr = `A[${indices.slice(0, dim).join('][')}] = ${baseAddress} + ${temp} × ${esize}`;
        
        // Build step-by-step calculation
        steps = [];
        
        // General formula
        let generalFormula = 'A';
        for (let d = 0; d < dim; d++) {
          generalFormula += `[${indexLabels[d]}]`;
        }
        generalFormula += ' = α + ';
        
        // Build nested formula
        let nestedFormula = indexLabels[0];
        for (let d = 1; d < dim; d++) {
          nestedFormula = `(${nestedFormula} × ${ubLabels[d - 1]} + ${indexLabels[d]})`;
        }
        generalFormula += `${nestedFormula} × esize`;
        steps.push(generalFormula);
        
        // Substitution step
        steps.push(formulaStr);
        
        // Intermediate calculations
        let current = indices[0];
        const padding = '              ';
        for (let d = 1; d < dim; d++) {
          const mult = current * upperBounds[d - 1];
          const sum = mult + indices[d];
          steps.push(`${padding}= ${base} + (${mult} + ${indices[d]})${d < dim - 1 ? ` × ${upperBounds[d]}` : ''} × ${esize}`);
          current = sum;
        }
        
        steps.push(`${padding}= ${base} + ${offset} × ${esize}`);
        steps.push(`${padding}= ${base} + ${totalOffset}`);
        steps.push(`${padding}= ${resultAddress} ✓`);
        
        break;
      }

      case 'record': {
        // Simplified record calculation
        notation = `Record.field`;
        formulaStr = `Record.field = ${baseAddress} + offset`;
        const recordOffset = (indices[0] || 0) * esize;
        resultAddress = base + recordOffset;
        
        steps = [
          `Record.field = α + field_offset × esize`,
          `             = ${baseAddress} + ${indices[0] || 0} × ${esize}`,
          `             = ${base} + ${recordOffset}`,
          `             = ${resultAddress} ✓`
        ];
        break;
      }
    }

    setFormula(formulaStr);
    setArrayNotation(notation);
    setAddressDecimal(resultAddress);
    setAddressHex('0x' + resultAddress.toString(16).toUpperCase());
    setAddressBinary(formatBinary(resultAddress));
    setCalculationSteps(steps);
  };

  const handlePresetSelect = (action: '1d-int' | '2d-char' | 'record' | '3d-float') => {
    switch (action) {
      case '1d-int':
        setArrayType('1d');
        setBaseAddress('0x1000');
        setIndexI('5');
        setElementSize('4');
        break;
      case '2d-char':
        setArrayType('2d');
        setBaseAddress('0x2000');
        setIndexI('2');
        setIndexJ('3');
        setUb2('20');
        setElementSize('1');
        break;
      case 'record':
        setArrayType('record');
        setBaseAddress('0x3000');
        setIndexI('2');
        setElementSize('8');
        break;
      case '3d-float':
        setArrayType('3d');
        setDimensions(3);
        setBaseAddress('0x4000');
        setIndexI('1');
        setIndexJ('2');
        setIndexK('3');
        setUb2('6');
        setUb3('7');
        setElementSize('4');
        break;
    }
  };

  const handleClearAll = () => {
    setArrayType('2d');
    setDimensions(3);
    setBaseAddress('0x2000');
    setIndexI('2');
    setIndexJ('3');
    setIndexK('1');
    setIndexL('0');
    setIndexM('0');
    setIndexN('0');
    setElementSize('4');
    setUb2('15');
    setUb3('7');
    setUb4('10');
    setUb5('8');
    setUb6('6');
    setFormula('');
    setAddressHex('');
    setAddressDecimal(0);
    setAddressBinary('');
    setArrayNotation('');
    setCalculationSteps([]);
  };

  const getCalculationText = (): string => {
    if (!addressHex) return '';
    
    return `Memory Address Calculation

Array Type: ${arrayType.toUpperCase()}${arrayType === '3d' ? ` (${dimensions}D)` : ''}
Array Notation: ${arrayNotation}
Formula: ${formula}

Result:
Address (Hex): ${addressHex}
Address (Dec): ${addressDecimal}
Address (Bin): ${addressBinary}

Step-by-Step Calculation:
${calculationSteps.join('\n')}`;
  };

  const hasResult = addressHex !== '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <MemoryHeader />

      <ArrayTypeSelector
        selected={arrayType}
        onChange={setArrayType}
        dimensions={dimensions}
        onDimensionsChange={setDimensions}
      />

      {/* Base address and Element size in same row */}
      <div className="px-4 mt-4 flex gap-4">
        <BaseAddressInput
          value={baseAddress}
          onChange={setBaseAddress}
        />
        <div className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all p-4 flex-1 ${
          false ? 'border-purple-600 dark:border-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'
        }`}>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Element size (bytes)</label>
          <input
            type="text"
            value={elementSize}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setElementSize(e.target.value);
              }
            }}
            placeholder="4"
            className="w-full bg-transparent text-base font-mono font-medium text-gray-900 dark:text-white outline-none mt-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            esize from declaration
          </p>
        </div>
      </div>

      <IndexInputs
        arrayType={arrayType}
        indexI={indexI}
        indexJ={indexJ}
        indexK={indexK}
        indexL={indexL}
        indexM={indexM}
        indexN={indexN}
        elementSize=""
        dimensions={dimensions}
        onIndexIChange={setIndexI}
        onIndexJChange={setIndexJ}
        onIndexKChange={setIndexK}
        onIndexLChange={setIndexL}
        onIndexMChange={setIndexM}
        onIndexNChange={setIndexN}
        onElementSizeChange={() => {}}
      />

      <UpperBoundsInput
        arrayType={arrayType}
        ub2={ub2}
        ub3={ub3}
        ub4={ub4}
        ub5={ub5}
        ub6={ub6}
        dimensions={dimensions}
        onUb2Change={setUb2}
        onUb3Change={setUb3}
        onUb4Change={setUb4}
        onUb5Change={setUb5}
        onUb6Change={setUb6}
      />

      <ComputeButton />

      {/* Formula moved ABOVE result for better flow */}
      <FormulaDisplay formula={formula} />

      <AddressResult
        arrayNotation={arrayNotation}
        addressHex={addressHex}
        addressDecimal={addressDecimal}
        addressBinary={addressBinary}
        hasResult={hasResult}
      />

      <StepBreakdown
        steps={calculationSteps}
        hasResult={hasResult}
      />

      <MemoryPresets onSelectPreset={handlePresetSelect} />

      <div className="h-8" />

      <MemoryActions
        onClearAll={handleClearAll}
        hasResult={hasResult}
        calculationText={getCalculationText()}
      />
    </div>
  );
}