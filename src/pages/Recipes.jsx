import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useFilter } from "../hooks/useFilter";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import RecipeStats from "../components/RecipeStats";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export default function Recipes() {
  const { data, loading, error, refetch } = useFetch(API_URL);
  const { recipes: contextRecipes } = useRecipes();
  const navigate = useNavigate();

  const apiRecipes = useMemo(() => {
    if (!data || !data.meals) return [];
    return data.meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      description: meal.strInstructions,
      image: meal.strMealThumb,
    }));
  }, [data]);

  const recipes = useMemo(() => {
    const userRecipes = contextRecipes.filter((r) => r.id > 3);
    return [...apiRecipes, ...userRecipes];
  }, [apiRecipes, contextRecipes]);

  const categories = useMemo(() => {
    const cats = recipes.map((r) => r.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [recipes]);

  const {
    filtered,
    search, setSearch,
    category, setCategory,
  } = useFilter(recipes);

  const handleSearch = useCallback((e) => setSearch(e.target.value), [setSearch]);
  const handleCategory = useCallback((e) => setCategory(e.target.value), [setCategory]);
  const handleEditRecipe = useCallback((recipe) => {
    navigate(`/edit-recipe/${recipe.id}`);
  }, [navigate]);

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#16213e",
    color: "#eee",
    cursor: "pointer",
  };

  return (
    <div>
      <h1>📖 Книга рецептов</h1>
      <RecipeStats />

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          placeholder="🔍 Поиск по названию..."
          value={search}
          onChange={handleSearch}
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #444", background: "#16213e", color: "#eee", minWidth: "200px" }}
        />
        <select value={category} onChange={handleCategory} style={selectStyle}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p>Загрузка рецептов... ⏳</p>}
      {error && (
        <div style={{ color: "red" }}>
          Ошибка загрузки: {error} <button onClick={refetch}>Попробовать ещё раз</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && <p style={{ color: "#999" }}>Рецепты не найдены</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filtered.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => handleEditRecipe(r)} />)}
      </div>
    </div>
  );
}