import React, { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  // Initialize dietary preferences from localStorage
  const [isVegetarian, setIsVegetarian] = useState(() => {
    try {
      const saved = localStorage.getItem('filter_vegetarian');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const [isVegan, setIsVegan] = useState(() => {
    try {
      const saved = localStorage.getItem('filter_vegan');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const [isGlutenFree, setIsGlutenFree] = useState(() => {
    try {
      const saved = localStorage.getItem('filter_gluten_free');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const [isKeto, setIsKeto] = useState(() => {
    try {
      const saved = localStorage.getItem('filter_keto');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // Initialize max missing ingredients from localStorage
  const [maxMissing, setMaxMissing] = useState(() => {
    try {
      const saved = localStorage.getItem('pantry_max_missing');
      return saved ? parseInt(saved, 10) : 3;
    } catch (e) {
      return 3;
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('filter_vegetarian', JSON.stringify(isVegetarian));
  }, [isVegetarian]);

  useEffect(() => {
    localStorage.setItem('filter_vegan', JSON.stringify(isVegan));
  }, [isVegan]);

  useEffect(() => {
    localStorage.setItem('filter_gluten_free', JSON.stringify(isGlutenFree));
  }, [isGlutenFree]);

  useEffect(() => {
    localStorage.setItem('filter_keto', JSON.stringify(isKeto));
  }, [isKeto]);

  useEffect(() => {
    localStorage.setItem('pantry_max_missing', maxMissing.toString());
  }, [maxMissing]);

  return (
    <FilterContext.Provider value={{
      isVegetarian,
      setIsVegetarian,
      isVegan,
      setIsVegan,
      isGlutenFree,
      setIsGlutenFree,
      isKeto,
      setIsKeto,
      maxMissing,
      setMaxMissing
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
