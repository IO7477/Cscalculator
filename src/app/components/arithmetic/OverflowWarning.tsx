import { AlertTriangle } from 'lucide-react';

interface OverflowWarningProps {
  visible: boolean;
  message: string;
}

export function OverflowWarning({ visible, message }: OverflowWarningProps) {
  if (!visible) return null;

  return (
    <div className="px-4 mt-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <p className="text-sm text-gray-800 flex-1">{message}</p>
      </div>
    </div>
  );
}
