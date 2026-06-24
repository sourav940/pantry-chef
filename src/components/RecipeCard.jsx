import React, { useState, useEffect } from 'react';
import { usePantry } from '../context/PantryContext';
import { useFavorites } from '../context/FavoritesContext';
import { calculateRecipeMatch } from '../utils/matchAlgorithm';
import { Heart, Clock, Users, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import RecipeDetail from './RecipeDetail';

/**
 * Renders a single recipe card.
 * Computes ingredient matches, lists owned vs. missing ingredients,
 * handles favoriting, and provides a modal for full cooking instructions.
 * 
 * @param {object} props
 * @param {object} props.recipe - The recipe object.
 */
export default function RecipeCard({ recipe }) {
  const { ingredients } = usePantry();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showModal, setShowModal] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Compute matching metrics dynamically
  const { matchPercentage, matchedIngredients, missingIngredients } = 
    calculateRecipeMatch(ingredients, recipe.ingredients);

  // Count-up animation state
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.round(matchPercentage || 0);
    if (end === 0) {
      setAnimatedPercent(0);
      return;
    }
    const duration = 1000; // 1 second ease-out
    const startTime = performance.now();
    
    let animationFrameId;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [matchPercentage]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    
    // Tilt degree limit: 12deg
    const tiltX = (y - 0.5) * -12;
    const tiltY = (x - 0.5) * 12;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const favorited = isFavorite(recipe.id);

  // Determine badge colors based on match percentage
  // orange (>70%), yellow (40-70%), red (<40%)
  let badgeColor = 'bg-[#FF4444] text-white';
  if (matchPercentage >= 70) {
    badgeColor = 'bg-gradient-to-r from-[#FF6B00] to-[#FFB300] text-white';
  } else if (matchPercentage >= 40) {
    badgeColor = 'bg-[#FFB300] text-zinc-950';
  }

  return (
    <>
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x !== 0 || tilt.y !== 0 ? -8 : 0}px)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
          borderColor: tilt.x !== 0 || tilt.y !== 0 ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 107, 0, 0.15)',
          boxShadow: tilt.x !== 0 || tilt.y !== 0 
            ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 107, 0, 0.15)' 
            : '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
        className="group bg-card-dark rounded-3xl overflow-hidden border border-white/5 flex flex-col h-[490px] preserve-3d"
      >
        {/* Image & Favorite Button Container (Top 55% of height) */}
        <div 
          className="relative h-[250px] w-full overflow-hidden bg-zinc-950 preserve-3d"
          style={{ transform: 'translateZ(20px)' }}
        >
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient Overlay fading to card background */}
          <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-card-dark/20 to-transparent"></div>
          
          {/* Glassmorphism Heart Button */}
          <button
            onClick={() => toggleFavorite(recipe)}
            className="absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-xl bg-black/40 border border-white/10 text-text-secondary hover:text-[#FF4444] dark:hover:text-[#FF4444] transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
            style={{ transform: 'translateZ(40px)' }}
            aria-label={favorited ? `Unfavorite ${recipe.name}` : `Favorite ${recipe.name}`}
          >
            <Heart size={16} className={favorited ? 'fill-[#FF4444] stroke-[#FF4444]' : 'stroke-[2.5]'} />
          </button>

          {/* Match Percentage Badge */}
          <span 
            className={`absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-black shadow-lg ${badgeColor}`}
            style={{ transform: 'translateZ(35px)' }}
          >
            {animatedPercent}% Match
          </span>
        </div>

        {/* Recipe Info */}
        <div 
          className="p-5 flex-1 flex flex-col justify-between preserve-3d"
          style={{ transform: 'translateZ(15px)' }}
        >
          <div>
            <div className="flex items-center gap-3 text-xs text-text-secondary mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={12} className="text-brand-orange" />
                {recipe.prepTime}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users size={12} className="text-brand-orange" />
                {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-text-secondary font-bold text-[9px] uppercase tracking-wider border border-white/5">
                {recipe.difficulty}
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-text-primary mb-3 line-clamp-1 group-hover:text-brand-orange transition-colors">
              {recipe.name}
            </h3>

            {/* Color-Coded Ingredients Comparison */}
            <div className="space-y-3.5 mt-2">
              {/* Ingredients you have (Green Glassmorphic) */}
              <div>
                <h4 className="text-[10px] font-bold text-match-green uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-match-green animate-pulse"></span>
                  Ingredients You Have ({matchedIngredients.length})
                </h4>
                {matchedIngredients.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                    {matchedIngredients.map(ing => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-match-green/10 text-match-green font-bold border border-match-green/20 backdrop-blur-md"
                      >
                        <Check size={8} className="stroke-[3]" />
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-text-secondary italic">None in your pantry.</p>
                )}
              </div>

              {/* Ingredients you are missing (Red Outlined) */}
              <div>
                <h4 className="text-[10px] font-bold text-match-red uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-match-red"></span>
                  Missing Ingredients ({missingIngredients.length})
                </h4>
                {missingIngredients.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                    {missingIngredients.map(ing => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-transparent text-match-red font-bold border border-match-red/30"
                      >
                        <AlertTriangle size={8} className="stroke-[2.5]" />
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-match-green font-bold flex items-center gap-1.5">
                    🎉 Fully stocked! Ready to cook!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 py-2 px-4 bg-white/[0.03] hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-amber hover:text-white text-text-primary font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all duration-300 border border-white/5 hover:border-brand-orange/20 cursor-pointer shadow-md"
          >
            <span>View Details</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Details Modal overlay */}
      <RecipeDetail
        recipe={recipe}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

