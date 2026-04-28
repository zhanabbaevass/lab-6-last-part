import { memo } from "react";

function RecipeList({ items = [], loading = false, error = "", render }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
        Загрузка рецептов... ⏳
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "#ff6b6b" }}>
        Ошибка: {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
        Рецепты не найдены.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
      {items.map((item) => render(item))}
    </div>
  );
}

export default memo(RecipeList);
