import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function AIAssistant() {
  const { recipes } = useRecipes();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я ваш кулинарный помощник. Спросите меня о рецептах, ингредиентах или советах по приготовлению!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getResponse = (query) => {
    const q = query.toLowerCase();

    // Поиск по рецептам
    const matched = recipes.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q) ||
      (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(q)))
    );

    if (matched.length > 0) {
      const list = matched.slice(0, 3).map(r => {
        const ings = r.ingredients?.join(", ") || "не указаны";
        const time = r.time ? `⏱ ${r.time} мин` : "";
        return `📌 **${r.title}** (${r.category}) ${time}\nИнгредиенты: ${ings}`;
      }).join("\n\n");
      return `Нашла подходящие рецепты:\n\n${list}`;
    }

    // Советы по приготовлению
    if (q.includes("совет") || q.includes("как") || q.includes("помог")) {
      return "Вот несколько общих советов:\n• Всегда читайте рецепт до конца перед началом\n• Подготовьте все ингредиенты заранее\n• Солите блюда в конце приготовления\n• Используйте свежие продукты для лучшего вкуса";
    }

    if (q.includes("привет") || q.includes("здравствуй")) {
      return "Привет! Чем могу помочь? Спросите меня о рецептах или советах по приготовлению 🍳";
    }

    if (q.includes("список") || q.includes("все рецепты") || q.includes("что есть")) {
      if (recipes.length === 0) return "Ваша книга рецептов пока пуста. Добавьте рецепты через вкладку Добавить!";
      const list = recipes.map(r => `• ${r.title} (${r.category})`).join("\n");
      return `В вашей книге рецептов:\n${list}`;
    }

    if (q.includes("категори") || q.includes("обед") || q.includes("ужин") || q.includes("завтрак")) {
      const cats = [...new Set(recipes.map(r => r.category).filter(Boolean))];
      if (cats.length === 0) return "Категории пока не заданы.";
      return `Категории в вашей книге: ${cats.join(", ")}`;
    }

    return "Я не совсем поняла вопрос 😊 Попробуйте спросить:\n• 'Покажи все рецепты'\n• 'Рецепты с курицей'\n• 'Что на обед?'\n• 'Дай советы по приготовлению'";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const reply = getResponse(input);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div style={container}>
      <h1>🤖 AI Кулинарный Ассистент</h1>
      <div style={chatContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === "user" ? userMessage : assistantMessage}>
            <strong>{msg.role === "user" ? "Вы:" : "Ассистент:"}</strong>{" "}
            {msg.content.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </div>
        ))}
        {isLoading && <div style={loadingMessage}>Ассистент печатает...</div>}
      </div>
      <div style={inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Спросите о рецептах, ингредиентах или советах..."
          style={inputStyle}
          disabled={isLoading}
        />
        <button onClick={handleSend} style={buttonStyle} disabled={isLoading}>
          {isLoading ? "..." : "Отправить"}
        </button>
      </div>
    </div>
  );
}

const container = { maxWidth: "800px", margin: "0 auto", padding: "20px", color: "var(--text-primary)" };
const chatContainer = { border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px", height: "400px", overflowY: "auto", background: "var(--bg-card)", marginBottom: "20px" };
const userMessage = { marginBottom: "10px", textAlign: "right", color: "#e67e22" };
const assistantMessage = { marginBottom: "10px", color: "var(--text-primary)" };
const loadingMessage = { marginBottom: "10px", color: "#999", fontStyle: "italic" };
const inputContainer = { display: "flex", gap: "10px" };
const inputStyle = { flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg-input)", color: "var(--text-primary)" };
const buttonStyle = { padding: "10px 20px", background: "#e67e22", color: "#fff", border: "none", borderRadius: "var(--radius)", cursor: "pointer" };