import { ArrowLeftRight, RotateCw } from 'lucide-react';

interface PerformOperationButtonProps {
  operationType: 'left-shift' | 'right-shift' | 'rotate';
}

export function PerformOperationButton({ operationType }: PerformOperationButtonProps) {
  return (
    <div className="flex justify-center my-4">
      <div className="w-11 h-11 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
        {operationType === 'rotate' ? (
          <RotateCw className="w-5 h-5 text-gray-700" />
        ) : (
          <ArrowLeftRight className="w-5 h-5 text-gray-700" />
        )}
      </div>
    </div>
  );
}
