import React, { useState, useEffect } from 'react';
import { usePantry } from '../context/PantryContext';
import { useFilter } from '../context/FilterContext';
import { useFavorites } from '../context/FavoritesContext';
import { getRecipes } from '../services/recipeApi';
import { calculateRecipeMatch } from '../utils/matchAlgorithm';
import IngredientInput from '../components/IngredientInput';
import FilterBar from '../components/FilterBar';
import RecipeGrid from '../components/RecipeGrid';
import { Flame, RefreshCw } from 'lucide-react';

/**
 * Floating particle background generator for a high-end dynamic feel.
 */
function FloatingParticles() {
  const particles = [
    { emoji: '🥑', left: '8%', delay: '0s', duration: '14s' },
    { emoji: '🍋', left: '20%', delay: '3s', duration: '18s' },
    { emoji: '🧅', left: '38%', delay: '1s', duration: '16s' },
    { emoji: '🍅', left: '52%', delay: '7s', duration: '20s' },
    { emoji: '🥕', left: '68%', delay: '5s', duration: '15s' },
    { emoji: '🌶️', left: '84%', delay: '9s', duration: '17s' },
    { emoji: '🌿', left: '93%', delay: '2s', duration: '19s' }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="absolute bottom-[-50px] text-lg select-none opacity-25 animate-drift"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

/**
 * Home dashboard page.
 * Manages fetching recipe lists, applying ingredient filters, and triggering matching simulations.
 */
export default function Home() {
  const { ingredients } = usePantry();
  const { maxMissing, isVegetarian, isVegan, isGlutenFree, isKeto } = useFilter();
  const { addToHistory } = useFavorites();
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClickAnimating, setIsClickAnimating] = useState(false);

  // Fetch initial recipe set on mount
  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true);
      try {
        const data = await getRecipes(ingredients);
        setAllRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes", err);
      } finally {
        setIsLoading(false);
      }
    };
    initFetch();
  }, []);

  // Filter and sort recipes whenever ingredients, filters, or allRecipes changes
  useEffect(() => {
    if (allRecipes.length === 0) return;

    // Calculate match metrics for each recipe, filter by maxMissing and dietary preferences, and sort by highest percentage match
    const processed = allRecipes
      .map(recipe => {
        const match = calculateRecipeMatch(ingredients, recipe.ingredients);
        return { ...recipe, matchDetails: match };
      })
      .filter(recipe => {
        // Missing ingredients limit
        if (recipe.matchDetails.missingCount > maxMissing) return false;

        // Dietary filters
        if (isVegetarian && !recipe.isVegetarian) return false;
        if (isVegan && !recipe.isVegan) return false;
        if (isGlutenFree && !recipe.isGlutenFree) return false;
        if (isKeto && !recipe.isKeto) return false;

        return true;
      })
      .sort((a, b) => b.matchDetails.matchPercentage - a.matchDetails.matchPercentage);

    setFilteredRecipes(processed);
  }, [ingredients, maxMissing, isVegetarian, isVegan, isGlutenFree, isKeto, allRecipes]);

  // Simulate full pantry scan/fetch when clicking "Find Recipes"
  const handleFindRecipes = async () => {
    if (ingredients.length === 0) return;
    setIsLoading(true);
    try {
      const data = await getRecipes(ingredients);
      setAllRecipes(data);
      // Record search query in context history
      addToHistory(ingredients.join(', '));
    } catch (err) {
      console.error(err);
    } finally {
      // Small simulated extra delay for premium feel (chef thinking)
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleButtonClick = () => {
    setIsClickAnimating(true);
    setTimeout(() => setIsClickAnimating(false), 600);
    handleFindRecipes();
  };

  return (
    <div className="space-y-10 pb-16 relative">
      {/* Background drifting particles */}
      <FloatingParticles />

      {/* Hero Banner Section with warm gradients */}
      <div className="relative text-center space-y-4 py-12 overflow-hidden bg-card-dark rounded-3xl border border-white/5 shadow-2xl max-w-4xl mx-auto z-10">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-2 left-6 w-24 h-24 rounded-full bg-brand-orange/10 blur-2xl animate-float-slow pointer-events-none"></div>
        <div className="absolute bottom-4 right-10 w-32 h-32 rounded-full bg-brand-amber/10 blur-3xl pointer-events-none"></div>

        <h1 className="relative font-serif text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight bg-gradient-to-r from-brand-orange via-brand-amber to-match-green bg-clip-text text-transparent px-4">
          What's for Dinner Tonight?
        </h1>
        
        <p className="relative text-text-secondary max-w-xl mx-auto text-sm sm:text-base leading-relaxed px-6">
          Input your available ingredients, set your preference, and let Pantry-Chef instantly find matching recipes. Reduce grocery trips and enjoy delicious meals!
        </p>
      </div>

      {/* Ingredient Inputs Section */}
      <div className="space-y-6 relative z-10">
        <IngredientInput />
      </div>

      {/* Filter and Control Bar */}
      <div className="relative z-10">
        <FilterBar />
      </div>

      {/* Find Recipes Action Trigger */}
      <div className="flex justify-center relative z-10">
        <button
          onClick={handleButtonClick}
          disabled={isLoading || ingredients.length === 0}
          className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
            ingredients.length === 0
              ? 'bg-zinc-950 border border-white/5 text-text-secondary cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-brand-orange to-brand-amber text-white shadow-xl shadow-brand-orange/20 animate-pulse-glow hover:shadow-brand-orange/45 hover:scale-105'
          } ${isClickAnimating ? 'scale-90 duration-75' : ''}`}
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Scanning Pantry...</span>
            </>
          ) : (
            <>
              <Flame size={16} className={`fill-current ${isClickAnimating ? 'text-match-red animate-ping' : 'text-brand-amber animate-pulse'}`} />
              <span>Find Recipes</span>
            </>
          )}
        </button>
      </div>

      {/* Recipes Header & Grid Results */}
      <div className="space-y-6 pt-4 relative z-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
            <span>Recipe Matches</span>
            {ingredients.length > 0 && !isLoading && (
              <span className="text-xs font-normal text-text-secondary">
                Found {filteredRecipes.length} suggestion{filteredRecipes.length === 1 ? '' : 's'}
              </span>
            )}
          </h2>
          
          {ingredients.length > 0 && (
            <span className="text-xs text-text-secondary">
              Sorted by highest match %
            </span>
          )}
        </div>

        <RecipeGrid recipes={filteredRecipes} isLoading={isLoading} />
      </div>
    </div>
  );
}

