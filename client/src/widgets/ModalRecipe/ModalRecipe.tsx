import { JSX, useCallback, useEffect, useState } from "react";
import styles from "./ModalRecipe.module.css";
import { getRecipeByIdThunk, getUserFavRecipesThunk } from "@/entities/recipe";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHook";
import {
  addFavouriteRecipeThunk,
  delFavouriteRecipeThunk,
} from "@/entities/favouriterecipe";
import { IRecipeArrayType } from "@/entities/recipe/model";
import { getStockThunk, updateStockThunk } from "@/entities/stock";

type Props = {
  isBar: boolean;
  recipes: IRecipeArrayType;
  recId: number;
  recipesLength: number;
  onClose: () => void;
};

export default function ModalRecipe({
  isBar,
  recipes,
  recId,
  recipesLength,
  onClose,
}: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const userFavorites = useAppSelector((state) => state.userfavrecipes.recipes);
  const stock = useAppSelector((state) => state.stock.stock);
  const [quantity, setQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number>(1);

  const initialRecipeIndex = recipes.findIndex((recipe) => recipe.id === recId);

  const [recipeIndex, setRecipeIndex] = useState(
    initialRecipeIndex >= 0 ? initialRecipeIndex : 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    while (value.length > 1 && value[0] === "0") {
      value = value.slice(1);
    }
    const numericValue = Number(value) || 0;
    const newValue = Math.max(0, Math.min(maxQuantity, numericValue || 0));
    setQuantity(newValue);
    e.target.value = newValue.toString();
  };

  const recipe = recipes[recipeIndex];
  const isFavorite = userFavorites.some(
    (favRecipe) => favRecipe.id === recipe?.id
  );

  useEffect(() => {
    if (userId && recipe?.id) {
      dispatch(getRecipeByIdThunk(recipe.id));
    }
  }, [recipe, userId, dispatch]);

  const switchToFavorite = async () => {
    if (userId && recipe?.id) {
      const action = isFavorite
        ? delFavouriteRecipeThunk({ userId, recipeId: recipe.id })
        : addFavouriteRecipeThunk({ userId, recipeId: recipe.id });

      await dispatch(action);
      dispatch(getUserFavRecipesThunk(userId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      recipe.Components?.forEach(async (component) => {
        const stockItem = stock.find(
          (item) => item.ingredientTypeId === component.ingredientTypeId
        );
        await dispatch(
          updateStockThunk({
            ingredientTypeId: stockItem!.ingredientTypeId,
            ingredientBalance: (
              parseFloat(stockItem!.ingredientBalance) -
              quantity *
                Number(component.quantity.replace(",", ".").slice(0, -3))
            ).toString(),
            title: stockItem!.title,
            strength: stockItem!.strength,
            userId: userId!,
            id: stockItem!.id,
          })
        );
        await dispatch(getStockThunk(userId!));
        onClose();
      });
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      await dispatch(getStockThunk(userId!));
      onClose();
    }
  };

  const checkStockAvailability = useCallback(
    (ingredientId: number, requiredQuantity: string): number => {
      const stockItem = stock.find(
        (item) => item.ingredientTypeId === ingredientId
      );
      if (!stockItem) return 0;

      const balance = parseFloat(stockItem.ingredientBalance);
      if (isNaN(balance)) return 0;

      const parsedQuantity = parseFloat(
        requiredQuantity.replace(",", ".").slice(0, -3)
      );
      if (isNaN(parsedQuantity) || parsedQuantity === 0) return 0;
      return Math.floor(balance / parsedQuantity);
    },
    [stock]
  );

  useEffect(() => {
    if (recipe?.Components) {
      let calculatedMax = Infinity;

      for (const component of recipe.Components) {
        if (component.ingredient.isAlko) {
          const possibleCocktails = checkStockAvailability(
            component.ingredient.id,
            component.quantity
          );

          if (possibleCocktails === 0) {
            calculatedMax = 0;
            break;
          }

          calculatedMax = Math.min(calculatedMax, possibleCocktails);
        }
      }

      const finalMax = calculatedMax === Infinity ? 0 : calculatedMax;
      setMaxQuantity(finalMax);
      setQuantity((prev) => Math.min(prev, finalMax));
    }
  }, [recipe, checkStockAvailability]);

  return (
    <div className={styles.modalOverlay}>
      {recipeIndex > 0 && (
        <button
          className={`${styles.modalArrow} ${styles.modalArrowLeft}`}
          onClick={() => setRecipeIndex(recipeIndex - 1)}
          aria-label="Предыдущий рецепт"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <div className={styles.modalContent}>
            <div className={styles.modalLeft}>
              <img
                src={recipe?.img}
                alt={recipe?.title}
                className={styles.modalImage}
              />
              <div className={styles.modalPreparation}>
                <h3>Приготовление:</h3>
                <p>{recipe?.discription}</p>
              </div>
            </div>
            <div className={styles.modalRight}>
              <h2>{recipe?.title}</h2>
              <div className={styles.modalDescription}>
                <p>{recipe?.text}</p>
              </div>
              <div>
                <h3>Тебе понадобятся:</h3>
                <div>
                  {recipe?.Components.map((component, index) => {
                    const isAvailable =
                      component.ingredient.isAlko === false ||
                      checkStockAvailability(
                        component.ingredient.id,
                        component.quantity
                      ) > 0;
                    return isBar ? (
                      <div
                        key={index}
                        className={styles.ingrTable}
                        style={{
                          color: isAvailable ? "" : "red",
                        }}
                      >
                        <div className={styles.ingrName}>
                          - {component.ingredient.type}
                        </div>
                        <div className={styles.ingrQuant}>
                          ({component.quantity})
                        </div>
                      </div>
                    ) : (
                      <div key={index} className={styles.ingrTable}>
                        <div className={styles.ingrName}>
                          - {component.ingredient.type}
                        </div>
                        <div className={styles.ingrQuant}>
                          ({component.quantity})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {isBar ? (
                <>
                  {maxQuantity > 0 ? (
                    <>
                      <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formPart}>
                          <p>Доступное количество коктейлей: {maxQuantity}</p>
                        </div>
                        <div className={styles.formPart}>
                          <label className={styles.containerLabel}>
                            Количество коктейлей:
                          </label>
                          <input
                            type="number"
                            value={quantity}
                            onChange={handleChange}
                            min={0}
                            max={maxQuantity}
                            className={styles.containerInput}
                          />
                        </div>
                        <div className={styles.formPart}>
                          <button
                            type="submit"
                            className={styles.addButton}
                            disabled={quantity === 0 || quantity > maxQuantity}
                          >
                            Подтвердить
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <p className={styles.error}>Недостаточно ингредиентов</p>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <button className={styles.favoriteButton} onClick={switchToFavorite}>
            {isFavorite ? (
              <img
                src="/free-icon-bookmark-4305474.png"
                alt="favorite"
                className={styles.favoriteIcon}
              />
            ) : (
              <img
                src="/free-icon-bookmark-4305497.png"
                alt="favorite"
                className={styles.favoriteIcon}
              />
            )}
          </button>
        </div>
      </div>

      {recipeIndex < recipesLength - 1 && (
        <button
          className={`${styles.modalArrow} ${styles.modalArrowRight}`}
          onClick={() => setRecipeIndex(recipeIndex + 1)}
          aria-label="Следующий рецепт"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}
