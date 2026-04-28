import { useEffect } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function Toast() {
  const { notifications, removeNotification } = useRecipes();

  useEffect(() => {
    const timers = notifications.map((item) => {
      const timer = setTimeout(() => removeNotification(item.id), 3000);
      return timer;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [notifications, removeNotification]);

  if (!notifications.length) return null;

  return (
    <div style={{
      position: "fixed",
      right: "18px",
      bottom: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      zIndex: 2000,
      maxWidth: "320px"
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: notification.type === "success" ? "#2ecc71" : "#ff6b6b",
            color: "#fff",
            padding: "14px 18px",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            borderLeft: `4px solid ${notification.type === "success" ? "#27ae60" : "#c0392b"}`,
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
