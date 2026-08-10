import { IRecipeArrayType } from "@/entities/recipe/model";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./CoctailBox.module.css";

import CoctailCard from "../CoctailCard/CoctailCard";

type Prop = {
  recipes: IRecipeArrayType;
  onOpen: (id: number) => void;
};
export default function CoctailBox({ recipes, onOpen }: Prop) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedStrength, setSelectedStrength] = useState<string>("Все");
  const [isShotFilter, setIsShotFilter] = useState<boolean | null>(null);
  const [sortByLikes, setSortByLikes] = useState<"asc" | "desc" | null>(null);
  const [resipesState, setResipesState] = useState<IRecipeArrayType>(recipes);

  useEffect(() => {
    if (!(!Array.isArray(recipes) || recipes.length === 0)) {
      setResipesState(recipes);
    }
  }, [recipes]);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, []);

  const handleStrengthChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedStrength(e.target.value);
    },
    []
  );

  const handleShotChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsShotFilter(value === "true" ? true : value === "false" ? false : null);
  }, []);

  const handleSortByLikesChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === "asc") {
        setSortByLikes("asc");
      } else if (value === "desc") {
        setSortByLikes("desc");
      } else {
        setSortByLikes(null);
      }
    },
    []
  );

  const filteredRecipes = useMemo(() => {
    if (!Array.isArray(resipesState) || resipesState.length === 0) {
      return [];
    }

    const filtered = resipesState.filter((recipe) => {
      const strengthFilter =
        selectedStrength === "Все" || recipe.strengthLevel === selectedStrength;

      const shotFilter =
        isShotFilter === null || recipe.isShot === isShotFilter;

      return strengthFilter && shotFilter;
    });

    if (sortByLikes === "asc") {
      filtered.sort((a, b) => a.likes - b.likes);
    } else if (sortByLikes === "desc") {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  }, [resipesState, selectedStrength, isShotFilter, sortByLikes]);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterWrapper}>
        <div className={styles.filter}>
          <label htmlFor="strength">По крепости </label>
          <select
            id="strength"
            value={selectedStrength}
            onChange={handleStrengthChange}
          >
            <option value="Все">Все</option>
            <option value="крепкий">Крепкие</option>
            <option value="средний">Средние</option>
            <option value="слабый">Легкие</option>
          </select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="strength">По объему </label>
          <select
            id="strength"
            value={isShotFilter === null ? "Все" : isShotFilter.toString()}
            onChange={handleShotChange}
          >
            <option value="Все">Все</option>
            <option value="false">Лонг-дринк</option>
            <option value="true">Шот-дринк</option>
          </select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="sortByLikes">Популярные</label>
          <select
            id="sortByLikes"
            value={sortByLikes || ""}
            onChange={handleSortByLikesChange}
          >
            <option value="">Не сортировать</option>
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>
      </div>
      {filteredRecipes.length !== 0 && (
        <>
          <div className={styles.carouselContainer}>
            <button
              className={styles.scrollButton}
              onClick={scrollLeft}
              aria-label="Прокрутить влево"
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
            <div className={styles.carousel} ref={carouselRef}>
              <div className={styles.recipeList}>
                {filteredRecipes.map((recipe) => (
                  <CoctailCard
                    key={recipe.id}
                    recipe={recipe}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </div>
            <button
              className={styles.scrollButton}
              onClick={scrollRight}
              aria-label="Прокрутить вправо"
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
          </div>
        </>
      )}
    </div>
  );
}
