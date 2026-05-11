import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useFilter } from "../hooks/useFilter";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import RecipeStats from "../components/RecipeStats";
import RecipeForm from "../components/RecipeForm";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export default function Recipes() {
  const { data, loading, error, refetch } = useFetch(API_URL);
  const { recipes: contextRecipes } = useRecipes();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

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

  const { filtered, search, setSearch, category, setCategory } = useFilter(recipes);

  const handleSearch = useCallback((e) => setSearch(e.target.value), [setSearch]);
  const handleCategory = useCallback((e) => setCategory(e.target.value), [setCategory]);
  const handleEditRecipe = useCallback((recipe) => {
    navigate(`/edit-recipe/${recipe.id}`);
  }, [navigate]);

  return (
    <div className="page-enter" style={pageStyle}>

      {/* Top bar */}
      <div style={topBarStyle}>
        <div>
          <h1 style={{ marginBottom: "4px" }}>📖 Рецепты</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            {filtered.length} рецептов найдено
          </p>
        </div>
        <button
          className="btn-accent"
          onClick={() => setShowForm(true)}
        >
          ➕ Добавить рецепт
        </button>
      </div>

      <RecipeStats />

      {/* Search + filter bar */}
      <div style={filterBarStyle}>
        <input
          placeholder="🔍 Поиск по названию..."
          value={search}
          onChange={handleSearch}
          style={searchInputStyle}
          onFocus={e => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.4)";
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)";
          }}
          onBlur={e => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.12)";
          }}
        />
        <div style={{ position: "relative", display: "inline-block" }}>
          <select value={category} onChange={handleCategory} style={selectStyle}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span style={dropArrowStyle}>▾</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={loadingWrapStyle}>
          <div style={spinnerStyle} />
          <p style={{ color: "var(--text-secondary)", marginTop: "16px" }}>Загрузка рецептов...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={errorBoxStyle}>
          <span>⚠️ Ошибка загрузки: {error}</span>
          <button onClick={refetch} style={retryBtnStyle}>Повторить</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={emptyStyle}>
          <span style={{ fontSize: "48px" }}>🍽️</span>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Рецепты не найдены</p>
        </div>
      )}

      {/* Grid */}
      <div className={gridStyle}>
        {filtered.map((r) => (
          <RecipeCard key={r.id} recipe={r} onClick={() => handleEditRecipe(r)} />
        ))}
      </div>

      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

const pageStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 24px 80px",
};

const topBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "16px",
};

const filterBarStyle = {
  display: "flex",
  gap: "12px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const glassField = {
  padding: "10px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  color: "var(--text-primary)",
  fontSize: "15px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginTop: "24px",
};

const searchInputStyle = {
  ...glassField,
  flex: 1,
  minWidth: "200px",
};

const selectStyle = {
  ...glassField,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: "36px",
};

const dropArrowStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "var(--text-secondary)",
  fontSize: "12px",
};

const loadingWrapStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "60px",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid rgba(230,126,34,0.2)",
  borderTop: "3px solid var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const errorBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#ff6b6b",
  background: "rgba(255,107,107,0.08)",
  border: "1px solid rgba(255,107,107,0.25)",
  borderRadius: "12px",
  padding: "16px 20px",
  marginTop: "16px",
  flexWrap: "wrap",
};

const retryBtnStyle = {
  padding: "6px 16px",
  background: "#ff6b6b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};

const emptyStyle = {
  textAlign: "center",
  marginTop: "60px",
  padding: "40px",
};