import React, { createContext, useContext, useState } from 'react';

const MacroContext = createContext();

export const MacroProvider = ({ children }) => {
  // Calorie planning target (e.g., 2000 to 2400 kcal planning threshold)
  const [calorieMin, setCalorieMin] = useState(2000);
  const [calorieMax, setCalorieMax] = useState(2400);
  
  // High-protein targeting threshold (in grams, e.g. 100g to 180g)
  const [proteinTarget, setProteinTarget] = useState(120);

  // Available staples base mock macro metrics per 100g for telemetry simulation
  const stapleMacros = {
    'Oats': { calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
    'Rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    'Soya Chunks': { calories: 345, protein: 52.0, carbs: 33, fat: 0.5 },
    'Greek Yogurt': { calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
    'Whey': { calories: 400, protein: 80.0, carbs: 6, fat: 3 },
    'Eggs': { calories: 155, protein: 13.0, carbs: 1.1, fat: 11 },
    'Lentils': { calories: 116, protein: 9.0, carbs: 20, fat: 0.4 },
    'Tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    'Garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
    'Olive Oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
    'Pasta': { calories: 131, protein: 5.0, carbs: 25, fat: 1.1 },
    'Chicken Breast': { calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
    'Avocado': { calories: 160, protein: 2.0, carbs: 9, fat: 15 },
    'Milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
    'Tofu': { calories: 76, protein: 8.0, carbs: 1.9, fat: 4.8 },
    'Cheese': { calories: 402, protein: 25.0, carbs: 1.3, fat: 33 },
    'Bread': { calories: 265, protein: 9.0, carbs: 49, fat: 3.2 }
  };

  /**
   * Helper to estimate a recipe's macros based on ingredients list
   */
  const estimateRecipeMacros = (ingredients) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    ingredients.forEach(ing => {
      // Find matching macro staple case-insensitively
      const key = Object.keys(stapleMacros).find(k => k.toLowerCase() === ing.toLowerCase());
      if (key) {
        const macros = stapleMacros[key];
        // Assume an average portion of 150g per ingredient for visual modeling
        totalCalories += Math.round(macros.calories * 1.5);
        totalProtein += Math.round(macros.protein * 1.5);
        totalCarbs += Math.round(macros.carbs * 1.5);
        totalFat += Math.round(macros.fat * 1.5);
      } else {
        // Fallback generic values
        totalCalories += 120;
        totalProtein += 3;
        totalCarbs += 15;
        totalFat += 2;
      }
    });

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    };
  };

  return (
    <MacroContext.Provider value={{
      calorieMin,
      setCalorieMin,
      calorieMax,
      setCalorieMax,
      proteinTarget,
      setProteinTarget,
      estimateRecipeMacros,
      stapleMacros
    }}>
      {children}
    </MacroContext.Provider>
  );
};

export const useMacros = () => {
  const context = useContext(MacroContext);
  if (!context) {
    throw new Error('useMacros must be used within a MacroProvider');
  }
  return context;
};
