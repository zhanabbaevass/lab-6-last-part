import { useRecipes } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { recipes, resetRecipes } = useRecipes();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";


  return (
    <div className="page-enter" style={pageStyle}>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={emojiStyle}>🍳</div>
        <h1 className="gradient-text" style={{ marginBottom: "16px" }}>
          Recipe Book
        </h1>
        <p style={subtitleStyle}>
          Твоя личная коллекция рецептов — храни, находи и готовь с удовольствием
        </p>

        <div style={ctaRowStyle}>
          {isAuthenticated ? (
            <button
              className="btn-accent"
              onClick={() => navigate("/recipes")}
            >
              Перейти к рецептам →
            </button>
          ) : (
            <>
              <button
                style={authNoteStyle}
                className="btn-accent"
                onClick={() => navigate("/login", { state: { from: { pathname: "/recipes" } } })}
              >
                Войдите, чтобы просматривать рецепты
              </button>
            </>
          )}
        </div>

      </div>

      {/* Feature cards */}
      <div style={featureGridStyle}>
        {[
          { icon: "🔍", title: "Поиск", desc: "Быстрый поиск по названию и категории прямо на странице рецептов" },
          { icon: "❤️", title: "Избранное", desc: "Сохраняй любимые рецепты и возвращайся к ним в любой момент" },
          { icon: "✏️", title: "Свои рецепты", desc: "Добавляй собственные рецепты и редактируй их когда угодно" },
          { icon: "🤖", title: "AI Ассистент", desc: "Получай советы и идеи для готовки от встроенного ИИ" },
        ].map((f) => (
          <div key={f.title} className="glass card-hover" style={featureCardStyle}>
            <span style={featureIconStyle}>{f.icon}</span>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>{f.title}</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


const pageStyle = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "20px 24px",        // was 60px top, 80px bottom
};

const heroStyle = {
  textAlign: "center",
  marginBottom: "24px",        // was 56px
};

const emojiStyle = {
  fontSize: "48px",            // was 72px
  marginBottom: "10px",
  display: "block",
  filter: "drop-shadow(0 8px 24px rgba(230,126,34,0.4))",
};
const authNoteStyle = {
  color: "var(--text-primary)",
  background: "transparent",
  border: "1px solid var(--accent)",
  borderRadius: "999px",
  padding: "10px 16px",
  cursor: "pointer",
};
const subtitleStyle = {
  fontSize: "15px",            // was 18px
  color: "var(--text-secondary)",
  maxWidth: "480px",
  margin: "0 auto 20px",      // was 36px
  lineHeight: 1.6,
};

const ctaRowStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const statsRowStyle = {
  display: "flex",
  gap: "16px",                 // was 20px
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: "24px",        // was 56px
};

const statCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  padding: "16px 28px",        // was 28px 36px
  minWidth: "110px",
};

const statIconStyle = {
  fontSize: "20px",            // was 28px
};

const statValueStyle = {
  fontSize: "28px",            // was 36px
  fontWeight: "800",
  color: "var(--accent)",
  fontFamily: "'DM Serif Display', serif",
};

const statLabelStyle = {
  fontSize: "11px",
  color: "var(--text-secondary)",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const featureGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",   // force 4 columns in one row
  gap: "14px",                              // was 20px
  marginBottom: "16px",
};

const featureCardStyle = {
  padding: "18px 16px",        // was 28px 24px
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const featureIconStyle = {
  fontSize: "22px",            // was 32px
  marginBottom: "4px",
};