import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

function NavBar() {
  const { recipes, darkMode, toggleDarkMode } = useRecipes();
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, [location]);

  const handleAuthToggle = useCallback(() => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      localStorage.setItem("isAuthenticated", "false");
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const favCount = useMemo(() => recipes.filter((r) => r.liked).length, [recipes]);

  const linkStyle = useCallback(
    ({ isActive }) => ({
      marginRight: "22px",
      textDecoration: "none",
      color: isActive ? "var(--accent)" : "var(--text-primary)",
      borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
      paddingBottom: "6px",
      fontSize: "15px",
      fontWeight: isActive ? "700" : "500",
      transition: "color 0.2s, border-bottom 0.2s",
    }),
    []
  );

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        <span style={logoStyle}>🍳 RecipeBook</span>
      </div>

      <div style={linksStyle}>
        <NavLink to="/" style={linkStyle}>Главная</NavLink>
        <NavLink to="/recipes" style={linkStyle}>Рецепты</NavLink>
        <NavLink to="/favorites" style={linkStyle}>
          Избранное {favCount > 0 && <span style={badgeStyle}>{favCount}</span>}
        </NavLink>
        <NavLink to="/reviews" style={linkStyle}>Отзывы</NavLink>
        <NavLink to="/profile" style={linkStyle}>Профиль</NavLink>
      </div>

      <div style={actionsStyle}>
        <button onClick={handleAuthToggle} style={authButton}>
          {isAuthenticated ? "Logout" : "Login"}
        </button>
        {/* // Replace the button JSX: */}
<button
  onClick={toggleDarkMode}
  style={themeButton}
  onMouseOver={e => {
    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
    e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2)";
  }}
  onMouseOut={e => {
    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)";
  }}
>
  {darkMode ? "🌙" : "☀️"}
</button>
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "18px 24px",
  width: "100%",
  background: "var(--bg-secondary)",
  borderBottom: "1px solid var(--border)",
  boxShadow: "var(--shadow)",
  flexWrap: "wrap",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const brandStyle = {
  minWidth: "180px",
};

const logoStyle = {
  color: "var(--accent)",
  fontWeight: "800",
  fontSize: "18px",
};

const linksStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "12px",
};

const badgeStyle = {
  marginLeft: "8px",
  display: "inline-block",
  minWidth: "22px",
  borderRadius: "999px",
  background: "var(--accent)",
  color: "#fff",
  padding: "2px 8px",
  fontSize: "12px",
  textAlign: "center",
};

const actionsStyle = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const authButton = {
  color: "var(--text-primary)",
  background: "transparent",
  border: "1px solid var(--accent)",
  borderRadius: "999px",
  padding: "10px 16px",
  cursor: "pointer",
};

// Replace the themeButton style object:
const themeButton = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "999px",
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: "16px",
  color: "var(--text-primary)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
  transition: "background 0.2s, box-shadow 0.2s",
};

export default memo(NavBar);