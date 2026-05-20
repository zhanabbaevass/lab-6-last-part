import { useState, useMemo } from "react";
import { useRecipes } from "../context/RecipeContext";
import { useFetch } from "../hooks/useFetch";
import useSearch from "../hooks/useSearch";
import RecipeCard from "../components/RecipeCard";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export default function Search() {
  const { recipes: contextRecipes, editRecipe, deleteRecipe } = useRecipes();
  const { data, loading, error, refetch } = useFetch(API_URL);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [editingRecipe, setEditingRecipe] = useState(null);

  const apiRecipes = useMemo(() => {
    if (!data || !data.meals) return [];

    return data.meals.map((meal) => ({
      id: meal.idMeal,
      idMeal: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      description: meal.strInstructions,
      image: meal.strMealThumb,
      ingredients: [],
      rating: 4,
    }));
  }, [data]);

  const recipes = useMemo(() => {
    const userRecipes = contextRecipes.filter((r) => Number(r.id) > 3);
    return [...apiRecipes, ...userRecipes];
  }, [apiRecipes, contextRecipes]);

  const categories = useMemo(
    () => [...new Set(recipes.map((r) => r.category).filter(Boolean))],
    [recipes]
  );

  const filteredRecipes = useSearch(
    recipes,
    searchTerm,
    selectedCategory || "All",
    sortBy
  );

  const isUserRecipe = (id) =>
    contextRecipes.some((r) => String(r.id) === String(id) && Number(r.id) > 3);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editRecipe(editingRecipe.id, editingRecipe);
    setEditingRecipe(null);
  };

  if (loading) {
    return <div style={statusBox}>Loading recipes...</div>;
  }

  if (error) {
    return (
      <div style={statusBox}>
        <p>Something went wrong: {error}</p>
        <button onClick={refetch} style={retryBtn}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={container}>
      <h1>🔍 Поиск Рецептов</h1>

      <div style={searchContainer}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={categorySelect}
        >
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={categorySelect}
        >
          <option value="">Без сортировки</option>
          <option value="name">Sort by name</option>
          <option value="newest">Sort by newest</option>
          <option value="rating">Sort by rating</option>
        </select>
      </div>

      <div style={resultsInfo}>Найдено рецептов: {filteredRecipes.length}</div>

      <div style={recipesGrid}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id || recipe.idMeal}>
              <RecipeCard
                recipe={recipe}
                onClick={
                  isUserRecipe(recipe.id)
                    ? () => setEditingRecipe({ ...recipe })
                    : undefined
                }
              />
            </div>
          ))
        ) : (
          <div style={noResults}>
            <p>Рецепты не найдены. Попробуйте изменить поисковый запрос.</p>
          </div>
        )}
      </div>

      {editingRecipe && (
        <div style={overlay}>
          <div style={modal}>
            <h3>✏️ Редактировать рецепт</h3>

            <form onSubmit={handleSaveEdit}>
              <input
                style={inp}
                placeholder="Название"
                value={editingRecipe.title}
                onChange={(e) =>
                  setEditingRecipe({ ...editingRecipe, title: e.target.value })
                }
              />

              <input
                style={inp}
                placeholder="Категория"
                value={editingRecipe.category || ""}
                onChange={(e) =>
                  setEditingRecipe({
                    ...editingRecipe,
                    category: e.target.value,
                  })
                }
              />

              <input
                style={inp}
                type="number"
                placeholder="Время (мин)"
                value={editingRecipe.time || ""}
                onChange={(e) =>
                  setEditingRecipe({ ...editingRecipe, time: e.target.value })
                }
              />

              <textarea
                style={{ ...inp, minHeight: "80px" }}
                placeholder="Описание"
                value={editingRecipe.description || ""}
                onChange={(e) =>
                  setEditingRecipe({
                    ...editingRecipe,
                    description: e.target.value,
                  })
                }
              />

              <input
                style={inp}
                placeholder="URL изображения"
                value={editingRecipe.image || ""}
                onChange={(e) =>
                  setEditingRecipe({ ...editingRecipe, image: e.target.value })
                }
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={saveBtn}>
                  💾 Сохранить
                </button>
                <button
                  type="button"
                  style={cancelBtn}
                  onClick={() => setEditingRecipe(null)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const container = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };

const searchContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const searchInput = {
  flex: 1,
  minWidth: "200px",
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontSize: "16px",
};

const categorySelect = {
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  minWidth: "150px",
};

const resultsInfo = {
  marginBottom: "20px",
  fontSize: "18px",
  color: "var(--text-secondary)",
};

const recipesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

const noResults = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "40px",
  color: "var(--text-secondary)",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1200,
};

const modal = {
  background: "var(--bg-card)",
  borderRadius: "var(--radius)",
  padding: "24px",
  width: "100%",
  maxWidth: "500px",
  border: "1px solid var(--border)",
};

const inp = {
  display: "block",
  width: "100%",
  marginBottom: "12px",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  boxSizing: "border-box",
};

const saveBtn = {
  flex: 1,
  padding: "10px",
  background: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cancelBtn = {
  flex: 1,
  padding: "10px",
  background: "#95a5a6",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const statusBox = {
  textAlign: "center",
  padding: "60px 20px",
  fontSize: "20px",
  color: "var(--text-primary)",
};

const retryBtn = {
  marginTop: "15px",
  padding: "10px 18px",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};