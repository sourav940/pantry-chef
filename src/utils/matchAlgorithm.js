/**
 * Normalizes ingredient text strings by stripping out common unit descriptions,
 * measurements, quantities, brackets, plurals, and extra whitespace.
 */
export function normalizeIngredient(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\b\d+(\/\d+)?\s*(cups?|oz|g|lbs?|tbsp|tsp|can|pkg|pieces?|cloves?|slices?|handful)\b/g, "")
    .replace(/[\d\(\)]/g, "") // Strip raw integers and brackets
    .replace(/s\b/g, "")      // Basic singular normalization
    .trim();
}

/**
 * Computes the exact matching parameters for a given target recipe 
 * against the user's active pantry ingredients list.
 */
export function calculateMatch(userIngredients, recipeIngredients) {
  const pantry = userIngredients.map(i => normalizeIngredient(i)).filter(Boolean);
  const matched = [];
  const missing = [];

  recipeIngredients.forEach(ingredient => {
    const normalized = normalizeIngredient(ingredient);
    
    // Evaluate if any pantry keyword matches the target recipe ingredient
    const isMatched = pantry.some(p => normalized.includes(p) || p.includes(normalized));

    if (isMatched) {
      matched.push(ingredient);
    } else {
      missing.push(ingredient);
    }
  });

  const total = recipeIngredients.length;
  const matchPercent = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return {
    matched,
    missing,
    matchPercent,
    matchedCount: matched.length,
    missingCount: missing.length,
    totalIngredients: total
  };
}

/**
 * Sorts an array of recipe items by prioritizing highest matching coverage,
 * then minimizing total missing ingredients, and falling back alphabetically.
 */
export function sortRecipes(recipes) {
  return [...recipes].sort((a, b) => {
    if (b.matchPercent !== a.matchPercent) {
      return b.matchPercent - a.matchPercent; // Highest match % first
    }
    if (a.missingCount !== b.missingCount) {
      return a.missingCount - b.missingCount; // Fewest missing first
    }
    return a.name.localeCompare(b.name);      // Alphabetical sorting
  });
}

/**
 * Backward compatibility wrapper mapping the new calculateMatch return parameters
 * to the original calculateRecipeMatch schema.
 */
export function calculateRecipeMatch(userIngredients, recipeIngredients) {
  const result = calculateMatch(userIngredients, recipeIngredients);
  return {
    matchPercentage: result.matchPercent,
    matchedIngredients: result.matched,
    missingIngredients: result.missing,
    missingCount: result.missingCount
  };
}
