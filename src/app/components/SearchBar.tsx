import { Search, X, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions?: Array<{ title: string; category: string }>;
  onSuggestionClick?: (suggestion: any) => void;
}

export function SearchBar({ searchQuery, onSearchChange, suggestions = [], onSuggestionClick }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowSuggestions(isFocused && searchQuery.length > 0 && suggestions.length > 0);
  }, [isFocused, searchQuery, suggestions.length]);

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    // Voice input placeholder - would use Web Speech API in production
    alert('Voice input would be activated here using the Web Speech API');
  };

  return (
    <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="px-0 pt-4 pb-3">
        <div className="relative">
          {/* Search Icon */}
          <Search 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-200 ${
              isFocused ? 'text-[#58A6FF] scale-110' : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search calculators or formulas..."
            className="w-full pl-12 pr-24 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#58A6FF] dark:focus:border-[#58A6FF] focus:ring-4 focus:ring-[#58A6FF]/20 outline-none transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
          />
          
          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {/* Clear Button - Shows when there's text */}
            {searchQuery && (
              <button
                onClick={handleClear}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </button>
            )}
            
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4 text-gray-400 group-hover:text-[#58A6FF]" />
            </button>
          </div>
        </div>

        {/* Bottom Border/Shadow */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mt-3 opacity-50"></div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-3 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{suggestion.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}