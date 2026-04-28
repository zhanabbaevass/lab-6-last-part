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
        <span style={logoStyle}>🍽️ RecipeBook</span>
      </div>

      <div style={linksStyle}>
        <NavLink to="/" style={linkStyle}>Главная</NavLink>
        <NavLink to="/recipes" style={linkStyle}>Рецепты</NavLink>
        <NavLink to="/search" style={linkStyle}>Поиск</NavLink>
        <NavLink to="/add-recipe" style={linkStyle}>Добавить</NavLink>
        <NavLink to="/favorites" style={linkStyle}>
          Избранное {favCount > 0 && <span style={badgeStyle}>{favCount}</span>}
        </NavLink>
        <NavLink to="/reviews" style={linkStyle}>Отзывы</NavLink>
        <NavLink to="/profile" style={linkStyle}>Профиль</NavLink>
        <NavLink to="/ai-assistant" style={linkStyle}>AI Ассистент</NavLink>
      </div>

      <div style={actionsStyle}>
        <button onClick={handleAuthToggle} style={authButton}>
          {isAuthenticated ? "Logout" : "Login"}
        </button>
        <button onClick={toggleDarkMode} style={themeButton}>
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

const themeButton = {
  color: "#fff",
  background: "var(--accent)",
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  cursor: "pointer",
};

export default memo(NavBar);
