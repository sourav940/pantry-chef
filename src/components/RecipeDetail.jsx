import React, { useState, useEffect } from 'react';
import { usePantry } from '../context/PantryContext';
import { useFavorites } from '../context/FavoritesContext';
import { calculateRecipeMatch } from '../utils/matchAlgorithm';
import { Heart, Clock, Users, Check, X, AlertTriangle } from 'lucide-react';

/**
 * RecipeDetail Modal Component.
 * Displays details for a single recipe, detailing owned/missing ingredients
 * (color-coded in green/red), step-by-step instructions, and allowing bookmark toggles.
 * Lazy-loads instructions and detailed metadata from Spoonacular on demand if missing.
 */
export default function RecipeDetail({ recipe, isOpen, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const { ingredients } = usePantry();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!isOpen || !recipe) return;

    // If instructions and prepTime are already present (e.g. mock data or pre-loaded), skip fetch
    if (recipe.instructions && recipe.instructions.length > 0 && recipe.prepTime && recipe.prepTime !== "30 mins") {
      setDetail(recipe);
      return;
    }

    const loadDetail = async () => {
      const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.trim() === "") {
        setDetail(recipe);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`);
        if (!response.ok) throw new Error("Failed to load details");
        const data = await response.json();
        
        const steps = data.analyzedInstructions?.[0]?.steps || [];
        const instructions = steps.length > 0 
          ? steps.map(s => s.step) 
          : (data.instructions ? [data.instructions] : ["Enjoy this delicious recipe!"]);

        let difficulty = "Medium";
        if (data.readyInMinutes < 20) difficulty = "Easy";
        else if (data.readyInMinutes > 45) difficulty = "Hard";

        setDetail({
          ...recipe,
          prepTime: `${data.readyInMinutes || 30} mins`,
          servings: data.servings || 4,
          difficulty: difficulty,
          instructions: instructions,
          isVegetarian: !!data.vegetarian,
          isVegan: !!data.vegan,
          isGlutenFree: !!data.glutenFree
        });
      } catch (err) {
        console.error("Failed to load Spoonacular recipe details", err);
        setDetail(recipe);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [isOpen, recipe]);

  if (!isOpen || !recipe) return null;

  // Use loaded detail if present, otherwise fallback to basic recipe card values
  const activeRecipe = detail || recipe;

  const { matchPercentage, matchedIngredients, missingIngredients } = 
    calculateRecipeMatch(ingredients, activeRecipe.ingredients);

  const favorited = isFavorite(activeRecipe.id);

  // Determine badge colors based on match percentage
  let badgeColor = 'bg-[#FF4444] text-white';
  if (matchPercentage >= 70) {
    badgeColor = 'bg-gradient-to-r from-[#FF6B00] to-[#FFB300] text-white';
  } else if (matchPercentage >= 40) {
    badgeColor = 'bg-[#FFB300] text-zinc-950';
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-xl transition-opacity animate-fade-in">
        <div className="bg-card-dark border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-primary font-bold text-sm">Consulting the Chef...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/85 backdrop-blur-xl transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-card-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col transform transition-transform animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header/Image */}
        <div className="relative h-64 sm:h-72 w-full bg-zinc-950">
          <img
            src={activeRecipe.image}
            alt={activeRecipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-card-dark/40 to-transparent"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/85 border border-white/10 text-white cursor-pointer transition-colors"
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-5 left-6 right-6">
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-black mb-2.5 ${badgeColor}`}>
              {matchPercentage}% Match
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-white leading-tight">
              {activeRecipe.name}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Meta stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-950/40 border border-white/5 rounded-2xl text-center">
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Prep Time</span>
              <span className="font-bold text-text-primary text-sm flex items-center justify-center gap-1.5 mt-1">
                <Clock size={14} className="text-brand-orange" />
                {activeRecipe.prepTime || "30 mins"}
              </span>
            </div>
            
            <div className="border-x border-white/5">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Servings</span>
              <span className="font-bold text-text-primary text-sm flex items-center justify-center gap-1.5 mt-1">
                <Users size={14} className="text-brand-orange" />
                {activeRecipe.servings || 4} portion{activeRecipe.servings !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Difficulty</span>
              <span className="font-bold text-text-primary text-sm mt-1 block uppercase tracking-wider text-brand-amber font-extrabold">
                {activeRecipe.difficulty || "Medium"}
              </span>
            </div>
          </div>

          {/* Full Ingredients List */}
          <div>
            <h3 className="font-serif text-base font-bold text-text-primary mb-3.5 border-b border-white/5 pb-2">
              Ingredients Needed
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeRecipe.ingredients.map(ing => {
                const hasIt = matchedIngredients.includes(ing);
                return (
                  <li
                    key={ing}
                    className={`flex items-center gap-2.5 text-sm p-2.5 rounded-xl border ${
                      hasIt 
                        ? 'bg-match-green/10 border-match-green/20 text-text-primary' 
                        : 'bg-white/[0.01] border-white/5 text-text-secondary'
                    }`}
                  >
                    <span className={`p-0.5 rounded-md ${hasIt ? 'bg-match-green text-black' : 'bg-white/10 text-text-secondary'}`}>
                      {hasIt ? (
                        <Check size={10} className="stroke-[3]" />
                      ) : (
                        <AlertTriangle size={10} className="stroke-[2.5]" />
                      )}
                    </span>
                    <span className={hasIt ? 'font-bold' : ''}>{ing}</span>
                    {hasIt && (
                      <span className="ml-auto text-[9px] font-extrabold text-match-green uppercase bg-match-green/10 border border-match-green/20 px-1.5 py-0.5 rounded">
                        Pantry
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="font-serif text-base font-bold text-text-primary mb-3.5 border-b border-white/5 pb-2">
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-4">
              {(activeRecipe.instructions || []).map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="flex-none flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-brand-orange to-brand-amber text-white text-xs font-extrabold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950/60 border-t border-white/5 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={() => toggleFavorite(activeRecipe)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              favorited
                ? 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange hover:bg-brand-orange/20'
                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            }`}
          >
            <Heart size={16} className={favorited ? 'fill-brand-orange text-brand-orange' : ''} />
            <span>{favorited ? 'Bookmarked' : 'Add to Bookmarks'}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-orange to-brand-amber hover:shadow-lg hover:shadow-brand-orange/20 text-white font-bold rounded-xl text-sm transition-all duration-300 cursor-pointer"
          >
            Got it, Chef!
          </button>
        </div>
      </div>
    </div>
  );
}
