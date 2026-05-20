import { useParams, Link, useLocation } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

export default function RecipeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const recipe =
    location.state?.recipe ||
    recipes.find(
        (item) =>
            String(item.id) === String(id) ||
        String(item.idMeal) === String(id)
  );
    const { recipes } = useRecipes();
    
  if (!recipe) {
    return (
      <div style={styles.notFound}>
        <h1>Recipe not found</h1>
        <p>This recipe does not exist or was deleted.</p>
        <Link to="/recipes" style={styles.backBtn}>Go back to recipes</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Link to="/recipes" style={styles.backLink}>← Back to recipes</Link>

      <div style={styles.card}>
        <img
          src={recipe.image || "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg"}
          alt={recipe.title}
          style={styles.image}
        />

        <div style={styles.content}>
          <p style={styles.category}>{recipe.category || "Без категории"}</p>
          <h1>{recipe.title}</h1>

          <div style={styles.infoRow}>
            <span>⭐ Rating: {recipe.rating || "4.8"}</span>
            <span>⏱ Time: {recipe.time || "—"} min</span>
          </div>

          <p style={styles.description}>
            {recipe.description || "No description available."}
          </p>

          <h2>Ingredients</h2>
          <ul>
            {(recipe.ingredients || ["Ingredient 1", "Ingredient 2", "Ingredient 3"]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <p>
            {recipe.instructions || "Step by step cooking instructions will be shown here."}
          </p>

          <h2>Reviews</h2>
          <div style={styles.review}>
            <strong>Aziza</strong>
            <p>Very tasty recipe! Easy to cook and useful for everyday meals.</p>
          </div>

          <div style={styles.review}>
            <strong>Asyl</strong>
            <p>I liked the ingredients and simple preparation steps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: "700",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr 1.3fr",
    gap: "30px",
    background: "var(--bg-card)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
  },
  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "20px",
  },
  content: {
    color: "var(--text-primary)",
    lineHeight: 1.6,
  },
  category: {
    color: "var(--accent)",
    fontWeight: "700",
  },
  infoRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    margin: "15px 0",
    color: "var(--text-secondary)",
    fontWeight: "600",
  },
  description: {
    marginBottom: "20px",
  },
  review: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "14px",
    marginTop: "12px",
    border: "1px solid var(--border)",
  },
  notFound: {
    textAlign: "center",
    padding: "80px 20px",
  },
  backBtn: {
    display: "inline-block",
    marginTop: "20px",
    background: "var(--accent)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "12px",
    textDecoration: "none",
  },
};