import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PantryProvider, usePantry } from './context/PantryContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { FilterProvider } from './context/FilterContext';
import { MacroProvider } from './context/MacroContext';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Header from './components/Header';

/**
 * Main PantryPulse Application Workspace Content wrapper.
 * Manages active tab state and renders matching views.
 */
function AppContent() {
  const { ingredients } = usePantry();
  const [activeTab, setActiveTab] = useState('finder');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-bg-light text-text-primary selection:bg-brand-orange/20">
      {/* Header Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} pantryCount={ingredients.length} />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 relative z-10">
        {activeTab === 'saved' ? (
          <Favorites />
        ) : (
          <Home activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200/50 bg-[#F9F9FB]/60 backdrop-blur-md text-xs text-neutral-400 select-none">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold font-mono">PANTRYPULSE // STITCH ENGINE ENGINE_SYNC: OK</p>
          <p className="flex items-center gap-1.5 font-light">
            <span>Designed for 100% inventory utilization</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
            <span>Reducing dietary waste</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Root PantryPulse Application.
 * Configures all global providers and routing context.
 */
function App() {
  return (
    <PantryProvider>
      <MacroProvider>
        <FavoritesProvider>
          <FilterProvider>
            <Router>
              <AppContent />
            </Router>
          </FilterProvider>
        </FavoritesProvider>
      </MacroProvider>
    </PantryProvider>
  );
}

export default App;
