import { calculateMatch, sortRecipes } from '../utils/matchAlgorithm';

// Mock recipes dataset with high-quality culinary images from Unsplash.
const MOCK_RECIPES = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Spaghetti", "Ground Beef", "Onion", "Garlic", "Tomato Sauce", "Olive Oil", "Parmesan"],
    instructions: [
      "Boil spaghetti in salted water according to package instructions until al dente.",
      "Heat olive oil in a pan, and sauté finely chopped onion and minced garlic until soft and fragrant.",
      "Add ground beef and brown it over medium-high heat, breaking it up with a spoon. Drain excess fat.",
      "Pour in tomato sauce, stir well, and let it simmer on low heat for 15 minutes to let flavors meld.",
      "Plate the spaghetti, spoon the Bolognese sauce over it, and garnish with fresh grated Parmesan cheese."
    ],
    prepTime: "25 mins",
    servings: 4,
    difficulty: "Easy",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 2,
    name: "Fresh Caprese Salad",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Tomato", "Mozzarella", "Basil", "Olive Oil", "Balsamic Vinegar", "Salt", "Pepper"],
    instructions: [
      "Slice fresh tomatoes and fresh mozzarella cheese into 1/4-inch thick round slices.",
      "Arrange the tomato and mozzarella slices alternately on a serving platter, overlapping them slightly.",
      "Tuck fresh basil leaves between the tomato and cheese slices.",
      "Drizzle extra virgin olive oil and high-quality balsamic vinegar over the salad.",
      "Season evenly with sea salt and freshly cracked black pepper right before serving."
    ],
    prepTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isKeto: true
  },
  {
    id: 3,
    name: "Sizzling Chicken Fajitas",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Chicken Breast", "Bell Pepper", "Onion", "Tortillas", "Lime", "Olive Oil", "Cumin", "Chili Powder"],
    instructions: [
      "Slice the chicken breast, bell peppers, and onion into thin, uniform strips.",
      "In a bowl, toss the chicken strips with olive oil, freshly squeezed lime juice, cumin, chili powder, salt, and pepper.",
      "Heat a large skillet over high heat and cook the chicken until fully cooked and slightly charred. Remove chicken and keep warm.",
      "In the same skillet, cook the peppers and onions until they are soft but still retain a bite (about 4-5 minutes).",
      "Return chicken to the skillet, stir to combine, and serve sizzled hot with warmed tortillas."
    ],
    prepTime: "20 mins",
    servings: 3,
    difficulty: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 4,
    name: "Classic Avocado Toast",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Bread", "Avocado", "Egg", "Salt", "Pepper", "Red Pepper Flakes"],
    instructions: [
      "Toast bread slices in a toaster or skillet until golden brown and crispy.",
      "Cut open a ripe avocado, scoop the flesh into a bowl, and mash it with a fork. Season with salt and pepper.",
      "Heat butter or oil in a pan and fry eggs to your liking (sunny-side up or poached works best).",
      "Spread the seasoned mashed avocado evenly over the toasted bread slices.",
      "Top with the cooked eggs, and garnish with red pepper flakes and extra pepper."
    ],
    prepTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 5,
    name: "Healthy Banana Oats Smoothie",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Banana", "Milk", "Yogurt", "Honey", "Oats"],
    instructions: [
      "Add oats to the blender and pulse a few times to grind them into a powder-like texture.",
      "Add the banana chunks, milk, yogurt, and a drizzle of honey.",
      "Blend on high speed for 1-2 minutes until completely smooth, thick, and creamy.",
      "Pour into a glass, garnish with a sprinkle of rolled oats or banana slices, and enjoy cold."
    ],
    prepTime: "5 mins",
    servings: 1,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isKeto: false
  },
  {
    id: 6,
    name: "Tofu Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Broccoli", "Carrot", "Bell Pepper", "Soy Sauce", "Garlic", "Ginger", "Sesame Oil", "Tofu"],
    instructions: [
      "Press tofu with a paper towel to remove water, then cut into cubes. Pan-fry tofu in sesame oil until golden and crispy.",
      "Chop broccoli florets, slice carrots, and slice bell peppers into thin strips.",
      "In a hot wok, sauté minced garlic and grated ginger in sesame oil for about 30 seconds until aromatic.",
      "Add carrots and broccoli, stir-frying for 3 minutes. Add bell peppers and cook for another 2 minutes.",
      "Add the crispy tofu cubes and pour in soy sauce. Toss everything together for 1-2 minutes until heated through."
    ],
    prepTime: "20 mins",
    servings: 3,
    difficulty: "Medium",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isKeto: true
  },
  {
    id: 7,
    name: "Gourmet Grilled Cheese",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Bread", "Cheese", "Butter"],
    instructions: [
      "Spread butter evenly on one side of each slice of bread.",
      "Place one slice of bread, butter-side-down, in a cold non-stick skillet.",
      "Top the bread generously with grated or sliced cheese (such as sharp Cheddar or Gruyère).",
      "Place the second slice of bread on top, butter-side-up.",
      "Cook over medium-low heat until the bottom is golden brown and cheese begins to melt, then flip and cook the other side until crispy and cheese is completely melted."
    ],
    prepTime: "10 mins",
    servings: 1,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 8,
    name: "Neapolitan Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Pizza Crust", "Tomato Sauce", "Mozzarella", "Basil", "Olive Oil"],
    instructions: [
      "Preheat your oven to its highest setting (usually 450°F / 230°C) or prepare a pizza stone.",
      "Roll out the pizza crust onto a baking sheet or pizza peel.",
      "Spread a thin layer of tomato sauce over the crust, leaving a 1-inch border around the edge.",
      "Distribute fresh mozzarella cheese slices or shreds evenly over the sauce.",
      "Bake for 10-12 minutes until the crust is puffed and golden brown, and the cheese is bubbling. Garnish with fresh basil leaves and a drizzle of olive oil."
    ],
    prepTime: "15 mins",
    servings: 2,
    difficulty: "Medium",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 9,
    name: "Classic French Toast",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Bread", "Egg", "Milk", "Cinnamon", "Butter", "Maple Syrup"],
    instructions: [
      "In a wide, shallow bowl, whisk together eggs, milk, and ground cinnamon until well combined.",
      "Melt butter in a large skillet or griddle over medium heat.",
      "Dip each slice of bread into the egg mixture for 5-10 seconds per side, allowing it to soak slightly.",
      "Place bread slices on the hot skillet and cook for 2-3 minutes per side until golden brown and cooked through.",
      "Serve warm, topped with a pat of butter and a generous drizzle of maple syrup."
    ],
    prepTime: "15 mins",
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false
  },
  {
    id: 10,
    name: "Creamy Roasted Tomato Soup",
    image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Tomatoes", "Onion", "Garlic", "Vegetable Broth", "Heavy Cream", "Basil", "Olive Oil"],
    instructions: [
      "Sauté chopped onions and minced garlic in olive oil in a large pot until soft and translucent.",
      "Add fresh chopped tomatoes (or canned crushed tomatoes) and vegetable broth. Bring to a boil, then reduce heat and simmer for 20 minutes.",
      "Stir in fresh basil leaves and remove from heat.",
      "Purée the soup using an immersion blender until completely smooth and velvety.",
      "Return pot to low heat, stir in heavy cream, season with salt and pepper to taste, and serve hot."
    ],
    prepTime: "30 mins",
    servings: 4,
    difficulty: "Medium",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isKeto: true
  },
  {
    id: 11,
    name: "Garlic Butter Shrimp",
    image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Shrimp", "Garlic", "Butter", "Lemon", "Parsley", "Olive Oil"],
    instructions: [
      "Peel, devein, and pat dry the shrimp.",
      "In a large skillet, heat olive oil and 1 tablespoon of butter over medium-high heat. Add shrimp and cook for 1-2 minutes until they start turning pink.",
      "Add minced garlic and the remaining butter. Sauté for another 1-2 minutes until the garlic is fragrant and shrimp is cooked through (do not overcook).",
      "Squeeze fresh lemon juice over the shrimp and season with salt and pepper.",
      "Garnish with chopped fresh parsley and serve immediately."
    ],
    prepTime: "15 mins",
    servings: 2,
    difficulty: "Easy",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isKeto: true
  },
  {
    id: 12,
    name: "Chunky Zesty Guacamole",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60",
    ingredients: ["Avocado", "Lime", "Onion", "Tomato", "Cilantro", "Jalapeno", "Salt"],
    instructions: [
      "Slice the avocados in half, discard the pits, and scoop the green flesh into a large bowl.",
      "Using a fork or potato masher, mash the avocado until it reaches your desired texture (leave some chunks!).",
      "Add the finely diced red onion, seeded and diced tomato, finely chopped fresh cilantro, and minced jalapeno.",
      "Pour in fresh lime juice and sprinkle salt over the top.",
      "Gently stir to combine all ingredients, adjust seasoning, and serve with crispy tortilla chips."
    ],
    prepTime: "10 mins",
    servings: 3,
    difficulty: "Easy",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isKeto: true
  }
];

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || "";
const BASE_URL = "https://api.spoonacular.com/recipes";

/**
 * Cleanly normalizes, caches, and queries recipes by ingredient list
 * from the live Spoonacular API findByIngredients endpoint.
 */
export async function fetchRecipesFromPantry(userIngredients) {
  if (!userIngredients || userIngredients.length === 0) return [];

  // 1. Normalize and clean the query items to lowercase comma-separated values
  const cleanIngredients = userIngredients
    .map(i => i.toLowerCase().trim())
    .filter(Boolean);
    
  const cacheKey = [...cleanIngredients].sort().join(",");
  
  // 2. Evaluate Session Cache
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Double check if the API key is loading properly
  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("VITE_SPOONACULAR_API_KEY is missing or invalid in .env");
    return [];
  }

  try {
    // 3. Request live data from Spoonacular findByIngredients endpoint
    const url = `${BASE_URL}/findByIngredients?ingredients=${encodeURIComponent(cacheKey)}&number=20&ranking=1&ignorePantry=true&apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Server returned status code: ${response.status}`);
    }

    const rawData = await response.json();
    
    if (!rawData || rawData.length === 0) {
      console.warn("Spoonacular returned 0 recipes for this combination.");
      return [];
    }

    // 4. Structural data mapping transformation
    const formattedRecipes = rawData.map(item => {
      const parsedIngredients = [
        ...item.usedIngredients.map(i => i.name),
        ...item.missedIngredients.map(i => i.name)
      ];

      // Local heuristics for dietary preferences flags since findByIngredients lacks them
      const ingredientsLower = parsedIngredients.map(ing => ing.toLowerCase());
      const hasMeat = ingredientsLower.some(ing => 
        /\b(chicken|breast|beef|pork|shrimp|fish|tuna|salmon|turkey|bacon|sausage|meat|pepperoni|ham|steak|lamb|anchov|crab|lobster)\b/.test(ing)
      );
      const hasDairyOrEgg = ingredientsLower.some(ing => 
        /\b(cheese|milk|butter|egg|yogurt|cream|mozzarella|parmesan|honey|whey|gelatin|ghee)\b/.test(ing)
      );
      const hasGluten = ingredientsLower.some(ing => 
        /\b(wheat|flour|bread|pasta|spaghetti|crust|barley|rye|noodle|couscous|semolina)\b/.test(ing)
      );
      const hasHighCarbs = ingredientsLower.some(ing => 
        /\b(wheat|flour|bread|pasta|spaghetti|crust|barley|rye|noodle|rice|oats|banana|sugar|honey|maple|potato|corn|tortilla|chickpea|lentil|pea|bean)\b/.test(ing)
      );
      
      return {
        id: item.id,
        name: item.title,
        image: item.image,
        ingredients: parsedIngredients,
        prepTime: "30 mins",    // Default fallback, overwritten by lazy-loaded details
        servings: 4,            // Default fallback, overwritten by lazy-loaded details
        difficulty: "Medium",   // Default fallback, overwritten by lazy-loaded details
        isVegetarian: !hasMeat,
        isVegan: !hasMeat && !hasDairyOrEgg,
        isGlutenFree: !hasGluten,
        isKeto: !hasHighCarbs,
        ...calculateMatch(userIngredients, parsedIngredients)
      };
    });

    const finalResults = sortRecipes(formattedRecipes);
    sessionStorage.setItem(cacheKey, JSON.stringify(finalResults));
    return finalResults;

  } catch (error) {
    console.error("Network interface breakdown during API fetch:", error);
    return [];
  }
}

/**
 * Unified wrapper function to load recipes. Uses fetchRecipesFromPantry if
 * a Spoonacular API key is present in .env, otherwise defaults to local mock data.
 */
export const getRecipes = async (ingredientsList = []) => {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.trim() === "") {
    console.log("Spoonacular API key not found. Using simulated mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_RECIPES);
      }, 800);
    });
  }
  return fetchRecipesFromPantry(ingredientsList);
};
