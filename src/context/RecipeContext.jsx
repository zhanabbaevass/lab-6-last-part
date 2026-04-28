// @refresh reset
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const RecipeContext = createContext();

const initialRecipes = [
  { 
    id: 1, 
    title: "Борщ", 
    category: "Обед", 
    time: 60, 
    description: "Классический украинский борщ", 
    rating: 5, 
    liked: false,
    ingredients: ["Свекла", "Картофель", "Капуста", "Морковь", "Лук", "Мясо"],
    instructions: "Нарезать овощи, сварить бульон, добавить овощи по очереди.",
    image: "https://via.placeholder.com/300x200?text=Borscht"
  },
  { 
    id: 2, 
    title: "Паста карбонара", 
    category: "Обед", 
    time: 30, 
    description: "Итальянская паста со сливочным соусом", 
    rating: 4, 
    liked: false,
    ingredients: ["Спагетти", "Бекон", "Яйца", "Пармезан", "Чеснок"],
    instructions: "Сварить пасту, обжарить бекон, смешать с яйцами и сыром.",
    image: "https://via.placeholder.com/300x200?text=Pasta+Carbonara"
  },
  { 
    id: 3, 
    title: "Оливье", 
    category: "Ужин", 
    time: 40, 
    description: "Новогодний салат", 
    rating: 3, 
    liked: false,
    ingredients: ["Картофель", "Морковь", "Огурцы", "Колбаса", "Горошек", "Майонез"],
    instructions: "Отварить овощи, нарезать, смешать с майонезом.",
    image: "https://via.placeholder.com/300x200?text=Olivie"
  },
];

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem("recipes");
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addNotification = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const addRecipe = useCallback(
    (recipe) => {
      setRecipes((prev) => [...prev, { ...recipe, id: Date.now(), liked: false, rating: 0 }]);
      addNotification("Рецепт успешно добавлен", "success");
    },
    [addNotification]
  );

  const deleteRecipe = useCallback(
    (id) => {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      addNotification("Рецепт удалён из списка", "success");
    },
    [addNotification]
  );

  const editRecipe = useCallback(
    (id, updated) => {
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      addNotification("Рецепт обновлён", "success");
    },
    [addNotification]
  );

  const toggleLike = useCallback(
    (id) => {
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, liked: !r.liked } : r)));
    },
    []
  );

  const resetRecipes = useCallback(() => {
    setRecipes(initialRecipes);
    addNotification("Рецепты сброшены до начальных", "success");
  }, [addNotification]);

  return (
    <RecipeContext.Provider value={{
      recipes,
      addRecipe,
      deleteRecipe,
      editRecipe,
      toggleLike,
      resetRecipes,
      darkMode,
      toggleDarkMode,
      notifications,
      addNotification,
      removeNotification,
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  return useContext(RecipeContext);
}