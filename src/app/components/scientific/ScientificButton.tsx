import type { BtnDef, BtnVariant } from './types';

const variant2cls: Record<BtnVariant, string> = {
  fn:   'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
  op:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50',
  num:  'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
  eq:   'bg-blue-600 hover:bg-blue-700 text-white',
  mem:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40',
  mode: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40',
};

interface ScientificButtonProps extends BtnDef {
  isShift: boolean;
}

export function ScientificButton({ label, label2, action, action2, variant, wide, isShift }: ScientificButtonProps) {
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
