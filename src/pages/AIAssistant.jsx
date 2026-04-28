import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function AIAssistant() {
  const { recipes } = useRecipes();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я ваш кулинарный помощник с ИИ. Спросите меня о рецептах, советах по приготовлению или ингредиентах. Я могу рекомендовать рецепты из вашей книги или создать новые!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await getAIResponse(input);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  const getAIResponse = async (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if user is asking about existing recipes
    if (lowerQuery.includes("рецепт") || lowerQuery.includes("recipe")) {
      const matchingRecipes = recipes.filter(r => 
        r.title.toLowerCase().includes(lowerQuery) || 
        r.category.toLowerCase().includes(lowerQuery) ||
        r.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
      );
      
      if (matchingRecipes.length > 0) {
        const recipeList = matchingRecipes.slice(0, 3).map(r => `${r.title} (${r.category})`).join(", ");
        return `Из вашей книги рецептов: ${recipeList}. Хотите подробности о каком-то из них?`;
      }
    }

    // For other queries, use AI API
    try {
      const recipeContext = recipes.length > 0 ? 
        `Доступные рецепты: ${recipes.map(r => r.title).join(", ")}. ` : "";
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: `Вы - полезный кулинарный помощник. Предоставляйте рецепты, советы и советы по приготовлению. ${recipeContext}Отвечайте на русском языке.` },
            { role: "user", content: query }
          ],
          max_tokens: 200,
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI API error:", error);
      return "Извините, я не смог обработать ваш запрос прямо сейчас. Попробуйте позже.";
    }
  };

  return (
    <div style={container}>
      <h1>🤖 AI Кулинарный Ассистент</h1>
      <div style={chatContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === "user" ? userMessage : assistantMessage}>
            <strong>{msg.role === "user" ? "Вы:" : "Ассистент:"}</strong> {msg.content}
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

const container = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
  color: "var(--text-primary)",
};

const chatContainer = {
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "10px",
  height: "400px",
  overflowY: "auto",
  background: "var(--bg-card)",
  marginBottom: "20px",
};

const userMessage = {
  marginBottom: "10px",
  textAlign: "right",
  color: "#e67e22",
};

const assistantMessage = {
  marginBottom: "10px",
  color: "var(--text-primary)",
};

const loadingMessage = {
  marginBottom: "10px",
  color: "#999",
  fontStyle: "italic",
};

const inputContainer = {
  display: "flex",
  gap: "10px",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
};

const buttonStyle = {
  padding: "10px 20px",
  background: "#e67e22",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
};