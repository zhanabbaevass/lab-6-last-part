import { useState, useMemo } from "react";
import { useRecipes } from "../context/RecipeContext";
import { useFetch } from "../hooks/useFetch";
import RecipeCard from "../components/RecipeCard";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export default function Search() {
  const { recipes: contextRecipes, editRecipe, deleteRecipe } = useRecipes();
  const { data } = useFetch(API_URL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingRecipe, setEditingRecipe] = useState(null);

  const apiRecipes = useMemo(() => {
    if (!data || !data.meals) return [];
    return data.meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      description: meal.strInstructions,
      image: meal.strMealThumb,
      ingredients: [],
    }));
  }, [data]);

  const recipes = useMemo(() => {
    const userRecipes = contextRecipes.filter((r) => r.id > 3);
    return [...apiRecipes, ...userRecipes];
  }, [apiRecipes, contextRecipes]);

  const categories = useMemo(
    () => [...new Set(recipes.map((r) => r.category).filter(Boolean))],
    [recipes]
  );

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.ingredients &&
          recipe.ingredients.some((ing) =>
            ing.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      const matchesCategory =
        !selectedCategory || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, selectedCategory]);

  const isUserRecipe = (id) => contextRecipes.some((r) => r.id === id && r.id > 3);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editRecipe(editingRecipe.id, editingRecipe);
    setEditingRecipe(null);
  };

  return (
    <div style={container}>
      <h1>🔍 Поиск Рецептов</h1>

      <div style={searchContainer}>
        <input
          type="text"
          placeholder="Поиск по названию или ингредиентам..."
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
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={resultsInfo}>Найдено рецептов: {filteredRecipes.length}</div>

      <div style={recipesGrid}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard recipe={recipe} />
              {isUserRecipe(recipe.id) && (
                <div style={actionRow}>
                  <button style={editBtn} onClick={() => setEditingRecipe({ ...recipe })}>✏️ Изменить</button>
                  <button style={delBtn} onClick={() => deleteRecipe(recipe.id)}>🗑️ Удалить</button>
                </div>
              )}
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
                onChange={(e) => setEditingRecipe({ ...editingRecipe, title: e.target.value })}
              />
              <input
                style={inp}
                placeholder="Категория"
                value={editingRecipe.category || ""}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
              />
              <input
                style={inp}
                type="number"
                placeholder="Время (мин)"
                value={editingRecipe.time || ""}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, time: e.target.value })}
              />
              <textarea
                style={{ ...inp, minHeight: "80px" }}
                placeholder="Описание"
                value={editingRecipe.description || ""}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
              />
              <input
                style={inp}
                placeholder="URL изображения"
                value={editingRecipe.image || ""}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={saveBtn}>💾 Сохранить</button>
                <button type="button" style={cancelBtn} onClick={() => setEditingRecipe(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const container = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };
const searchContainer = { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" };
const searchInput = { flex: 1, minWidth: "200px", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: "16px" };
const categorySelect = { padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg-input)", color: "var(--text-primary)", minWidth: "150px" };
const resultsInfo = { marginBottom: "20px", fontSize: "18px", color: "var(--text-secondary)" };
const recipesGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };
const noResults = { gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-secondary)" };
const actionRow = { display: "flex", gap: "8px", marginTop: "8px" };
const editBtn = { flex: 1, padding: "8px", background: "#3498db", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const delBtn = { flex: 1, padding: "8px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const overlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 };
const modal = { background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", width: "100%", maxWidth: "500px", border: "1px solid var(--border)" };
const inp = { display: "block", width: "100%", marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", boxSizing: "border-box" };
const saveBtn = { flex: 1, padding: "10px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { flex: 1, padding: "10px", background: "#95a5a6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };