import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CalculatorCard } from '../components/CalculatorCard';
import { SectionDivider } from '../components/SectionDivider';
import { BottomNav } from '../components/BottomNav';
import {
  Binary, Plus, ArrowLeftRight, RefreshCw, MemoryStick,
  TrendingUp, Layers, Brackets, FlaskConical, Network,
} from 'lucide-react';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';
import { useFavorites } from '../hooks/useFavorites';

export function Home() {
  const navigate = useNavigate();
  const { recent, addToRecent } = useRecentlyUsed();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allCalculators = [
    // ── IT / CS ─────────────────────────────────────────────────────────────
    {
      id: 'radix-converter',
      category: 'IT / CS',
      title: 'Radix Converter',
      description: 'Convert numbers between bases 2–36',
      icon: Binary,
      path: '/radix-converter',
    },
    {
      id: 'twos-complement',
      category: 'IT / CS',
      title: "1's & 2's Complement",
      description: 'Calculate complements of binary numbers',
      icon: RefreshCw,
      path: '/twos-complement',
    },
    {
      id: 'bitwise-operations',
      category: 'IT / CS',
      title: 'Bitwise Shift & Rotate',
      description: 'Perform bitwise shift and rotate operations',
      icon: ArrowLeftRight,
      path: '/bitwise-operations',
    },
    {
      id: 'arithmetic-operations',
      category: 'IT / CS',
      title: 'Arithmetic Operations',
      description: 'Add, subtract, multiply, divide in any base',
      icon: Plus,
      path: '/arithmetic-operations',
    },
    {
      id: 'memory-address',
      category: 'IT / CS',
      title: 'Array & Record Addresses',
      description: 'Calculate memory addresses for arrays & records',
      icon: MemoryStick,
      path: '/memory-address',
    },
    {
      id: 'big-o-calculator',
      category: 'IT / CS',
      title: 'Big O Calculator',
      description: 'Analyze time complexity and algorithm growth',
      icon: TrendingUp,
      path: '/big-o-calculator',
    },
    {
      id: 'stack-queue',
      category: 'IT / CS',
      title: 'Stack & Queue',
      description: 'Visualize LIFO and FIFO data structures',
      icon: Layers,
      path: '/stack-queue',
    },
    {
      id: 'expression-evaluator',
      category: 'IT / CS',
      title: 'Expression Evaluator',
      description: 'Convert infix to postfix/prefix & evaluate expressions',
      icon: Brackets,
      path: '/expression-evaluator',
    },
    // ── Math ─────────────────────────────────────────────────────────────────
    {
      id: 'scientific-calculator',
      category: 'Math',
      title: 'Scientific Calculator',
      description: 'Trig, logarithms, powers, memory & angle modes',
      icon: FlaskConical,
      path: '/scientific-calculator',
    },
    // ── Networking ───────────────────────────────────────────────────────────
    {
      id: 'subnet-calculator',
      category: 'Networking',
      title: 'VLSM / FLSM Calculator',
      description: 'Variable & fixed-length subnet masking with host ranges',
      icon: Network,
      path: '/subnet-calculator',
    },
  ];

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const recentCalculators = useMemo(() => {
    return recent
      .map((item) => {
        const calc = allCalculators.find((c) => c.id === item.id);
        if (!calc) return null;
        return { ...calc, lastUsed: getTimeAgo(item.timestamp) };
      })
      .filter(Boolean);
  }, [recent]);

  const handleCalculatorClick = (calc: (typeof allCalculators)[0]) => {
    addToRecent({
      id: calc.id,
      title: calc.title,
      category: calc.category,
      description: calc.description,
    });
    navigate(calc.path);
  };

  // Navigate to a calculator by id (used from favorites sheet)
  const handleFavoriteClick = (id: string) => {
    const calc = allCalculators.find((c) => c.id === id);
    if (calc) handleCalculatorClick(calc);
  };

  const filteredCalculators = useMemo(() => {
    let list = allCalculators;
    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery, activeCategory]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filteredCalculators.slice(0, 5);
  }, [searchQuery, filteredCalculators]);

  const filteredRecent = useMemo(() => {
    if (!searchQuery.trim() && activeCategory === 'All') return recentCalculators;
    const q = searchQuery.toLowerCase();
    return (recentCalculators as any[]).filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory, recentCalculators]);

  const sectionLabel = useMemo(() => {
    if (searchQuery.trim()) return 'Search Results';
    if (activeCategory !== 'All') return activeCategory;
    return 'All Calculators';
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 transition-colors">
      <Header />

      <div className="pt-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          suggestions={searchSuggestions}
          onSuggestionClick={(calc) => handleCalculatorClick(calc)}
        />
      </div>

      {/* Active category badge */}
      {activeCategory !== 'All' && (
        <div className="px-4 pt-1 pb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {activeCategory}
          </span>
          <button
            onClick={() => setActiveCategory('All')}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Clear ×
          </button>
        </div>
      )}

      <div className="mt-2">
        {/* Recently Used */}
        {filteredRecent.length > 0 && !searchQuery && activeCategory === 'All' && (
          <>
            <SectionDivider label="Recently Used" />
            <div className="px-4 space-y-3">
              {(filteredRecent as any[]).slice(0, 4).map((calc) => (
                <CalculatorCard
                  key={calc.id}
                  {...calc}
                  isFavorite={isFavorite(calc.id)}
                  onFavoriteToggle={() =>
                    toggleFavorite({
                      id: calc.id,
                      title: calc.title,
                      category: calc.category,
                      description: calc.description,
                    })
                  }
                  onClick={() => handleCalculatorClick(calc)}
                />
              ))}
            </div>
          </>
        )}

        {/* Main list */}
        {filteredCalculators.length > 0 ? (
          <>
            <SectionDivider label={sectionLabel} />
            <div className="px-4 space-y-3 pb-4">
              {filteredCalculators.map((calc) => (
                <CalculatorCard
                  key={calc.id}
                  id={calc.id}
                  category={calc.category}
                  title={calc.title}
                  description={calc.description}
                  icon={calc.icon}
                  isFavorite={isFavorite(calc.id)}
                  onFavoriteToggle={() =>
                    toggleFavorite({
                      id: calc.id,
                      title: calc.title,
                      category: calc.category,
                      description: calc.description,
                    })
                  }
                  onClick={() => handleCalculatorClick(calc)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="px-4 py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-base">No calculators found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {activeCategory !== 'All'
                ? `No calculators in "${activeCategory}" yet`
                : 'Try a different search term'}
            </p>
          </div>
        )}
      </div>

      <BottomNav
        onCategorySelect={setActiveCategory}
        activeCategory={activeCategory}
        favorites={favorites}
        onFavoriteClick={handleFavoriteClick}
        onRemoveFavorite={removeFavorite}
      />
    </div>
  );
}
