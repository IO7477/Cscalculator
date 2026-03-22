import { useState, useCallback, useEffect } from 'react';

export interface FavoriteItem {
  id: string;
  title: string;
  category: string;
  description: string;
}

const STORAGE_KEY = 'toolbox_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) return prev.filter((f) => f.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
