import { Equal } from 'lucide-react';

export function CalculateButton() {
  return (
    <div className="flex justify-center my-4">
      <div className="w-11 h-11 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
        <Equal className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  );
}
