import React, { createContext, useContext, useState, useEffect } from 'react';

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
  // Initialize pantry ingredients from localStorage
  const [ingredients, setIngredients] = useState(() => {
    try {
      const saved = localStorage.getItem('pantry_ingredients');
      return saved ? JSON.parse(saved) : ['Tomato', 'Garlic', 'Olive Oil', 'Pasta']; // friendly initial defaults
    } catch (e) {
      console.error("Error loading pantry ingredients", e);
      return [];
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('pantry_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  /**
   * Adds ingredients to the pantry.
   * Supports comma-separated strings to allow bulk pasting.
   * Filters out empty strings and duplicates case-insensitively.
   * 
   * @param {string} input - Raw string input, potentially comma-separated.
   */
  const addIngredients = (input) => {
    if (!input || typeof input !== 'string') return;

    const newItems = input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    setIngredients(prev => {
      const existingLower = new Set(prev.map(i => i.toLowerCase()));
      const filteredNew = newItems.filter(item => {
        const lower = item.toLowerCase();
        if (existingLower.has(lower)) {
          return false; // skip duplicates
        }
        existingLower.add(lower);
        return true;
      });
      return [...prev, ...filteredNew];
    });
  };

  /**
   * Removes a specific ingredient from the pantry.
   * 
   * @param {string} ingredientName - Name of the ingredient to remove.
   */
  const removeIngredient = (ingredientName) => {
    if (!ingredientName) return;
    setIngredients(prev =>
      prev.filter(item => item.toLowerCase() !== ingredientName.toLowerCase())
    );
  };

  return (
    <PantryContext.Provider value={{
      ingredients,
      setIngredients,
      addIngredients,
      removeIngredient
    }}>
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};

