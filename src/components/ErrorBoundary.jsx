import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--text-primary)",
          background: "var(--bg-card)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          maxWidth: "600px",
          margin: "40px auto"
        }}>
          <h2>Упс! Что-то пошло не так.</h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            Пожалуйста, попробуйте обновить страницу или повторите действие.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            Повторить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
