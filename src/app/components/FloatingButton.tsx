import { Plus } from 'lucide-react';

export function FloatingButton() {
  return (
    <button
      className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-[#1F6FEB] to-[#58A6FF] hover:from-[#1a5bc4] hover:to-[#4a94e6] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 ease-out flex items-center justify-center z-20 min-w-[48px] min-h-[48px]"
      aria-label="Add new calculator"
      title="Add Calculator"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
