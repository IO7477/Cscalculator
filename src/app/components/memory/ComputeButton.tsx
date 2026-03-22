import { Calculator } from 'lucide-react';

export function ComputeButton() {
  return (
    <div className="flex justify-center my-6">
      <button className="w-[140px] h-[44px] bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium">
        <Calculator className="w-5 h-5" />
        <span>Calculate</span>
      </button>
    </div>
  );
}