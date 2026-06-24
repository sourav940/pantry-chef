import React from 'react';
import { Link } from 'react-router-dom';
import { usePantry } from '../context/PantryContext';
import { useFilter } from '../context/FilterContext';
import RecipeCard from './RecipeCard';
import { ChefHat, PlusCircle, BookOpen } from 'lucide-react';

/**
 * Grid component that displays matched recipe cards.
 * Displays skeletons when loading, and different empty states based on ingredients/matches.
 * 
 * @param {object} props
 * @param {object[]} props.recipes - List of matched recipes to display.
 * @param {boolean} props.isLoading - Whether the recipe database is loading.
 */
export default function RecipeGrid({ recipes, isLoading, isFavoritesPage = false }) {
  const { ingredients } = usePantry();
  const { maxMissing } = useFilter();

  // Skeleton Card Loader Component matching the design exactly
  const SkeletonCard = () => (
    <div className="bg-card-dark border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[490px] relative shadow-xl shadow-black/40">
      {/* Image Block Skeleton */}
      <div className="h-[250px] w-full bg-white/[0.02] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent bg-[length:200%_100%] animate-shimmer" 
        />
      </div>
      {/* Info Block Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Metadata lines */}
          <div className="flex gap-3">
            <div className="h-3 w-12 bg-white/[0.04] rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent bg-[length:200%_100%] animate-shimmer" />
            </div>
            <div className="h-3 w-16 bg-white/[0.04] rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent bg-[length:200%_100%] animate-shimmer" />
            </div>
            <div className="h-3.5 w-10 bg-white/[0.04] rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent bg-[length:200%_100%] animate-shimmer" />
            </div>
          </div>
          {/* Title */}
          <div className="h-5 w-2/3 bg-white/[0.04] rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
          {/* Ingredients list wrapper */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <div className="h-2.5 w-1/3 bg-white/[0.04] rounded-sm relative overflow-hidden" />
              <div className="flex gap-1.5">
                <div className="h-5 w-12 bg-white/[0.04] rounded-md" />
                <div className="h-5 w-16 bg-white/[0.04] rounded-md" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-1/3 bg-white/[0.04] rounded-sm relative overflow-hidden" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 bg-white/[0.04] rounded-md" />
                <div className="h-5 w-10 bg-white/[0.04] rounded-md" />
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="h-9 w-full bg-white/[0.04] rounded-xl" />
      </div>
    </div>
  );

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  // 2. Empty State: No Ingredients in Pantry
  if (!isFavoritesPage && ingredients.length === 0) {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center">
        <div className="relative w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center border border-brand-orange/20 mb-6">
          <ChefHat size={48} className="text-brand-orange animate-chef-shimmer" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2 font-serif">
          Your Pantry is Empty!
        </h3>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          Type or paste the ingredients you have in your kitchen in the box above (like "milk, eggs, flour") to see what delicious recipes you can cook!
        </p>
        <div className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-brand-orange/5">
          <PlusCircle size={14} className="stroke-[2.5]" />
          Start by adding some basics
        </div>
      </div>
    );
  }

  // 3. Empty State: Ingredients exist, but zero matching recipes found
  if (recipes.length === 0) {
    if (isFavoritesPage) {
      return (
        <div className="text-center py-20 max-w-md mx-auto flex flex-col items-center animate-fade-up">
          <div className="w-24 h-24 bg-match-red/10 rounded-full flex items-center justify-center border border-match-red/20 mb-6 shadow-lg shadow-match-red/5">
            <svg 
              className="w-12 h-12 text-match-red animate-heartbeat" 
              viewBox="0 0 24 24" 
              fill="rgba(255,68,68,0.15)" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-text-primary mb-2 font-serif">
            No Bookmarked Recipes
          </h3>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            You haven't bookmarked any recipes yet. Explore the dashboard, match ingredients, and tap the heart icon on any recipe to save it here!
          </p>

          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-amber hover:shadow-lg hover:shadow-brand-orange/20 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Browse Recipes</span>
          </Link>
        </div>
      );
    }

    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center animate-fade-up">
        {/* Animated Cloche Pot confusion loop SVG */}
        <div className="w-28 h-28 flex items-center justify-center mb-6">
          <svg 
            className="w-full h-full text-brand-orange" 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Cloche Base */}
            <path d="M15,75 L85,75 C85,75 80,85 50,85 C20,85 15,75 15,75 Z" fill="rgba(255,107,0,0.1)" stroke="#FF6B00" strokeWidth="2.5" />
            {/* Cloche cover lifting */}
            <path 
              d="M25,70 C25,40 75,40 75,70 Z" 
              fill="rgba(255,179,0,0.05)" 
              stroke="#FFB300" 
              strokeWidth="2.5" 
              className="animate-bounce" 
              style={{ animationDuration: '3s' }} 
            />
            {/* Cloche handle */}
            <circle 
              cx="50" 
              cy="35" 
              r="4" 
              fill="#FFB300" 
              stroke="#FF6B00" 
              strokeWidth="2" 
              className="animate-bounce" 
              style={{ animationDuration: '3s' }} 
            />
            {/* Floating question mark or sparkles */}
            <circle cx="50" cy="55" r="2" fill="#FFB300" className="animate-ping" style={{ animationDuration: '2s' }} />
            <path d="M22,32 L26,36 M26,32 L22,36" stroke="#FF6B00" strokeWidth="1.5" className="animate-pulse" />
            <path d="M78,32 L82,36 M82,32 L78,36" stroke="#FFB300" strokeWidth="1.5" className="animate-pulse" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-text-primary mb-2 font-serif">
          No Recipe Matches Found
        </h3>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          We couldn't find any recipes in our database where you have enough ingredients. 
          Currently, you allow up to <span className="font-semibold text-brand-orange">{maxMissing} missing</span> {maxMissing === 1 ? 'ingredient' : 'ingredients'}.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center">
          <div className="text-xs p-3.5 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-text-secondary flex-1 leading-relaxed">
            💡 Try <span className="font-bold text-text-primary">increasing the filter slider</span> to see recipes with more missing ingredients.
          </div>
          <div className="text-xs p-3.5 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-text-secondary flex-1 leading-relaxed">
            🥕 Try <span className="font-bold text-text-primary">adding common items</span> like garlic, onion, butter, or olive oil!
          </div>
        </div>
      </div>
    );
  }

  // 4. Default: Render matched recipes with staggered delays
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, idx) => (
        <div 
          key={recipe.id} 
          className="opacity-0 animate-fade-up" 
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
}

