import { useRecipes } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { recipes, resetRecipes } = useRecipes();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "0 20px" }}>
      <div style={{ fontSize: "80px", marginBottom: "16px" }}>🍳</div>
      <h1 style={{
        fontSize: "48px",
        background: "linear-gradient(90deg, #e67e22, #f39c12)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "16px"
      }}>
        Recipe Book
      </h1>
      <p style={{ color: "#aaa", fontSize: "18px", marginBottom: "8px" }}>
        Твоя личная коллекция рецептов
      </p>
      <p style={{ color: "#eee", fontSize: "22px", marginBottom: "40px" }}>
        Сохранено рецептов: <strong style={{ color: "#e67e22" }}>{recipes.length}</strong>
      </p>
      <button
        onClick={() => navigate("/recipes")}
        style={{
          padding: "14px 36px",
          background: "linear-gradient(90deg, #e67e22, #f39c12)",
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          fontSize: "18px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(230,126,34,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseOver={e => e.target.style.transform = "scale(1.05)"}
        onMouseOut={e => e.target.style.transform = "scale(1)"}
      >
        Перейти к рецептам →
      </button>
      
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={resetRecipes}
          style={{
            padding: "10px 20px",
            background: "#95a5a6",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontSize: "14px",
            cursor: "pointer",
            opacity: 0.8,
          }}
          onMouseOver={e => e.target.style.opacity = "1"}
          onMouseOut={e => e.target.style.opacity = "0.8"}
        >
          🔄 Сбросить рецепты (для обновления)
        </button>
      </div>
    </div>
  );
}