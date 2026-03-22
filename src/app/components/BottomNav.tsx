import { Home, Tag, Star } from 'lucide-react';
import { useState } from 'react';
import { FavoriteItem } from '../hooks/useFavorites';

interface BottomNavProps {
  onCategorySelect?: (category: string) => void;
  activeCategory?: string;
  favorites?: FavoriteItem[];
  onFavoriteClick?: (id: string) => void;
  onRemoveFavorite?: (id: string) => void;
}

const CATEGORIES = ['All', 'IT / CS', 'Math', 'Everyday', 'Networking'];

const categoryColors: Record<string, { bg: string; text: string }> = {
  'IT / CS':    { bg: 'bg-blue-100 dark:bg-blue-900/40',       text: 'text-blue-700 dark:text-blue-300' },
  'Math':       { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
  'Networking': { bg: 'bg-orange-100 dark:bg-orange-900/40',   text: 'text-orange-700 dark:text-orange-300' },
  'Everyday':   { bg: 'bg-purple-100 dark:bg-purple-900/40',   text: 'text-purple-700 dark:text-purple-300' },
};

export function BottomNav({
  onCategorySelect,
  activeCategory = 'All',
  favorites = [],
  onFavoriteClick,
  onRemoveFavorite,
}: BottomNavProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [showCategories, setShowCategories] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const closeAll = () => {
    setShowCategories(false);
    setShowFavorites(false);
  };

  const handleCategoriesToggle = () => {
    const next = !showCategories;
    setShowFavorites(false);
    setShowCategories(next);
    setActiveTab('categories');
  };

  const handleFavoritesToggle = () => {
    const next = !showFavorites;
    setShowCategories(false);
    setShowFavorites(next);
    setActiveTab('favorites');
  };

  const handleCategoryPick = (cat: string) => {
    onCategorySelect?.(cat);
    setShowCategories(false);
    setActiveTab('home');
  };

  const handleHomeClick = () => {
    setActiveTab('home');
    closeAll();
    onCategorySelect?.('All');
  };

  const navItems = [
    { id: 'home',       icon: Home,  label: 'Home',       onClick: handleHomeClick },
    { id: 'categories', icon: Tag,   label: 'Categories', onClick: handleCategoriesToggle },
    { id: 'favorites',  icon: Star,  label: 'Favorites',  onClick: handleFavoritesToggle, badge: favorites.length },
  ];

  const isSheetOpen = showCategories || showFavorites;

  return (
    <>
      {/* Backdrop */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={closeAll}
        />
      )}

      {/* ── Categories Sheet ─────────────────────────────────────────────────── */}
      {showCategories && (
        <div className="fixed bottom-[64px] left-0 right-0 z-40 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 px-4 pt-4 pb-3 animate-slideUp">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
            Filter by Category
          </p>
          <div className="grid grid-cols-2 gap-2 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryPick(cat)}
                className={`py-3 px-4 rounded-2xl text-sm font-medium text-left transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
                {activeCategory === cat && <span className="ml-2 text-blue-200 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Favorites Sheet ──────────────────────────────────────────────────── */}
      {showFavorites && (
        <div className="fixed bottom-[64px] left-0 right-0 z-40 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 px-4 pt-4 pb-3 animate-slideUp max-h-[70vh] overflow-y-auto">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Favorites
            </p>
            {favorites.length > 0 && (
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>

          {favorites.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Star className="w-7 h-7 text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No favorites yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-[200px]">
                Tap the ★ on any calculator card to add it here
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-2">
              {favorites.map((fav) => {
                const colors = categoryColors[fav.category] ?? { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' };
                return (
                  <div
                    key={fav.id}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-2xl p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-all group"
                    onClick={() => {
                      onFavoriteClick?.(fav.id);
                      closeAll();
                    }}
                  >
                    {/* Category pill */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {fav.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{fav.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{fav.description}</p>
                    </div>

                    {/* Remove star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite?.(fav.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 flex-shrink-0"
                      title="Remove from favorites"
                    >
                      <Star className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Nav Bar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-30">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`relative flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 min-w-[64px] min-h-[48px] ${
                  isActive
                    ? 'text-[#58A6FF] bg-[#58A6FF]/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-all duration-200 ${isActive ? 'scale-110' : ''} ${
                    item.id === 'favorites' && item.badge! > 0 ? 'text-yellow-500 dark:text-yellow-400' : ''
                  }`}
                  fill={item.id === 'favorites' && item.badge! > 0 ? 'currentColor' : 'none'}
                  strokeWidth={item.id === 'favorites' && item.badge! > 0 ? 0 : 2}
                />
                <span className={`text-[10px] font-medium transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
                {/* Favorites count badge */}
                {item.id === 'favorites' && item.badge! > 0 && (
                  <span className="absolute top-1 right-3 min-w-[16px] h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.22s ease-out; }
      `}</style>
    </>
  );
}
