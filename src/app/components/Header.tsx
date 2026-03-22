import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-blue-600 dark:bg-[#1a1f2e] text-white px-6 py-4 rounded-b-3xl shadow-lg border-b-2 border-purple-600 dark:border-purple-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs opacity-80 font-medium tracking-wide">Toolbox</span>
          <h1 className="text-2xl font-bold mt-1">Dev Calculators</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {isDark ? (
              <Moon className="w-5 h-5 text-gray-800 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-600" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}