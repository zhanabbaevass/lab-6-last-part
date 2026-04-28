import { createContext, useContext, memo } from "react";
import { useRecipes } from "../context/RecipeContext";

const RecipeCardContext = createContext(null);

function RecipeCard({ recipe, children, onClick }) {
  const { deleteRecipe, toggleLike } = useRecipes();

  const defaultCard = (
    <>
      <Header />
      <Body />
      <Footer
        onFavorite={() => toggleLike(recipe.id)}
        onDelete={() => deleteRecipe(recipe.id)}
      />
    </>
  );

  return (
    <article
      style={{ ...cardStyle, cursor: onClick ? "pointer" : "default" }}
      data-testid="recipe-card"
      onClick={onClick}
    >
      <RecipeCardContext.Provider value={recipe}>
        {children || defaultCard}
      </RecipeCardContext.Provider>
    </article>
  );
}

const Header = memo(function Header() {
  const recipe = useContext(RecipeCardContext);
  const imageUrl = recipe.image || "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg";

  return (
    <div style={headerStyle}>
      <div style={{ ...imageStyle, backgroundImage: `url(${imageUrl})` }}>
        <div style={imageOverlay} />
        <div style={headerText}>
          <h3>{recipe.title}</h3>
        </div>
      </div>
    </div>
  );
});

const Body = memo(function Body() {
  const recipe = useContext(RecipeCardContext);
  const description = recipe.description ? recipe.description.slice(0, 100) : "";

  return (
    <div style={bodyStyle}>
      <p style={categoryStyle}>{recipe.category || "Без категории"}</p>
      <p>{description.length === 100 ? `${description}...` : description}</p>
    </div>
  );
});

const Footer = memo(function Footer({ onFavorite, onDelete }) {
  const recipe = useContext(RecipeCardContext);

  return (
    <div style={footerStyle}>
      <button
        onClick={(e) => { e.stopPropagation(); onFavorite(); }}
        style={favoriteBtn}
      >
        {recipe.liked ? "❤️ Избранное" : "🤍 В избранное"}
      </button>
      <span style={timeStyle}>⏱ {recipe.time || "—"} мин</span>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={deleteBtn}
        >
          🗑️
        </button>
      )}
    </div>
  );
});

const MemoizedRecipeCard = memo(RecipeCard);

MemoizedRecipeCard.Header = Header;
MemoizedRecipeCard.Body = Body;
MemoizedRecipeCard.Footer = Footer;

export default MemoizedRecipeCard;

const cardStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
};

const headerStyle = {
  position: "relative",
  height: "200px",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const imageOverlay = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
};

const headerText = {
  position: "absolute",
  bottom: "16px",
  left: "16px",
  right: "16px",
  color: "#fff",
  textShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

const bodyStyle = {
  padding: "18px 18px 12px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
};

const categoryStyle = {
  color: "var(--accent)",
  fontWeight: "700",
  marginBottom: "10px",
};

const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 18px 18px",
  gap: "12px",
  flexWrap: "wrap",
};

const favoriteBtn = {
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  flex: "1 1 auto",
};

const deleteBtn = {
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "16px",
};

const timeStyle = {
  color: "var(--text-secondary)",
  fontWeight: "600",
};