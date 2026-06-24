import React, { useState } from 'react';
import { usePantry } from '../context/PantryContext';
import { useFavorites } from '../context/FavoritesContext';
import IngredientTag from './IngredientTag';
import Autocomplete, { COMMON_INGREDIENTS } from './Autocomplete';
import { Plus, Sparkles, AlertCircle, History } from 'lucide-react';

/**
 * Component for adding ingredients to the pantry.
 * Supports autocomplete, comma-separated entries, displays the count, and lists current tags.
 */
export default function IngredientInput() {
  const { ingredients, addIngredients, removeIngredient, setIngredients } = usePantry();
  const { searchHistory, clearHistory } = useFavorites();
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Compute autocomplete matches
  const matches = COMMON_INGREDIENTS.filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase().trim())
  ).slice(0, 5);

  const handleLoadHistory = (historyItem) => {
    if (!historyItem) return;
    const items = historyItem
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    setIngredients(items);
  };

  const handleSelectAutocomplete = (ingredientName) => {
    const normalized = ingredientName.trim().toLowerCase();
    const existingSet = new Set(ingredients.map(item => item.toLowerCase()));

    if (existingSet.has(normalized)) {
      setErrorMsg(`${ingredientName} is already in your pantry!`);
      setTimeout(() => setErrorMsg(''), 3000);
    } else {
      addIngredients(ingredientName);
      setErrorMsg('');
    }
    setInputValue('');
    setShowAutocomplete(false);
    setActiveIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Check if we are selecting from active autocomplete
    if (showAutocomplete && activeIndex >= 0 && activeIndex < matches.length) {
      handleSelectAutocomplete(matches[activeIndex]);
      return;
    }

    const splitInput = trimmed.split(',').map(item => item.trim().toLowerCase());
    const existingSet = new Set(ingredients.map(item => item.toLowerCase()));
    const allExist = splitInput.every(item => existingSet.has(item));

    if (allExist) {
      setErrorMsg('All entered ingredients are already in your pantry!');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    addIngredients(inputValue);
    setInputValue('');
    setErrorMsg('');
    setShowAutocomplete(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showAutocomplete || matches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + matches.length) % matches.length);
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = () => {
    // Timeout allowed so option selection click triggers first
    setTimeout(() => {
      setShowAutocomplete(false);
      setActiveIndex(-1);
    }, 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card-dark rounded-3xl p-6 border border-white/5 shadow-2xl relative">
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="ingredient-input" className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span>What's in your pantry?</span>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-extrabold leading-none text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full">
            {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
          </span>
        </label>
        
        <span className="text-xs text-text-secondary flex items-center gap-1">
          <Sparkles size={12} className="text-brand-amber animate-pulse" />
          Bulk paste with commas
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="ingredient-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowAutocomplete(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={handleBlur}
            placeholder="e.g. Tomatoes, Garlic, Onion, Chicken Breast"
            autoComplete="off"
            className="w-full px-4 py-3 bg-zinc-950/40 border border-white/10 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/60 shadow-[inset_0_0_8px_rgba(255,107,0,0.05)] focus:shadow-[inset_0_0_12px_rgba(255,107,0,0.15)] text-text-primary transition-all duration-300 placeholder:text-text-secondary text-sm"
          />
          {showAutocomplete && (
            <Autocomplete
              query={inputValue}
              activeIndex={activeIndex}
              onSelect={handleSelectAutocomplete}
            />
          )}
        </div>
        
        <button
          type="submit"
          className="px-5 py-3 bg-gradient-to-r from-brand-orange to-brand-amber hover:shadow-lg hover:shadow-brand-orange/20 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all duration-300 focus:ring-2 focus:ring-brand-orange/30 focus:outline-hidden cursor-pointer"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </form>

      {errorMsg && (
        <div className="mt-2 text-xs text-match-red flex items-center gap-1.5 animate-pulse">
          <AlertCircle size={12} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recent Searches Section */}
      {searchHistory && searchHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <History size={12} />
              Recent Searches
            </span>
            <button
              type="button"
              onClick={clearHistory}
              className="text-[10px] text-text-secondary hover:text-match-red hover:underline font-semibold cursor-pointer transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyItem, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadHistory(historyItem)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-brand-orange/15 hover:text-white border border-white/5 hover:border-brand-orange/20 text-text-secondary font-medium transition-all duration-200 cursor-pointer text-left line-clamp-1 max-w-[220px]"
                title={`Load search: ${historyItem}`}
              >
                {historyItem}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2.5 text-xs text-text-secondary">
        Type ingredients individually or separated by commas to add them in bulk.
      </p>

      {ingredients.length > 0 ? (
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex flex-wrap gap-2.5">
            {ingredients.map((ingredient) => (
              <IngredientTag
                key={ingredient}
                name={ingredient}
                onRemove={removeIngredient}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-5 border-t border-white/5 text-center py-2 text-sm text-text-secondary italic">
          Your pantry is empty. Add some ingredients above to start matching!
        </div>
      )}
    </div>
  );
}

