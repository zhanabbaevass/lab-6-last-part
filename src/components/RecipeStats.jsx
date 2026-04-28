import { memo, useMemo } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function RecipeStats() {
  const { recipes } = useRecipes();
  const categories = useMemo(
    () => [...new Set(recipes.map((r) => r.category).filter(Boolean))],
    [recipes]
  );

  const avgTime = useMemo(
    () => (recipes.length ? Math.round(recipes.reduce((sum, r) => sum + Number(r.time || 0), 0) / recipes.length) : 0),
    [recipes]
  );

  return (
    <div style={statsWrapper}>
      <StatBox label="Всего рецептов" value={recipes.length} color="#e67e22" />
      <StatBox label="Категорий" value={categories.length} color="#9b59b6" />
      <StatBox label="Среднее время" value={`${avgTime} мин`} color="#e67e22" />
    </div>
  );
}

const statsWrapper = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const statBox = {
  color: "#fff",
  padding: "18px 24px",
  borderRadius: "var(--radius)",
  textAlign: "center",
  minWidth: "140px",
  boxShadow: "var(--shadow)",
};

const statValue = {
  fontSize: "28px",
  fontWeight: "700",
};

const statLabel = {
  fontSize: "13px",
  marginTop: "6px",
};

const StatBox = memo(function StatBox({ label, value, color }) {
  return (
    <div style={{ ...statBox, background: color }}>
      <div style={statValue}>{value}</div>
      <div style={statLabel}>{label}</div>
    </div>
  );
});