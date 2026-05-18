import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function AIAssistant() {
  const { recipes } = useRecipes();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I am your cooking assistant. Ask me about recipes, ingredients, quick meals, healthy food, or cooking tips.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getResponse = (query) => {
    const q = query.toLowerCase();

    const matched = recipes.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        (r.ingredients &&
          r.ingredients.some((ing) => ing.toLowerCase().includes(q)))
    );

    if (matched.length > 0) {
      const list = matched
        .slice(0, 3)
        .map((r) => {
          const time = r.time ? `⏱ ${r.time} min` : "";
          const category = r.category || "No category";
          return `📌 ${r.title} (${category}) ${time}`;
        })
        .join("\n");

      return `I found these recipes in your recipe book:\n${list}`;
    }

    if (q.includes("quick") || q.includes("fast") || q.includes("быстро")) {
      return "Quick meal ideas: omelette, pasta with tomato sauce, chicken wrap, salad bowl, or fried rice. Choose recipes with cooking time under 30 minutes.";
    }

    if (q.includes("healthy") || q.includes("полез")) {
      return "Healthy ideas: vegetable salad, grilled chicken, oatmeal with fruits, soup, or baked fish. Try to use less oil, more vegetables, and fresh ingredients.";
    }

    if (q.includes("chicken") || q.includes("куриц")) {
      return "With chicken you can cook: chicken soup, grilled chicken with rice, chicken salad, pasta with chicken, or chicken wrap.";
    }

    if (q.includes("egg") || q.includes("яйц")) {
      return "With eggs you can cook: omelette, boiled eggs, egg sandwich, shakshuka, pancakes, or fried rice with egg.";
    }

    if (q.includes("dessert") || q.includes("десерт")) {
      return "Dessert ideas: pancakes, fruit salad, chocolate cake, cookies, cheesecake, or yogurt with berries.";
    }

    if (q.includes("replace") || q.includes("substitute") || q.includes("замен")) {
      return "Common substitutions: milk can be replaced with yogurt or plant milk, butter with oil, sugar with honey, and sour cream with Greek yogurt.";
    }

    if (q.includes("tip") || q.includes("advice") || q.includes("совет")) {
      return "Cooking tips:\n• Read the full recipe before cooking\n• Prepare ingredients in advance\n• Taste food while cooking\n• Do not overcook pasta\n• Add salt gradually";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("привет")) {
      return "Hello! Ask me what to cook, how to replace ingredients, or how to make a recipe faster.";
    }

    return "I can help with recipe suggestions, ingredients, substitutions, quick meals, healthy ideas, and cooking tips. Try asking: 'What can I cook with eggs?' or 'Give me a quick dinner idea'.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const reply = getResponse(userText);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <button style={floatingButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "AI"}
      </button>

      {isOpen && (
        <div style={chatWindow}>
          <div style={chatHeader}>
            <div>
              <strong>AI Cooking Assistant</strong>
              <p style={subtitle}>Smart recipe helper</p>
            </div>
            <button style={closeBtn} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div style={chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={msg.role === "user" ? userMessage : assistantMessage}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            ))}

            {isLoading && <div style={assistantMessage}>Assistant is typing...</div>}
          </div>

          <div style={quickActions}>
            <button onClick={() => setInput("Give me a quick dinner idea")}>
              Quick dinner
            </button>
            <button onClick={() => setInput("Suggest healthy food")}>
              Healthy
            </button>
            <button onClick={() => setInput("Cooking tips")}>Tips</button>
          </div>

          <div style={inputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about recipes..."
              style={inputStyle}
            />
            <button onClick={handleSend} style={sendBtn}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const floatingButton = {
  position: "fixed",
  right: "24px",
  bottom: "24px",
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "none",
  background: "#e67e22",
  color: "#fff",
  fontSize: "20px",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  zIndex: 2000,
  transition: "0.3s ease",
};

const chatWindow = {
  position: "fixed",
  right: "24px",
  bottom: "100px",
  width: "360px",
  maxWidth: "calc(100vw - 40px)",
  height: "520px",
  background: "#ffffff",
  color: "#222",
  borderRadius: "22px",
  border: "1px solid #ddd",
  boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  overflow: "hidden",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
};

const chatHeader = {
  padding: "16px",
  background: "#e67e22",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const subtitle = {
  margin: "4px 0 0",
  fontSize: "12px",
  opacity: 0.9,
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
};

const chatBody = {
  flex: 1,
  padding: "14px",
  overflowY: "auto",
  background: "#f7f7f7",
};

const userMessage = {
  marginLeft: "auto",
  marginBottom: "10px",
  padding: "10px 12px",
  maxWidth: "80%",
  background: "#e67e22",
  color: "#fff",
  borderRadius: "14px 14px 0 14px",
  fontSize: "14px",
  lineHeight: 1.4,
};

const assistantMessage = {
  marginRight: "auto",
  marginBottom: "10px",
  padding: "10px 12px",
  maxWidth: "85%",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
  borderRadius: "14px 14px 14px 0",
  fontSize: "14px",
  lineHeight: 1.4,
};

const quickActions = {
  display: "flex",
  gap: "8px",
  padding: "10px",
  borderTop: "1px solid var(--border)",
};


const inputArea = {
  display: "flex",
  gap: "8px",
  padding: "12px",
  borderTop: "1px solid var(--border)",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
};

const sendBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "12px",
  background: "#e67e22",
  color: "#fff",
  cursor: "pointer",
};