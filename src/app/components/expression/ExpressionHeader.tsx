import { ChevronLeft, HelpCircle, MoreVertical, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../../contexts/ThemeContext';

export function ExpressionHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm pb-4">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 min-w-[40px] min-h-[40px]"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expression Evaluator</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 min-w-[40px] min-h-[40px]"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-600" />
              )}
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 min-w-[40px] min-h-[40px]"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 min-w-[40px] min-h-[40px]"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}