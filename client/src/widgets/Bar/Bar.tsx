import { useEffect, useRef, useState } from "react";
import styles from "./Bar.module.css";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHook";
import { getStockThunk } from "@/entities/stock";

export default function Bar() {
  const stock = useAppSelector((state) => state.stock.stock);
  const user = useAppSelector((state) => state.user.user?.id);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.stock.isLoading);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Стор уже мог быть заполнен раньше (BarStorage грузит те же данные) —
    // не дублируем загрузку и не мигаем "Загрузка..." при каждом заходе.
    if (user && stock.length === 0) {
      void dispatch(getStockThunk(user));
    }
  }, [dispatch, user, stock.length]);

  const handleMouseOver = (type: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredType(type);
  };

  const handleMouseOut = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredType(null);
    }, 1000);
  };
  const typesOrder = Array.from(
    new Set(stock.map((item) => item.ingredientType?.type))
  ).filter(Boolean);

  const stockByType = typesOrder.reduce<Record<string, typeof stock>>(
    (acc, type) => {
      if (!type) return acc;
      const filteredItems = stock.filter(
        (item) => item.ingredientType?.type === type
      );
      if (filteredItems.length > 0) {
        acc[type] = filteredItems.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
      }
      return acc;
    },
    {}
  );

  const visibleTypes = typesOrder.slice(0, 24);
  const rows: string[][] = [];
  for (let i = 0; i < visibleTypes.length; i += 8) {
    rows.push(visibleTypes.slice(i, i + 8));
  }

  return (
    <div className={styles.bar}>

      <div className={styles.barCollection}>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          rows.map((row, rowIndex) => (
            <div className={styles.barRow} key={rowIndex}>
              <div className={styles.barShelf} />
              <img className={styles.shelfCapLeft} src="/shelf-left.png" alt="" />
              <img className={styles.shelfCapRight} src="/shelf-right.png" alt="" />
              {row.map((type) => (
                <div
                  key={type}
                  className={styles.barItem}
                  onMouseOver={() => handleMouseOver(type)}
                  onMouseOut={handleMouseOut}
                >
                  {hoveredType === type && (
                    <div className={styles.barBlock}>
                      <p>
                        <strong>{type}</strong>
                      </p>
                      {stockByType[type].map((ingredient) => (
                        <p key={`${ingredient.id}-${ingredient.title}`}>
                          {ingredient.title || type} —{" "}
                          {ingredient.ingredientBalance} мл
                          {ingredient.strength && ` (${ingredient.strength}%)`}
                        </p>
                      ))}
                    </div>
                  )}
                  <img
                    src={
                      stockByType[type][0]?.ingredientType?.imgUrl ||
                      "/ingredients/default.png"
                    }
                    alt={`${type} bottle`}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
