import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Initialize favorited recipes from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pantry_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading pantry favorites", e);
      return [];
    }
  });

  // Initialize search history from localStorage
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('pantry_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading pantry search history", e);
      return [];
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('pantry_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('pantry_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  /**
   * Toggles a recipe's favorited status.
   * 
   * @param {object} recipe - The recipe object to add or remove.
   */
  const toggleFavorite = (recipe) => {
    if (!recipe || !recipe.id) return;
    setFavorites(prev => {
      const isFav = prev.some(r => r.id === recipe.id);
      if (isFav) {
        return prev.filter(r => r.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  /**
   * Checks if a recipe is in the user's favorites list.
   * 
   * @param {number|string} recipeId - The recipe's unique identifier.
   * @returns {boolean}
   */
  const isFavorite = (recipeId) => {
    return favorites.some(r => r.id === recipeId);
  };

  /**
   * Adds an ingredient search query to history.
   * Keeps search entries unique and caps the list at 10 items.
   * 
   * @param {string} ingredientString - Comma-separated ingredient search string.
   */
  const addToHistory = (ingredientString) => {
    if (!ingredientString || typeof ingredientString !== 'string') return;
    const trimmed = ingredientString.trim();
    if (!trimmed) return;

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  /**
   * Clears the entire search history.
   */
  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      searchHistory,
      addToHistory,
      clearHistory
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
