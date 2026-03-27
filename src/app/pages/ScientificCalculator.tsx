import { useState, useCallback } from 'react';
import { CalculatorHeader } from '../components/shared/CalculatorHeader';
import { ScientificButton } from '../components/scientific/ScientificButton';
import { toAngle, fromAngle, factorial, formatDisplay } from '../components/scientific/utils';
import type { AngleMode, BtnDef } from '../components/scientific/types';

// ─── Main Component ──────────────────────────────────────────────────────────
export function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isShift, setIsShift] = useState(false);   // 2nd function toggle
  const [justEvaluated, setJustEvaluated] = useState(false);

  // ── Input digit / decimal ──────────────────────────────────────────────────
  const inputDigit = useCallback((digit: string) => {
    if (justEvaluated) {
      setDisplay(digit);
      setExpression(digit);
      setJustEvaluated(false);
      setWaitingForOperand(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay(digit);
      setExpression(prev => prev + digit);
      setWaitingForOperand(false);
    } else {
      const next = display === '0' ? digit : display + digit;
      setDisplay(next);
      setExpression(prev => prev === '0' ? digit : prev + digit);
    }
  }, [display, waitingForOperand, justEvaluated]);

  const inputDecimal = useCallback(() => {
    if (justEvaluated) {
      setDisplay('0.');
      setExpression('0.');
      setJustEvaluated(false);
      setWaitingForOperand(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay('0.');
      setExpression(prev => prev + '0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setExpression(prev => prev + '.');
    }
  }, [display, waitingForOperand, justEvaluated]);

  // ── Operators ─────────────────────────────────────────────────────────────
  const inputOperator = useCallback((op: string) => {
    setJustEvaluated(false);
    setWaitingForOperand(true);
    setExpression(prev => {
      const last = prev.slice(-1);
      if (['+', '-', '*', '/'].includes(last)) return prev.slice(0, -1) + op;
      return prev + op;
    });
  }, []);

  // ── Evaluate ──────────────────────────────────────────────────────────────
  const evaluate = useCallback(() => {
    try {
      const expr = expression.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + expr + ')')();
      const resultStr = Number.isFinite(result)
        ? parseFloat(result.toPrecision(12)).toString()
        : result === Infinity ? 'Infinity' : 'Error';
      setHistory(expression + ' =');
      setDisplay(resultStr);
      setExpression(resultStr);
      setWaitingForOperand(false);
      setJustEvaluated(true);
    } catch {
      setDisplay('Error');
      setExpression('');
      setWaitingForOperand(false);
    }
  }, [expression]);

  // ── Unary scientific ops ──────────────────────────────────────────────────
  const applyUnary = useCallback((fn: string) => {
    const val = parseFloat(display);
    let result: number;
    switch (fn) {
      case 'sin':  result = Math.sin(toAngle(val, angleMode)); break;
      case 'cos':  result = Math.cos(toAngle(val, angleMode)); break;
      case 'tan':  result = Math.tan(toAngle(val, angleMode)); break;
      case 'asin': result = fromAngle(Math.asin(val), angleMode); break;
      case 'acos': result = fromAngle(Math.acos(val), angleMode); break;
      case 'atan': result = fromAngle(Math.atan(val), angleMode); break;
      case 'log':  result = Math.log10(val); break;
      case 'ln':   result = Math.log(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'cbrt': result = Math.cbrt(val); break;
      case 'x2':   result = val * val; break;
      case 'x3':   result = val * val * val; break;
      case '1/x':  result = 1 / val; break;
      case 'n!':   result = factorial(val); break;
      case '10x':  result = Math.pow(10, val); break;
      case 'ex':   result = Math.exp(val); break;
      case 'abs':  result = Math.abs(val); break;
      case '+/-':  result = -val; break;
      default: return;
    }
    const rs = Number.isFinite(result)
      ? parseFloat(result.toPrecision(12)).toString()
      : isNaN(result) ? 'Error' : 'Infinity';
    setHistory(`${fn}(${display}) =`);
    setDisplay(rs);
    setExpression(rs);
    setJustEvaluated(true);
    setWaitingForOperand(false);
  }, [display, angleMode]);

  // ── Constants ─────────────────────────────────────────────────────────────
  const insertConstant = useCallback((c: string) => {
    const v = c === 'π' ? Math.PI.toString() : Math.E.toString();
    if (waitingForOperand || justEvaluated) {
      setDisplay(c === 'π' ? '3.14159…' : '2.71828…');
      setExpression(prev => prev + v);
    } else {
      setDisplay(c === 'π' ? '3.14159…' : '2.71828…');
      setExpression(prev => prev + '*' + v);
    }
    setWaitingForOperand(false);
    setJustEvaluated(false);
  }, [waitingForOperand, justEvaluated]);

  // ── Power (xʸ) ────────────────────────────────────────────────────────────
  const inputPower = useCallback(() => {
    setExpression(prev => prev + '**');
    setWaitingForOperand(true);
    setJustEvaluated(false);
  }, []);

  // ── Backspace ─────────────────────────────────────────────────────────────
  const backspace = useCallback(() => {
    if (justEvaluated) { clear(); return; }
    const next = display.length > 1 ? display.slice(0, -1) : '0';
    setDisplay(next);
    setExpression(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }, [display, justEvaluated]);

  // ── Clear ─────────────────────────────────────────────────────────────────
  const clear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setHistory('');
    setWaitingForOperand(false);
    setJustEvaluated(false);
  }, []);

  // ── Memory ────────────────────────────────────────────────────────────────
  const mc = () => setMemory(0);
  const mr = () => { setDisplay(memory.toString()); setExpression(memory.toString()); setWaitingForOperand(false); };
  const mPlus = () => setMemory(m => m + parseFloat(display));
  const mMinus = () => setMemory(m => m - parseFloat(display));

  // ── Button factory ────────────────────────────────────────────────────────
  type BtnVariant = 'fn' | 'op' | 'num' | 'eq' | 'mem' | 'mode';
  interface BtnDef { label: string; label2?: string; action: () => void; action2?: () => void; variant: BtnVariant; wide?: boolean; }

  const variant2cls: Record<BtnVariant, string> = {
    fn:   'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
    op:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50',
    num:  'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
    eq:   'bg-blue-600 hover:bg-blue-700 text-white',
    mem:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40',
    mode: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40',
  };

  function Btn({ label, label2, action, action2, variant, wide }: BtnDef) {
    const cls = variant2cls[variant];
    const handleClick = () => isShift && action2 ? action2() : action();
    const shown = isShift && label2 ? label2 : label;
    return (
      <button
        onClick={handleClick}
        className={`${cls} ${wide ? 'col-span-2' : ''} rounded-2xl font-semibold text-sm transition-all duration-150 active:scale-95 shadow-sm min-h-[44px] flex items-center justify-center`}
      >
        {shown}
      </button>
    );
  }

  const buttons: BtnDef[] = [
    // Row 1 — memory + mode
    { label: 'MC', action: mc, variant: 'mem' },
    { label: 'MR', action: mr, variant: 'mem' },
    { label: 'M+', action: mPlus, variant: 'mem' },
    { label: 'M−', action: mMinus, variant: 'mem' },
    { label: angleMode, action: () => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG'), variant: 'mode' },

    // Row 2 — scientific (shift row)
    { label: '2nd', action: () => setIsShift(s => !s), variant: 'fn' },
    { label: 'sin', label2: 'asin', action: () => applyUnary('sin'), action2: () => applyUnary('asin'), variant: 'fn' },
    { label: 'cos', label2: 'acos', action: () => applyUnary('cos'), action2: () => applyUnary('acos'), variant: 'fn' },
    { label: 'tan', label2: 'atan', action: () => applyUnary('tan'), action2: () => applyUnary('atan'), variant: 'fn' },
    { label: 'n!',  action: () => applyUnary('n!'), variant: 'fn' },

    // Row 3
    { label: 'x²',  label2: '√x',  action: () => applyUnary('x2'),   action2: () => applyUnary('sqrt'),  variant: 'fn' },
    { label: 'x³',  label2: '∛x',  action: () => applyUnary('x3'),   action2: () => applyUnary('cbrt'),  variant: 'fn' },
    { label: 'xʸ',  label2: 'ʸ√x', action: inputPower,                action2: inputPower,                variant: 'fn' },
    { label: 'log', label2: '10ˣ', action: () => applyUnary('log'),   action2: () => applyUnary('10x'),   variant: 'fn' },
    { label: 'ln',  label2: 'eˣ',  action: () => applyUnary('ln'),    action2: () => applyUnary('ex'),    variant: 'fn' },

    // Row 4
    { label: '(',  action: () => { setExpression(p => p + '('); }, variant: 'fn' },
    { label: ')',  action: () => { setExpression(p => p + ')'); }, variant: 'fn' },
    { label: '1/x', action: () => applyUnary('1/x'), variant: 'fn' },
    { label: '|x|', action: () => applyUnary('abs'), variant: 'fn' },
    { label: '%',  action: () => { const v = parseFloat(display) / 100; setDisplay(v.toString()); setExpression(p => p.slice(0, -display.length) + v.toString()); }, variant: 'fn' },

    // Row 5
    { label: 'π',  action: () => insertConstant('π'), variant: 'fn' },
    { label: 'e',  action: () => insertConstant('e'), variant: 'fn' },
    { label: '±',  action: () => applyUnary('+/-'), variant: 'fn' },
    { label: 'AC', action: clear, variant: 'fn' },
    { label: '⌫',  action: backspace, variant: 'fn' },

    // Row 6
    { label: '7', action: () => inputDigit('7'), variant: 'num' },
    { label: '8', action: () => inputDigit('8'), variant: 'num' },
    { label: '9', action: () => inputDigit('9'), variant: 'num' },
    { label: '÷', action: () => inputOperator('/'), variant: 'op' },
    { label: '×', action: () => inputOperator('*'), variant: 'op' },

    // Row 7
    { label: '4', action: () => inputDigit('4'), variant: 'num' },
    { label: '5', action: () => inputDigit('5'), variant: 'num' },
    { label: '6', action: () => inputDigit('6'), variant: 'num' },
    { label: '−', action: () => inputOperator('-'), variant: 'op' },
    { label: '+', action: () => inputOperator('+'), variant: 'op' },

    // Row 8
    { label: '1', action: () => inputDigit('1'), variant: 'num' },
    { label: '2', action: () => inputDigit('2'), variant: 'num' },
    { label: '3', action: () => inputDigit('3'), variant: 'num' },
    // = spans 2 rows — handled separately
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-6">
      <CalculatorHeader title="Scientific Calculator" />

      {/* ── Display ─────────────────────────────────────────────────── */}
      <div className="mx-4 mt-4 rounded-2xl bg-gray-900 dark:bg-[#0a0e14] p-4 shadow-lg border border-gray-800 dark:border-gray-700">
        {/* History / expression row */}
        <p className="text-xs font-mono text-gray-500 dark:text-gray-500 min-h-[18px] text-right truncate">
          {history || expression || ''}
        </p>
        {/* Main display */}
        <p className="text-right font-mono font-semibold text-white mt-1 break-all leading-none"
          style={{ fontSize: display.length > 12 ? '1.4rem' : display.length > 8 ? '1.8rem' : '2.4rem' }}>
          {formatDisplay(display)}
        </p>
        {/* Memory / angle indicators */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            {memory !== 0 && (
              <span className="text-[10px] font-bold text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">M</span>
            )}
            {isShift && (
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full">2nd</span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-400">{angleMode}</span>
        </div>
      </div>

      {/* ── Button Grid ─────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 grid grid-cols-5 gap-2">
        {buttons.map((btn, i) => (
          <Btn key={i} {...btn} />
        ))}

        {/* Last row: 0 (wide), ., = (tall) */}
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 rounded-2xl font-semibold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-150 active:scale-95 shadow-sm min-h-[44px]"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="rounded-2xl font-semibold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-150 active:scale-95 shadow-sm min-h-[44px]"
        >
          .
        </button>
        <button
          onClick={evaluate}
          className="col-span-2 rounded-2xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white transition-all duration-150 active:scale-95 shadow-sm min-h-[44px]"
        >
          =
        </button>
      </div>

      {/* ── Usage hint ──────────────────────────────────────────────── */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4 px-4">
        Tap <span className="font-semibold text-gray-500">2nd</span> to access inverse functions (sin⁻¹, cos⁻¹, 10ˣ…)
      </p>
    </div>
  );
}