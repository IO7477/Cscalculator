import { Plus } from 'lucide-react';

export function InvertButton() {
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
