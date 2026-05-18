import { createContext, useContext, memo } from "react";
import { useRecipes } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";

const RecipeCardContext = createContext(null);

function RecipeCard({ recipe, children, onClick }) {
  const { deleteRecipe, toggleLike } = useRecipes();
  const navigate = useNavigate();

  const isUserCreated = recipe.isUserCreated || Number(recipe.id) > 3;

  const defaultCard = (
    <>
      <Header />
      <Body />
      <Footer
        isUserCreated={isUserCreated}
        onFavorite={() => toggleLike(recipe.id || recipe.idMeal)}
        onDelete={() => deleteRecipe(recipe.id)}
        onDetails={() =>
          navigate(`/recipe/${recipe.id || recipe.idMeal}`, {
            state: { recipe },
          })
        }
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
  const imageUrl =
    recipe.image ||
    "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg";

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
      <p style={descriptionStyle}>
        {description.length === 100 ? `${description}...` : description}
      </p>
    </div>
  );
});

const Footer = memo(function Footer({
  onFavorite,
  onDelete,
  onDetails,
  isUserCreated,
}) {
  const recipe = useContext(RecipeCardContext);

  return (
    <div style={footerStyle}>
      <div style={metaRow}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          style={favoriteBtn}
        >
          {recipe.liked ? "❤️ Favorite" : "🤍 Favorite"}
        </button>

        <span style={timeStyle}>⏱ {recipe.time || "—"} min</span>
      </div>

      <div style={actionRow}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetails();
          }}
          style={detailsBtn}
        >
          Details
        </button>

        {isUserCreated && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={deleteBtn}
          >
            Delete
          </button>
        )}
      </div>
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
  borderRadius: "18px",
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
  background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.65))",
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
  padding: "18px 18px 10px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
  minHeight: "125px",
};

const categoryStyle = {
  color: "var(--accent)",
  fontWeight: "700",
  marginBottom: "10px",
};

const descriptionStyle = {
  color: "var(--text-primary)",
  margin: 0,
};

const footerStyle = {
  padding: "0 18px 18px",
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "12px",
};

const actionRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const favoriteBtn = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: "700",
};

const detailsBtn = {
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "11px 14px",
  cursor: "pointer",
  fontWeight: "700",
};

const deleteBtn = {
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "11px 14px",
  cursor: "pointer",
  fontWeight: "700",
};

const timeStyle = {
  color: "var(--text-secondary)",
  fontWeight: "700",
  whiteSpace: "nowrap",
};