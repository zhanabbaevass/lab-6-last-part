import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

export default function Login() {
  const navigate = useNavigate();
  const { addNotification } = useRecipes();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setError("");

      if (!showTwoFactor) {
        if (!email.trim() || !password.trim()) {
          setError("Пожалуйста, введите email и пароль.");
          return;
        }
        // Simulate sending 2FA code - in real app, this would send to email/SMS
        const mockCode = "123456"; // Demo code
        localStorage.setItem("temp2fa", mockCode);
        setShowTwoFactor(true);
        addNotification(`Код подтверждения: ${mockCode} (демо)`, "info");
        return;
      }

      if (!twoFactorCode.trim()) {
        setError("Пожалуйста, введите код подтверждения.");
        return;
      }

      // Check against stored demo code
      const expectedCode = localStorage.getItem("temp2fa");
      if (twoFactorCode !== expectedCode) {
        setError("Неверный код подтверждения.");
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      addNotification("Вы успешно вошли в систему", "success");
      navigate("/profile", { replace: true });
    },
    [email, password, twoFactorCode, showTwoFactor, addNotification, navigate]
  );

  return (
    <div style={loginWrapper}>
      <div style={loginCard}>
        <h1>Вход в аккаунт</h1>
        <p style={subtitle}>Введите учётные данные, чтобы открыть страницу профиля.</p>
        <form onSubmit={handleSubmit} style={loginForm}>
          {!showTwoFactor ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={fieldStyle}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={fieldStyle}
              />
            </>
          ) : (
            <>
              <div style={twoFactorInfo}>
                <p>Код подтверждения отправлен на {email}</p>
                <p>Введите 6-значный код:</p>
              </div>
              <input
                type="text"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                style={fieldStyle}
                maxLength="6"
              />
            </>
          )}
          {error && <div style={errorStyle}>{error}</div>}
          <button type="submit" style={submitBtn}>
            {showTwoFactor ? "Подтвердить" : "Войти"}
          </button>
          {showTwoFactor && (
            <button
              type="button"
              onClick={() => setShowTwoFactor(false)}
              style={backBtn}
            >
              Назад
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

const loginWrapper = {
  minHeight: "70vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const loginCard = {
  width: "100%",
  maxWidth: "420px",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "32px",
  boxShadow: "var(--shadow)",
};

const subtitle = {
  color: "var(--text-secondary)",
  marginBottom: "24px",
};

const loginForm = {
  display: "grid",
  gap: "16px",
};

const fieldStyle = {
  padding: "14px 16px",
  borderRadius: "var(--radius)",
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
};

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "14px",
  textAlign: "center",
};

const submitBtn = {
  padding: "14px 18px",
  borderRadius: "var(--radius)",
  border: "none",
  background: "var(--accent)",
  color: "#e19302",
  fontWeight: "700",
  cursor: "pointer",
};

const twoFactorInfo = {
  textAlign: "center",
  marginBottom: "16px",
  color: "var(--text-secondary)",
  fontSize: "14px",
};

const backBtn = {
  width: "100%",
  padding: "12px",
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "16px",
};
