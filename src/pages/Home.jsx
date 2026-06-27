'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePantry } from '../context/PantryContext';
import { useFilter } from '../context/FilterContext';
import { useFavorites } from '../context/FavoritesContext';
import { useMacros } from '../context/MacroContext';
import { getRecipes } from '../services/recipeApi';
import { calculateRecipeMatch } from '../utils/matchAlgorithm';
import { FloatingAsset3D } from '../components/FloatingAsset3D';
import { KineticTracks } from '../components/KineticTracks';
import FilterBar from '../components/FilterBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Heart, Scale, Award, Check } from 'lucide-react';
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Home({ activeTab = 'finder', setActiveTab }) {
  const { ingredients, addIngredients, removeIngredient } = usePantry();
  const { maxMissing, isVegetarian, isVegan, isGlutenFree, isKeto } = useFilter();
  const { favorites, toggleFavorite } = useFavorites();
  const { calorieMin, setCalorieMin, calorieMax, setCalorieMax, proteinTarget, setProteinTarget, estimateRecipeMacros } = useMacros();

  const [inputVal, setInputVal] = useState('');
  const [cardInputVal, setCardInputVal] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchPulse, setSearchPulse] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const matchesSectionRef = useRef(null);

  // 1. Fetch initial recipe sets on mount
  useEffect(() => {
    async function loadRecipes() {
      setLoadingRecipes(true);
      try {
        const data = await getRecipes(ingredients);
        setAllRecipes(data);
      } catch (err) {
        console.error("Recipe retrieval failed", err);
      } finally {
        setLoadingRecipes(false);
      }
    }
    loadRecipes();
  }, [ingredients]);

  // 2. Perform macro calculation and pantry-matching logic
  useEffect(() => {
    if (allRecipes.length === 0) return;

    const filtered = allRecipes
      .map(recipe => {
        const match = calculateRecipeMatch(ingredients, recipe.ingredients);
        const estimatedMacros = estimateRecipeMacros(recipe.ingredients);
        return {
          ...recipe,
          matchDetails: match,
          estimatedMacros
        };
      })
      .filter(recipe => {
        // Missing ingredients threshold
        if (recipe.matchDetails.missingCount > maxMissing) return false;

        // Dietary filters
        if (isVegetarian && !recipe.isVegetarian) return false;
        if (isVegan && !recipe.isVegan) return false;
        if (isGlutenFree && !recipe.isGlutenFree) return false;
        if (isKeto && !recipe.isKeto) return false;

        // Calorie matrices: verify if recipe falls in or near target range
        const calories = recipe.estimatedMacros.calories;
        if (calories > calorieMax) return false;

        return true;
      })
      .sort((a, b) => {
        // High Protein content targeting: prioritize recipes matching high protein targets first, then match percentage
        const aProteinDiff = Math.max(0, proteinTarget - a.estimatedMacros.protein);
        const bProteinDiff = Math.max(0, proteinTarget - b.estimatedMacros.protein);
        
        if (aProteinDiff !== bProteinDiff) {
          return aProteinDiff - bProteinDiff;
        }

        return b.matchDetails.matchPercentage - a.matchDetails.matchPercentage;
      });

    setMatchedRecipes(filtered);
  }, [ingredients, allRecipes, maxMissing, isVegetarian, isVegan, isGlutenFree, isKeto, calorieMin, calorieMax, proteinTarget]);

  // Search console inputs submission handler
  const handleSearchSubmit = (e, val) => {
    e.preventDefault();
    const cleanVal = val.trim();
    if (!cleanVal) return;

    addIngredients(cleanVal);
    
    // Trigger neon green bounding-box glowing scan pulses
    setSearchPulse(true);
    setTimeout(() => setSearchPulse(false), 1000);
    
    if (val === inputVal) setInputVal('');
    else setCardInputVal('');

    // Smooth scroll down to the matched recipes section
    setTimeout(() => {
      if (matchesSectionRef.current) {
        matchesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Estimate total macros in current pantry staples
  const totalPantryMacros = () => {
    let cal = 0, prot = 0, carb = 0, fat = 0;
    ingredients.forEach(ing => {
      const macroEstimate = estimateRecipeMacros([ing]);
      cal += Math.round(macroEstimate.calories / 1.5);
      prot += Math.round(macroEstimate.protein / 1.5);
      carb += Math.round(macroEstimate.carbs / 1.5);
      fat += Math.round(macroEstimate.fat / 1.5);
    });
    return { calories: cal, protein: prot, carbs: carb, fat };
  };

  const pantryStats = totalPantryMacros();

  return (
    <div className="space-y-12 pb-24 relative select-none">
      
      {/* ─── TAB VIEW RENDERING ─── */}
      
      {activeTab === 'finder' && (
        <div className="space-y-12 animate-fade-in">
          {/* HERO AREA */}
          <section className="relative py-12 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden min-h-[45vh] z-10">
            {/* Parallax Floating 3D Food/Cooking Assets */}
            <div className="absolute left-[5%] top-[10%] pointer-events-none z-10 hidden md:block">
              <FloatingAsset3D type="whisk" delay={0.2} speed={5.5} />
            </div>
            <div className="absolute right-[8%] top-[12%] pointer-events-none z-10 hidden md:block">
              <FloatingAsset3D type="oil" delay={0.6} speed={6.5} />
            </div>
            <div className="absolute left-[8%] bottom-[8%] pointer-events-none z-10 hidden md:block">
              <FloatingAsset3D type="scoop" delay={0} speed={5} />
            </div>
            <div className="absolute right-[5%] bottom-[12%] pointer-events-none z-10 hidden md:block">
              <FloatingAsset3D type="grain" delay={0.9} speed={6} />
            </div>

            {/* Hero Header Typography */}
            <div className="space-y-4 max-w-3xl mb-8 relative z-20">
              <motion.h1 
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-serif text-5xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.05]"
              >
                What's In Your Pantry?
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className="font-sans text-neutral-400 font-bold text-xs tracking-[4px] uppercase"
              >
                The Agent-Native Recipe Engine
              </motion.p>
            </div>

            {/* Central Search Call-to-Action with adjustment corners */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-xl relative z-20 px-2"
            >
              <div 
                className={cn(
                  "relative p-1 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border transition-all duration-300",
                  searchPulse 
                    ? "border-emerald-400 ring-2 ring-emerald-400/20 shadow-[0_0_25px_rgba(16,185,129,0.2)]" 
                    : "border-neutral-200"
                )}
              >
                {/* Neon-Green Vector Adjustment Anchors */}
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-[3px] border-l-[3px] border-emerald-400 pointer-events-none" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-[3px] border-r-[3px] border-emerald-400 pointer-events-none" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-[3px] border-l-[3px] border-emerald-400 pointer-events-none" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-[3px] border-r-[3px] border-emerald-400 pointer-events-none" />

                <form onSubmit={(e) => handleSearchSubmit(e, inputVal)} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type ingredients to sync (e.g., oats, soya, eggs)..."
                    className="w-full bg-transparent border-none outline-none font-sans text-xs sm:text-sm text-neutral-800 px-4 py-3 placeholder-neutral-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md shadow-neutral-900/10 shrink-0 cursor-pointer"
                  >
                    Sync
                  </button>
                </form>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-[10px] font-mono text-neutral-400">
                <span>Staples available:</span>
                {ingredients.slice(0, 4).map((ing, i) => (
                  <span key={i} className="text-brand-orange">{ing}</span>
                ))}
                {ingredients.length > 4 && <span>+{ingredients.length - 4} more</span>}
              </div>
            </motion.div>
          </section>

          {/* KINETIC 3D SLIDING TEXT TRACKS */}
          <section className="w-full relative z-10 py-2 hidden sm:block">
            <KineticTracks />
          </section>

          {/* RECIPE FINDER MATCHES - PREMIUM WIDE SECTION */}
          <section ref={matchesSectionRef} className="max-w-4xl mx-auto px-4 relative z-20">
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-[0_12px_48px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    TELEMETRY STATUS: RECIPE ENGINE OPERATIONAL
                  </span>
                  <h3 className="font-serif font-black text-2xl text-neutral-900 mt-1">Pulse Matches</h3>
                </div>
                {ingredients.length > 0 && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveTab('pantry')}
                      className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-800 hover:text-neutral-900 transition-all text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Configure Pantry
                    </button>
                    <button 
                      onClick={() => setActiveTab('macros')}
                      className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-800 hover:text-neutral-900 transition-all text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Configure Macros
                    </button>
                  </div>
                )}
              </div>

              {/* Diet / Missing Filter Section */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/40">
                <div className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-3">
                  Match Fine-Tuning
                </div>
                <FilterBar />
              </div>

              {/* Matches list */}
              <div className="space-y-3">
                {loadingRecipes ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                    <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-semibold">Consulting the Chef...</p>
                  </div>
                ) : matchedRecipes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                    <Scale className="w-10 h-10 stroke-[1.5] text-neutral-300 mb-2 animate-bounce" />
                    <p className="text-sm font-semibold">No recipes matching parameters.</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adding more pantry staples or adjusting the missing ingredients filter above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchedRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/30 hover:bg-neutral-50 hover:border-neutral-200 transition-all duration-200 cursor-pointer group/item shadow-sm hover:shadow-md"
                      >
                        <img 
                          src={recipe.image} 
                          alt={recipe.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-neutral-200/50 shrink-0" 
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-neutral-900 truncate group-hover/item:text-brand-orange transition-colors">
                            {recipe.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-400">
                            <span>{recipe.estimatedMacros.calories} kcal</span>
                            <span>•</span>
                            <span className="text-brand-orange font-bold">{recipe.estimatedMacros.protein}g protein</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 px-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 font-mono text-[9px] font-black">
                            {recipe.matchDetails.matchPercentage}%
                          </span>
                          <span className="text-[8px] font-mono text-neutral-400">
                            {recipe.matchDetails.missingCount} missing
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 font-mono text-[9px] text-neutral-400">
                <span>MATCHES_RESOLVED: {matchedRecipes.length} recipes</span>
                <span className="text-neutral-500">Click recipe for instructions</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'pantry' && (
        <div className="max-w-2xl mx-auto px-4 animate-fade-in pt-8">
          {/* CARD 1: INVENTORY MANAGER */}
          <div className="w-full rounded-3xl bg-white border border-neutral-200/60 p-8 shadow-[0_12px_48px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group min-h-[520px]">
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
                <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  TELEMETRY STATUS: CALIBRATING INVENTORY...
                </span>
                <h3 className="font-serif font-black text-2xl text-neutral-900 mt-1">Staples Inventory</h3>
              </div>

              {/* Bulk Addition input inside card */}
              <form onSubmit={(e) => handleSearchSubmit(e, cardInputVal)} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cardInputVal}
                  onChange={(e) => setCardInputVal(e.target.value)}
                  placeholder="Add staples (comma-separate for bulk)..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-orange/40 focus:ring-1 focus:ring-brand-orange/20 transition-all"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer">
                  <Plus size={16} />
                </button>
              </form>

              {/* Active staples list */}
              <div className="h-[280px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                <AnimatePresence>
                  {ingredients.length === 0 ? (
                    <div className="text-center py-12 text-xs text-neutral-400 font-semibold">
                      Your pantry is empty. Add ingredients above to find matching recipes!
                    </div>
                  ) : (
                    ingredients.map((ing) => (
                      <motion.div
                        key={ing}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/40 text-xs font-semibold text-neutral-800 group/item hover:bg-neutral-100/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                          {ing}
                        </span>
                        <button
                          onClick={() => removeIngredient(ing)}
                          className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Inventory summary stats */}
            <div className="flex justify-between items-center border-t border-neutral-100 pt-4 font-mono text-[9px] text-neutral-400 mt-6">
              <span>INGREDIENT_COUNT: {ingredients.length} items</span>
              <span>EST_CALORIES: {pantryStats.calories} kcal</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'macros' && (
        <div className="max-w-2xl mx-auto px-4 animate-fade-in pt-8">
          {/* CARD 2: MACRO & CALORIE MATRIX */}
          <div className="w-full rounded-3xl bg-white border border-neutral-200/60 p-8 shadow-[0_12px_48px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden min-h-[520px]">
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
                <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  TELEMETRY STATUS: CALIBRATING NUTRITION TARGETS...
                </span>
                <h3 className="font-serif font-black text-2xl text-neutral-900 mt-1">Nutrition Matrix</h3>
              </div>

              {/* Calorie Targets planning slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">Calorie Threshold</span>
                  <span className="text-brand-orange font-bold font-mono">{calorieMax} kcal</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="3500"
                  step="50"
                  value={calorieMax}
                  onChange={(e) => setCalorieMax(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-100 rounded-full appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                  <span>Min: 1200 kcal</span>
                  <span>Max: 3500 kcal</span>
                </div>
              </div>

              {/* Protein Target planning slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">Protein Target</span>
                  <span className="text-brand-orange font-bold font-mono">{proteinTarget}g</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="5"
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-100 rounded-full appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                  <span>Min: 60g</span>
                  <span>Max: 220g</span>
                </div>
              </div>

              {/* Estimated Macro distribution summary */}
              <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold block mb-1">
                  Staples Macro Estimation
                </span>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-mono text-[10px] mb-1">
                      <span>PROTEIN</span>
                      <span className="font-bold text-neutral-800">{pantryStats.protein}g / {proteinTarget}g</span>
                    </div>
                    <div className="w-full bg-neutral-200/60 rounded-full h-1">
                      <div 
                        className="bg-brand-orange h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (pantryStats.protein / proteinTarget) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between font-mono text-[10px] mb-1">
                      <span>CARBS</span>
                      <span className="font-bold text-neutral-800">{pantryStats.carbs}g</span>
                    </div>
                    <div className="w-full bg-neutral-200/60 rounded-full h-1">
                      <div className="bg-neutral-800 h-1 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-100 pt-4 font-mono text-[9px] text-neutral-400 mt-6">
              <span>MACRO_ENGINE: ENERGETIC</span>
              <span>YIELD: HIGH-PROTEIN</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── RECIPE DETAILS DRAWER OVERLAY ─── */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-end"
            onClick={() => setSelectedRecipe(null)}
          >
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="w-full max-w-lg h-full bg-white shadow-2xl p-8 flex flex-col justify-between overflow-y-auto relative border-l border-neutral-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="space-y-6">
                {/* Header controls */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] font-black text-brand-orange uppercase tracking-widest flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-brand-orange" />
                      PULSE RECIPE DOSSIER
                    </span>
                    <h2 className="font-serif font-black text-2xl sm:text-3xl text-neutral-900 mt-1">
                      {selectedRecipe.name}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors border border-neutral-200/50 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name} 
                  className="w-full h-48 object-cover rounded-2xl border border-neutral-200/40 shadow-inner" 
                />

                {/* Macro metrics summary */}
                <div className="grid grid-cols-4 gap-2 text-center p-3 bg-neutral-50 rounded-2xl border border-neutral-100 font-mono text-[10px]">
                  <div className="flex flex-col border-r border-neutral-200/50">
                    <span className="text-neutral-400 uppercase text-[8px]">CALORIES</span>
                    <span className="text-neutral-900 font-bold text-xs mt-0.5">{selectedRecipe.estimatedMacros.calories}</span>
                  </div>
                  <div className="flex flex-col border-r border-neutral-200/50">
                    <span className="text-brand-orange font-bold text-xs mt-0.5">{selectedRecipe.estimatedMacros.protein}g</span>
                  </div>
                  <div className="flex flex-col border-r border-neutral-200/50">
                    <span className="text-neutral-400 uppercase text-[8px]">CARBS</span>
                    <span className="text-neutral-900 font-bold text-xs mt-0.5">{selectedRecipe.estimatedMacros.carbs}g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-400 uppercase text-[8px]">FAT</span>
                    <span className="text-neutral-900 font-bold text-xs mt-0.5">{selectedRecipe.estimatedMacros.fat}g</span>
                  </div>
                </div>

                {/* Match details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                    Ingredient Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const hasIngredient = ingredients.some(
                        i => i.toLowerCase() === ing.toLowerCase() || ing.toLowerCase().includes(i.toLowerCase())
                      );
                      return (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex items-center justify-between text-xs px-3 py-2 rounded-xl border",
                            hasIngredient 
                              ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
                              : "bg-red-50/30 border-red-100 text-neutral-400 line-through decoration-red-300"
                          )}
                        >
                          <span className="font-semibold">{ing}</span>
                          {hasIngredient ? (
                            <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-bold">
                              <Check size={10} strokeWidth={3} /> IN STOCK
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-neutral-400 font-bold">MISSING</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                    Instructions
                  </h4>
                  <ol className="space-y-3 font-sans text-xs text-neutral-600 font-light leading-relaxed decimal list-inside">
                    {selectedRecipe.instructions && selectedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        <span className="text-neutral-800 font-semibold pr-1.5">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Bookmark favorites button */}
              <div className="border-t border-neutral-100 pt-4 mt-6 flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedRecipe)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer",
                    favorites.some(f => f.id === selectedRecipe.id)
                      ? "bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/15"
                      : "bg-white text-neutral-900 border-neutral-200/80 hover:bg-neutral-50"
                  )}
                >
                  <Heart size={14} className={favorites.some(f => f.id === selectedRecipe.id) ? "fill-white" : ""} />
                  {favorites.some(f => f.id === selectedRecipe.id) ? 'Recipe Bookmarked' : 'Add to Bookmarks'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
