import { Star } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CalculatorCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastUsed?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'IT / CS':    { bg: 'bg-blue-100 dark:bg-blue-900/40',    text: 'text-blue-700 dark:text-blue-300' },
  'Math':       { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
  'Networking': { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300' },
  'Everyday':   { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
};

const categoryIconBg: Record<string, string> = {
  'IT / CS':    'bg-blue-50 dark:bg-blue-900/20',
  'Math':       'bg-emerald-50 dark:bg-emerald-900/20',
  'Networking': 'bg-orange-50 dark:bg-orange-900/20',
  'Everyday':   'bg-purple-50 dark:bg-purple-900/20',
};

const categoryIconColor: Record<string, string> = {
  'IT / CS':    'text-blue-600 dark:text-blue-400',
  'Math':       'text-emerald-600 dark:text-emerald-400',
  'Networking': 'text-orange-600 dark:text-orange-400',
  'Everyday':   'text-purple-600 dark:text-purple-400',
};

export function CalculatorCard({
  id,
  category,
  title,
  description,
  icon: Icon,
  lastUsed,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}: CalculatorCardProps) {
  const colors = categoryColors[category] ?? { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' };
  const iconBg = categoryIconBg[category] ?? 'bg-gray-100 dark:bg-gray-700';
  const iconColor = categoryIconColor[category] ?? 'text-gray-600 dark:text-gray-400';

  return (
    <div
      onClick={onClick}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 active:scale-[0.99] group"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {category}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>
        {lastUsed && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{lastUsed}</p>
        )}
      </div>

      {/* Star favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle?.(e);
        }}
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          isFavorite
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100'
        } hover:scale-110 active:scale-95`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className="w-4 h-4 transition-all duration-200"
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 0 : 2}
        />
      </button>
    </div>
  );
}
