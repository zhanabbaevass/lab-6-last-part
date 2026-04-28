import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleEditRecipe = (recipe) => {
    navigate(`/edit-recipe/${recipe.id}`);
  };

  return (
    <div>
      <h1>❤️ Избранные рецепты</h1>
      {favorites.length === 0 ? (
        <p style={{ color: "#999", marginTop: "20px" }}>
          Вы ещё не добавили рецепты в избранное. Нажмите 🤍 на карточке!
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "20px" }}>
          {favorites.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => handleEditRecipe(r)} />)}
        </div>
      )}
    </div>
  );
}