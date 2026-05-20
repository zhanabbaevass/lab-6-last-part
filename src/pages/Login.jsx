import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_7oeo66p";
const EMAILJS_TEMPLATE_ID = "template_vrr42pi";
const EMAILJS_PUBLIC_KEY = "xqB8np1J_S_eGrE1w";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useRecipes();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      const destination = location.state?.from?.pathname || "/recipes";
      navigate(destination, { replace: true });
    }
  }, [navigate, location]);

  const sendCode = async (userEmail) => {
    const code = generateCode();
    localStorage.setItem("temp2fa", code);

    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { code, to_email: userEmail },
        EMAILJS_PUBLIC_KEY
      );
      addNotification("Код отправлен на вашу почту!", "info");
    } catch (err) {
      // Fallback — показываем код в уведомлении если emailjs не сработал
      addNotification(`Ошибка отправки. Код (демо): ${code}`, "info");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");

      if (!showTwoFactor) {
        if (!email.trim() || !password.trim()) {
          setError("Пожалуйста, введите email и пароль.");
          return;
        }
        await sendCode(email);
        setShowTwoFactor(true);
        return;
      }

      if (!twoFactorCode.trim()) {
        setError("Пожалуйста, введите код подтверждения.");
        return;
      }

      const expectedCode = localStorage.getItem("temp2fa");
      if (twoFactorCode !== expectedCode) {
        setError("Неверный код подтверждения.");
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.removeItem("temp2fa");
      addNotification("Вы успешно вошли в систему", "success");

      const destination = location.state?.from?.pathname || "/recipes";
      navigate(destination, { replace: true });
    },
    [email, password, twoFactorCode, showTwoFactor, addNotification, navigate, location]
  );

  return (
    <div style={loginWrapper}>
      <div style={loginCard}>
        <h1>Вход в аккаунт</h1>
        <p style={subtitle}>Введите учётные данные, чтобы открыть страницу рецептов.</p>
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
                <p>📧 Код отправлен на <strong>{email}</strong></p>
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
          <button type="submit" style={submitBtn} disabled={sending}>
            {sending ? "Отправка..." : showTwoFactor ? "Подтвердить" : "Войти"}
          </button>
          {showTwoFactor && (
            <>
              <button
                type="button"
                onClick={() => { setShowTwoFactor(false); setTwoFactorCode(""); }}
                style={backBtn}
              >
                Назад
              </button>
              <button
                type="button"
                onClick={() => sendCode(email)}
                style={backBtn}
                disabled={sending}
              >
                {sending ? "Отправка..." : "Отправить код повторно"}
              </button>
            </>
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
  color: "#ffffff",
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