import React from 'react';
import { useFilter } from '../context/FilterContext';
import { Sliders } from 'lucide-react';

/**
 * FilterBar Component.
 * Integrates directly with FilterContext to provide dietary tags toggles 
 * and a range slider for max missing ingredients.
 */
export default function FilterBar() {
  const {
    maxMissing,
    setMaxMissing,
    isVegetarian,
    setIsVegetarian,
    isVegan,
    setIsVegan,
    isGlutenFree,
    setIsGlutenFree,
    isKeto,
    setIsKeto
  } = useFilter();

  return (
    <div className="max-w-2xl mx-auto bg-card-dark rounded-3xl p-6 border border-white/5 shadow-2xl space-y-6">
      {/* Missing Ingredients Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
          <span className="flex items-center gap-2">
            <Sliders size={16} className="text-brand-orange" />
            Max Missing Ingredients
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold">
            {maxMissing === 5 ? '5+ items' : `${maxMissing} ${maxMissing === 1 ? 'item' : 'items'}`}
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max="5"
          value={maxMissing > 5 ? 5 : maxMissing}
          onChange={(e) => setMaxMissing(Number(e.target.value))}
          className="w-full h-2 bg-zinc-950 border border-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
          <span>0 (Exact match)</span>
          <span>2 items</span>
          <span>4 items</span>
          <span>5+ (Loose match)</span>
        </div>
      </div>

      {/* Dietary Preferences Toggles */}
      <div className="pt-4 border-t border-white/5">
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
          Dietary Preferences
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setIsVegetarian(!isVegetarian)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
              isVegetarian
                ? 'bg-match-green/10 border-match-green/30 text-match-green shadow-[0_0_15px_rgba(0,230,118,0.1)]'
                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:bg-white/[0.05] hover:border-white/10 hover:text-text-primary'
            }`}
          >
            <span>🌱</span>
            <span>Vegetarian</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsVegan(!isVegan)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
              isVegan
                ? 'bg-match-green/10 border-match-green/30 text-match-green shadow-[0_0_15px_rgba(0,230,118,0.1)]'
                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:bg-white/[0.05] hover:border-white/10 hover:text-text-primary'
            }`}
          >
            <span>🌿</span>
            <span>Vegan</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsGlutenFree(!isGlutenFree)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
              isGlutenFree
                ? 'bg-brand-amber/10 border-brand-amber/30 text-brand-amber shadow-[0_0_15px_rgba(255,179,0,0.15)]'
                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:bg-white/[0.05] hover:border-white/10 hover:text-text-primary'
            }`}
          >
            <span>🌾</span>
            <span>Gluten-Free</span>
          </button>

          <button
            type="button"
            onClick={() => setIsKeto(!isKeto)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
              isKeto
                ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.15)]'
                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:bg-white/[0.05] hover:border-white/10 hover:text-text-primary'
            }`}
          >
            <span>🥑</span>
            <span>Keto</span>
          </button>
        </div>
      </div>
    </div>
  );
}

