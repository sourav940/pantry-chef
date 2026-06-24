import React from 'react';

export const COMMON_INGREDIENTS = [
  'Tomato', 'Garlic', 'Onion', 'Chicken', 'Beef', 'Egg', 'Pasta', 'Cheese',
  'Potato', 'Butter', 'Milk', 'Rice', 'Flour', 'Bacon', 'Bread', 'Carrot',
  'Lemon', 'Lime', 'Olive Oil', 'Salt', 'Black Pepper', 'Cilantro', 'Parsley',
  'Basil', 'Ginger', 'Soy Sauce', 'Honey', 'Sugar', 'Mushroom', 'Bell Pepper',
  'Spinach', 'Pork', 'Turkey', 'Salmon', 'Tuna', 'Shrimp', 'Yogurt', 'Sour Cream',
  'Cheddar', 'Parmesan', 'Mozzarella', 'Broccoli', 'Zucchini', 'Avocado', 'Apple',
  'Banana', 'Strawberry', 'Blueberry', 'Orange', 'Coconut Milk'
];


export default function Autocomplete({ query, onSelect, activeIndex }) {
  if (!query || query.trim().length === 0) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const matches = COMMON_INGREDIENTS.filter(item =>
    item.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5); // Limit to top 5 matches for cleaner dropdown UI

  if (matches.length === 0) return null;

  const highlightMatch = (text, q) => {
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <span>{text}</span>;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + q.length);
    const after = text.substring(idx + q.length);

    return (
      <span>
        {before}
        <span className="text-brand-orange font-bold">{match}</span>
        {after}
      </span>
    );
  };

  return (
    <div className="absolute left-0 right-0 mt-2 bg-card-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-spring-in">
      <div className="py-1.5 px-3 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
        Suggestions
      </div>
      <ul className="divide-y divide-white/5 max-h-60 overflow-y-auto">
        {matches.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-brand-orange/15 text-white pl-5 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] hover:pl-5'
                }`}
              >
                <span>{highlightMatch(item, normalizedQuery)}</span>
                <span className="text-[10px] text-white/20 uppercase tracking-widest">
                  {isActive ? 'Enter' : 'Select'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
