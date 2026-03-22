import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalysisIndicatorProps {
  confidence: 'high' | 'medium' | 'low';
  patterns: string[];
  reasoning: string;
}

export function AnalysisIndicator({ confidence, patterns, reasoning }: AnalysisIndicatorProps) {
  const confidenceConfig = {
    high: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'High confidence',
    },
    medium: {
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      label: 'Medium confidence',
    },
    low: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      label: 'Low confidence',
    },
  };

  const config = confidenceConfig[confidence];
  const Icon = config.icon;

  return (
    <div className="px-4 mt-4">
      <div className={`rounded-2xl border ${config.border} ${config.bg} p-4`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
                {config.label}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {reasoning}
            </p>
            {patterns.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">Detected patterns:</p>
                <div className="flex flex-wrap gap-2">
                  {patterns.map((pattern, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
