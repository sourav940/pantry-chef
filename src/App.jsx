import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import { PantryProvider } from './context/PantryContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { FilterProvider } from './context/FilterContext';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { ChefHat, Heart, Compass } from 'lucide-react';

/**
 * Sub-component for the Navigation Bar to utilize state context.
 */
function NavigationHeader() {
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-bg-dark/70 border-b border-white/5 shadow-2xl shadow-brand-orange/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-orange to-brand-amber text-white shadow-lg shadow-brand-orange/20 animate-chef-shimmer">
              <ChefHat size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-orange to-brand-amber bg-clip-text text-transparent font-sans">
              Pantry-Chef
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-orange/10 text-brand-orange font-bold'
                    : 'text-text-secondary hover:bg-card-dark hover:text-text-primary'
                }`
              }
            >
              <Compass size={16} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-orange/10 text-brand-orange font-bold'
                    : 'text-text-secondary hover:bg-card-dark hover:text-text-primary'
                }`
              }
            >
              <Heart size={16} className={favorites.length > 0 ? 'fill-brand-orange text-brand-orange' : ''} />
              <span>Bookmarks</span>
              {favorites.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-brand-orange rounded-full animate-heartbeat shadow-lg shadow-brand-orange/50">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

/**
 * Main Application Component.
 * Implements Routing and Context Wrapper.
 */
function App() {
  return (
    <PantryProvider>
      <FavoritesProvider>
        <FilterProvider>
          <Router>
            <div className="min-h-screen flex flex-col font-sans bg-bg-dark text-text-primary selection:bg-brand-orange/30 selection:text-white">
              {/* Global Header Navigation */}
              <NavigationHeader />

              {/* Main Content Area */}
              <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/favorites" element={<Favorites />} />
                  {/* Fallback route */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              {/* Global Sticky Footer */}
              <footer className="py-6 border-t border-white/5 bg-bg-dark/40 backdrop-blur-md text-center text-xs text-text-secondary">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p>© {new Date().getFullYear()} Pantry-Chef 🍳. Happy cooking!</p>
                  <p className="flex items-center gap-1.5">
                    <span>Reduce food waste</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange/60"></span>
                    <span>Cook what you have</span>
                  </p>
                </div>
              </footer>
            </div>
          </Router>
        </FilterProvider>
      </FavoritesProvider>
    </PantryProvider>
  );
}

export default App;

