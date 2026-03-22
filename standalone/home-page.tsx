/**
 * STANDALONE HOME PAGE - Single File Version
 * This file contains the complete Home page with all components inline
 * Can be copied and used independently
 */

import { useState } from 'react';
import { Binary, Network, Calculator, Percent, Calendar, Clock, Hash, FileCode, RefreshCw, Search, Plus, Home, Bookmark, User, Settings } from 'lucide-react';

// ============================================================================
// HEADER COMPONENT
// ============================================================================
function Header() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-b-3xl shadow-lg pb-6">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-xs font-medium">Dev Calculators</p>
            <h1 className="text-white text-2xl font-bold">Toolbox</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Bookmark className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// WELCOME STRIP COMPONENT
// ============================================================================
function WelcomeStrip() {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="px-4 -mt-4 mb-4">
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{getCurrentGreeting()}, Developer! 👋</p>
        <p className="text-xs text-gray-600 mt-1">What would you like to calculate today?</p>
      </div>
    </div>
  );
}

// ============================================================================
// CATEGORY CHIPS COMPONENT
// ============================================================================
function CategoryChips() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'IT / CS', 'Math', 'Everyday', 'Networking'];

  return (
    <div className="px-4 mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SEARCH BAR COMPONENT
// ============================================================================
function SearchBar() {
  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search calculators..."
          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-600 focus:shadow-sm transition-all"
        />
      </div>
    </div>
  );
}

// ============================================================================
// CALCULATOR CARD COMPONENT
// ============================================================================
interface CalculatorCardProps {
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastUsed?: string;
  onClick?: () => void;
}

function CalculatorCard({
  category,
  title,
  description,
  icon: Icon,
  lastUsed,
  onClick,
}: CalculatorCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all text-left"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {category}
            </span>
            {lastUsed && (
              <span className="text-[10px] text-gray-500">{lastUsed}</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{title}</h3>
          <p className="text-xs text-gray-600 line-clamp-1">{description}</p>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// SECTION DIVIDER COMPONENT
// ============================================================================
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </h2>
    </div>
  );
}

// ============================================================================
// FLOATING BUTTON COMPONENT
// ============================================================================
function FloatingButton() {
  return (
    <button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all">
      <Plus className="w-6 h-6 text-white" />
    </button>
  );
}

// ============================================================================
// BOTTOM NAV COMPONENT
// ============================================================================
function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tools', label: 'Tools', icon: Calculator },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-lg">
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <tab.icon
              className={`w-5 h-5 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN HOME PAGE COMPONENT
// ============================================================================
export default function HomePage() {
  const recentCalculators = [
    {
      category: 'IT / CS',
      title: 'Radix Converter',
      description: 'Convert numbers between bases 2–36',
      icon: Binary,
      lastUsed: '2h ago',
      onClick: () => alert('Navigate to Radix Converter'),
    },
    {
      category: 'Networking',
      title: 'Subnet Calculator',
      description: 'Calculate network ranges and masks',
      icon: Network,
      lastUsed: '5h ago',
    },
  ];

  const popularCalculators = [
    {
      category: 'IT / CS',
      title: "1's & 2's Complement",
      description: 'Calculate complements of binary numbers',
      icon: RefreshCw,
      lastUsed: undefined,
      onClick: () => alert('Navigate to Complement Calculator'),
    },
    {
      category: 'IT / CS',
      title: 'Binary Calculator',
      description: 'Perform operations on binary numbers',
      icon: FileCode,
      lastUsed: undefined,
    },
    {
      category: 'IT / CS',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256 hashes',
      icon: Hash,
      lastUsed: '1d ago',
    },
    {
      category: 'Math',
      title: 'Percentage Calculator',
      description: 'Calculate percentages, increases, decreases',
      icon: Percent,
      lastUsed: undefined,
    },
    {
      category: 'Everyday',
      title: 'Time Calculator',
      description: 'Add and subtract time durations',
      icon: Clock,
      lastUsed: '3d ago',
    },
    {
      category: 'Everyday',
      title: 'Date Calculator',
      description: 'Calculate differences between dates',
      icon: Calendar,
      lastUsed: undefined,
    },
    {
      category: 'Math',
      title: 'Scientific Calculator',
      description: 'Advanced mathematical operations',
      icon: Calculator,
      lastUsed: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <WelcomeStrip />
      <CategoryChips />
      <SearchBar />

      <div className="mt-6">
        <SectionDivider label="Recently Used" />
        <div className="px-4 space-y-3">
          {recentCalculators.map((calc) => (
            <CalculatorCard key={calc.title} {...calc} />
          ))}
        </div>

        <SectionDivider label="Popular in IT / CS" />
        <div className="px-4 space-y-3">
          {popularCalculators.map((calc) => (
            <CalculatorCard key={calc.title} {...calc} />
          ))}
        </div>
      </div>

      <FloatingButton />
      <BottomNav />
    </div>
  );
}
