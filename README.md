# 🍳 Pantry-Chef

**Pantry-Chef** is an ingredient-first recipe discovery web app that helps users reduce household food waste. Instead of browsing recipes and then shopping for ingredients, users input what they already have and the app surfaces recipes they can cook right now.

🔗 **Live Demo:** [pantry-chef-nu.vercel.app](https://pantry-chef-nu.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Key Engineering Features](#key-engineering-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Overview

Traditional recipe apps follow a **recipe → ingredients** model — you find a dish you like, then check if you have what it needs. Pantry-Chef inverts this: start with your pantry, get back only the recipes you can actually make.

Core user flow:
1. Enter ingredients currently in your kitchen
2. App queries the Spoonacular API with your exact inventory
3. Results are ranked by ingredient match percentage and filtered by dietary preferences
4. Save favorites for offline reference

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React.js (Functional Components, Custom Hooks, Context API) |
| Build Tool | Vite (HMR + production bundling) |
| Styling | Tailwind CSS (dark-theme responsive grid) |
| Data Source | Spoonacular REST Food API |
| Deployment | Vercel (SPA routing via `vercel.json`) |

---

## Project Architecture

The codebase follows a modular separation-of-concerns structure:

```
src/
├── assets/        # Static media, icons, and SVG graphics
├── components/    # Reusable UI elements — input chips, filter controls, recipe cards
├── context/       # Global state — PantryContext, FilterContext, MacroContext, FavoritesContext
├── pages/         # Top-level route views — Home, Favorites
├── services/      # API adapters — recipeApi.js (Spoonacular integration)
└── utils/         # Pure client-side logic — matchAlgorithm.js (ingredient scoring)
```

State is managed entirely through React Context, keeping components decoupled and eliminating prop-drilling across the feature tree.

---

## Key  Features

### Input Sanitization (`recipeApi.js`)
All user-entered ingredient strings are normalized via `.toLowerCase()` and `.trim()` before being sent to the Spoonacular API. This prevents mismatches caused by casing inconsistencies or accidental whitespace, and ensures query parameters conform to the API's expected schema.

### Regex-Based Ingredient Scoring (`matchAlgorithm.js`)
A regex tokenizer strips measurement noise — fractions, integers, and unit words like `cups`, `ounces`, `tablespoons` — from raw ingredient strings returned by the API. This isolates the base ingredient keyword, which is then used for array intersection scoring to compute a `matchPercent` value per recipe. Results are sorted deterministically by this score.

### Custom Debounce Hook (`useDebounce.js`)
A debounce timer closure intercepts rapid keystroke events on the ingredient input field. Network requests are only dispatched after the user pauses typing, preventing redundant API calls and protecting the free-tier Spoonacular quota.

### Multi-Context State Architecture
Four decoupled context stores (`PantryContext`, `FilterContext`, `MacroContext`, `FavoritesContext`) are composed at the app root. Any component can subscribe to exactly the slice of state it needs, and a state update in one context triggers re-renders only in its subscribers — keeping the UI responsive without unnecessary re-computation.

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A [Spoonacular API key](https://spoonacular.com/food-api) (free tier works for development)

### Installation

```bash
git clone <your-repository-url>
cd pantry-chef
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SPOONACULAR_API_KEY=your_api_key_here
```

> ⚠️ Never commit this file to version control. It is already listed in `.gitignore` by default in Vite projects.

---

## Scripts

```bash
# Start local dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint the codebase
npm run lint
```

---

## License

This project is for educational and portfolio purposes.
