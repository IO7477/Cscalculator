import { useState, useEffect } from 'react';

export interface RecentCalculator {
  id: string;
  title: string;
  category: string;
  description: string;
  timestamp: number;
}

const MAX_RECENT = 5;
const STORAGE_KEY = 'dev-calc-recent';

export function useRecentlyUsed() {
  const [recent, setRecent] = useState<RecentCalculator[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  }, [recent]);

  const addToRecent = (calculator: Omit<RecentCalculator, 'timestamp'>) => {
    setRecent((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== calculator.id);
      // Add to front with timestamp
      const updated = [{ ...calculator, timestamp: Date.now() }, ...filtered];
      // Keep only MAX_RECENT items
      return updated.slice(0, MAX_RECENT);
    });
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recent, addToRecent, clearRecent };
}
