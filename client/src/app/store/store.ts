import { userReducer } from "@/entities/user";
import { ingredientReducer, ingredientsReducer } from "@/entities/ingredient";
import { recipeReducer, recipesReducer } from "@/entities/recipe";
import { stockReducer } from "@/entities/stock";
import { configureStore } from "@reduxjs/toolkit";
import { userRecipesReducer } from "@/entities/recipe/slice/userFavRecipesSlice";
import { searchReducer } from "@/entities/ingredient/slice/searchSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    ingredient: ingredientReducer,
    ingredients: ingredientsReducer,
    recipe: recipeReducer,
    recipes: recipesReducer,
    userfavrecipes: userRecipesReducer,
    stock: stockReducer,
    search: searchReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
