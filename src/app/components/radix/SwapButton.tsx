import { ArrowUpDown } from 'lucide-react';

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  return (
    <div className="flex justify-center my-3">
      <button
        onClick={onSwap}
        className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
      >
        <ArrowUpDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
}
