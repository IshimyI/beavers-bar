import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHook";
import styles from "./BarStorage.module.css";
import { useEffect, useMemo, useState } from "react";
import { deleteStockThunk, getStockThunk, IStock } from "@/entities/stock";
import { getIngredientsThunk } from "@/entities/ingredient";
import BarUpdateForm from "@/features/ui/BarUpdateForm/BarUpdateForm";
import BarAddForm from "@/features/ui/BarAddForm/BarAddForm";
import { setCocktailSearch } from "@/entities/ingredient/slice/searchSlice";
export default function BarStorage() {
  const stock = useAppSelector((state) => state.stock.stock);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const user = useAppSelector((state) => state.user.user?.id);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.stock.isLoading);
  const error = useAppSelector((state) => state.stock.error);
  const [processedItems, setProcessedItems] = useState<number[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingStock, setEditingStock] = useState<IStock | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const alkoStock = useMemo(
    () =>
      stock.filter(
        (ingredient) =>
          (ingredient.ingredientType?.isAlko && searchValue.trim() === "") ||
          ingredient.ingredientType?.type
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      ),
    [stock, searchValue]
  );

  const deleteHandler = async (id: number) => {
    if (!user) return;
    try {
      const stockItem = alkoStock.find((item) => item.id === id);
      if (stockItem) {
        await dispatch(deleteStockThunk({ id: stockItem.id, userId: user }));
        await dispatch(getStockThunk(user));
        setProcessedItems((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error deleting stock item:", error);
    }
  };

  const editHandler = (id: number) => {
    const stockItem = alkoStock.find((item) => item.id === id);
    if (stockItem) {
      setEditingStock(stockItem);
      setShowUpdateForm(true);
      setShowAddForm(false);
    }
  };

  useEffect(() => {
    const deleting = async () => {
      if (!user) return;

      const itemsToDelete = alkoStock.filter(
        (item) =>
          !processedItems.includes(item.id) &&
          parseFloat(item.ingredientBalance) <= 0
      );

      if (itemsToDelete.length === 0) return;

      try {
        await Promise.all(
          itemsToDelete.map((item) =>
            dispatch(deleteStockThunk({ id: item.id, userId: user })).unwrap()
          )
        );
        await dispatch(getStockThunk(user));
        setProcessedItems((prev) => [
          ...prev,
          ...itemsToDelete.map((i) => i.id),
        ]);
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    };

    deleting();
  }, [dispatch, user, alkoStock, processedItems]);

  useEffect(() => {
    // Redux-состояние живёт дольше компонента: если данные уже загружены
    // (например, мы просто вернулись на страницу бара), не дёргаем сервер
    // заново — иначе каждый заход показывает "Загрузка..." без необходимости.
    if (!user || ingredients.length > 0) return;

    const fetchData = async () => {
      try {
        await dispatch(getIngredientsThunk());
        await dispatch(getStockThunk(user));
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    fetchData();
  }, [dispatch, user, ingredients.length]);

  const handleFormClose = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setEditingStock(null);
    dispatch(getStockThunk(user!));
  };

  return (
    <div className={styles.container}>
      <h1>Ваши напитки</h1>
      {!showAddForm && !showUpdateForm ? (
        <button
          className={styles.addButton}
          onClick={() => {
            setShowAddForm(true);
            setShowUpdateForm(false);
            setEditingStock(null);
          }}
        >
          Добавить еще напиток
        </button>
      ) : showUpdateForm ? (
        <BarUpdateForm
          setShowAddForm={handleFormClose}
          editingId={editingStock?.id || null}
          initialData={editingStock}
        />
      ) : (
        <BarAddForm
          setShowAddForm={handleFormClose}
          editingId={null}
          initialData={null}
        />
      )}
      <label className={styles.containerLabel}>Поиск по ингредиенту</label>
      <input
        className={styles.containerInput}
        type="text"
        onChange={handleChange}
        value={searchValue}
        list="ingredientsType"
      />
      <datalist id="ingredientsType">
        {ingredients
          .filter((ingredient) => ingredient.isAlko)
          .map((ingredient) =>
            ingredient.type ? (
              <option key={ingredient.id} value={ingredient.type} />
            ) : null
          )}
      </datalist>
      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      <div className={styles.ingredients}>
        {!Array.isArray(alkoStock) || alkoStock.length === 0 ? (
          <p>Ваш бар в данный момент пуст</p>
        ) : (
          alkoStock.map((ingredient) => (
            <div key={ingredient.id} className={styles.ingrCard}>
              <div className={styles.ingrHeader}>
                <span className={styles.ingredientType}>
                  {ingredient?.ingredientType?.type ||
                    ingredients.find(
                      (i) => i.id === ingredient.ingredientTypeId
                    )?.type ||
                    "Тип не указан"}
                </span>
                <span className={styles.ingredientTitle}>
                  {ingredient.title ||
                    ingredient?.ingredientType?.type ||
                    "Название не указано"}
                </span>
              </div>
              <div className={styles.ingrBody}>
                <div className={styles.ingredientDetails}>
                  <p className={styles.ingredientBalance}>
                    Остаток: {ingredient.ingredientBalance} мл.
                  </p>
                </div>
                <div
                  className={styles.ingrImg}
                  onClick={() => {
                    if (ingredient.ingredientType?.type) {
                      dispatch(
                        setCocktailSearch(ingredient.ingredientType.type)
                      );
                    }
                  }}
                >
                  <img
                    src={ingredient.ingredientType.imgUrl}
                    alt={ingredient.title}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.editButton}
                    onClick={() => editHandler(ingredient.id)}
                  >
                    Отредактировать
                  </button>
                  <button
                    className={styles.delButton}
                    onClick={() => deleteHandler(ingredient.id)}
                  >
                    Закончилось
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
