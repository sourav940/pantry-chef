import React from 'react';

export default function Header({ activeTab, setActiveTab, pantryCount }) {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-white">
      {/* Brand Identity Branding Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('finder')}>
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-black text-lg">
          🍳
        </div>
        <span className="text-xl font-bold tracking-tight">PantryPulse</span>
      </div>

      {/* Main Core Application Utility Navigation Links */}
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs sm:text-sm font-medium text-zinc-400">
        <button 
          onClick={() => setActiveTab('finder')}
          className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'finder' ? 'text-amber-500 font-semibold' : ''}`}
        >
          Recipe Finder
        </button>
        
        <button 
          onClick={() => setActiveTab('pantry')}
          className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'pantry' ? 'text-amber-500 font-semibold' : ''}`}
        >
          My Pantry 
          {pantryCount > 0 && (
            <span className="bg-zinc-800 text-amber-500 text-xs px-2 py-0.5 rounded-full font-bold">
              {pantryCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('macros')}
          className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'macros' ? 'text-amber-500 font-semibold' : ''}`}
        >
          Macro Tracker
        </button>

        <button 
          onClick={() => setActiveTab('saved')}
          className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'saved' ? 'text-amber-500 font-semibold' : ''}`}
        >
          Saved Recipes
        </button>
      </nav>

    </header>
  );
}
