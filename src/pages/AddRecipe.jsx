import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

export default function AddRecipe() {
  const { addRecipe, addNotification } = useRecipes();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    time: "",
    servings: "",
    ingredients: [""],
    instructions: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.instructions) {
      addNotification("Пожалуйста, заполните обязательные поля", "error");
      return;
    }

    const newRecipe = {
      id: Date.now(),
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
      liked: false,
      time: Number(formData.time) || 0,
      servings: Number(formData.servings) || 1,
    };

    addRecipe(newRecipe);
    addNotification("Рецепт добавлен успешно!", "success");
    navigate("/recipes");
  };

  return (
    <div style={container}>
      <h1>➕ Добавить Рецепт</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Название рецепта *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldRow}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Категория *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={selectStyle}
              required
            >
              <option value="">Выберите категорию</option>
              <option value="Завтрак">Завтрак</option>
              <option value="Обед">Обед</option>
              <option value="Ужин">Ужин</option>
              <option value="Десерт">Десерт</option>
              <option value="Салат">Салат</option>
              <option value="Суп">Суп</option>
            </select>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Время приготовления (мин)</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              style={inputStyle}
              min="1"
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Порции</label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              style={inputStyle}
              min="1"
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Ингредиенты *</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={ingredientRow}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Например: 200г муки"
                style={inputStyle}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  style={removeButton}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIngredient} style={addButton}>
            + Добавить ингредиент
          </button>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Инструкции приготовления *</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            style={textareaStyle}
            placeholder="Опишите шаги приготовления..."
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>URL изображения</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div style={buttonGroup}>
          <button type="submit" style={submitButton}>Добавить рецепт</button>
          <button type="button" onClick={() => navigate("/recipes")} style={cancelButton}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

const container = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
};

const formStyle = {
  background: "var(--bg-card)",
  padding: "30px",
  borderRadius: "var(--radius)",
  border: "1px solid var(--border)",
};

const fieldGroup = {
  marginBottom: "20px",
};

const fieldRow = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "600",
  color: "var(--text-primary)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontSize: "16px",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
};

const ingredientRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "10px",
};

const removeButton = {
  padding: "10px",
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "16px",
};

const addButton = {
  padding: "10px 15px",
  background: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "14px",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

const submitButton = {
  padding: "12px 24px",
  background: "#e67e22",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};

const cancelButton = {
  padding: "12px 24px",
  background: "#95a5a6",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "16px",
};