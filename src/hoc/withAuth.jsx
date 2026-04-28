import { useMemo } from "react";

function withAuth(Component) {
  return function WithAuth(props) {
    const isAuthenticated = useMemo(() => {
      return localStorage.getItem("isAuthenticated") === "true";
    }, []);

    if (!isAuthenticated) {
      return (
        <div style={{
          padding: "24px",
          color: "var(--text-primary)",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          textAlign: "center",
          maxWidth: "520px",
          margin: "40px auto",
        }}>
          <h2>Доступ запрещен</h2> 
          <p>Вы не авторизованы для просмотра этой страницы.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default withAuth;
