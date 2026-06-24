import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import RecipeGrid from '../components/RecipeGrid';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

/**
 * Favorites page displaying bookmarked recipes.
 * Loads recipes from the global state, synced to localStorage.
 */
export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-black text-text-primary flex items-center gap-2">
              <Heart className="fill-brand-orange stroke-brand-orange" size={28} />
              <span>Bookmarked Recipes</span>
            </h1>
            <p className="text-sm text-text-secondary">
              Your personal collection of saved recipes for quick cooking reference.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-amber transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Bookmarked Grid List or Empty State via RecipeGrid */}
      <RecipeGrid recipes={favorites} isLoading={false} isFavoritesPage={true} />
    </div>
  );
}


