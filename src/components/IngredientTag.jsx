import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable visual chip for ingredients in the pantry.
 * Displays the ingredient name, a first-letter avatar, and an 'X' button to remove it.
 * 
 * @param {object} props
 * @param {string} props.name - The ingredient name.
 * @param {function} props.onRemove - Callback when the remove button is clicked.
 */
export default function IngredientTag({ name, onRemove }) {
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card-dark text-text-primary border-l-4 border-brand-orange border border-white/5 shadow-md shadow-black/20 hover:border-brand-orange/40 transition-all duration-300 animate-spring-in cursor-default text-sm font-medium">
      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-amber/20 text-brand-orange font-extrabold text-xs">
        {firstLetter}
      </span>
      <span>{name}</span>
      <button
        onClick={() => onRemove(name)}
        className="p-0.5 rounded-md text-text-secondary hover:text-match-red hover:bg-white/[0.06] transition-colors focus:outline-hidden focus:ring-1 focus:ring-brand-orange/40"
        aria-label={`Remove ${name}`}
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

