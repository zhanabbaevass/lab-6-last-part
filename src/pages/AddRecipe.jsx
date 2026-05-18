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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const validIngredients = formData.ingredients.filter((ing) => ing.trim());

    if (!formData.title.trim()) {
      newErrors.title = "Recipe title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please choose a category";
    }

    if (formData.time && Number(formData.time) <= 0) {
      newErrors.time = "Cooking time must be positive";
    }

    if (validIngredients.length === 0) {
      newErrors.ingredients = "Add at least one ingredient";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    } else if (formData.instructions.trim().length < 10) {
      newErrors.instructions = "Instructions must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;

    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    setErrors((prev) => ({ ...prev, ingredients: "" }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification("Please fix the form errors", "error");
      return;
    }

    const newRecipe = {
      id: Date.now(),
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.trim()),
      liked: false,
      rating: 0,
      isUserCreated: true,
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

      <form onSubmit={handleSubmit} style={formStyle} noValidate>
        <div style={fieldGroup}>
          <label style={labelStyle}>Название рецепта *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.title ? "#e74c3c" : "var(--border)",
            }}
            placeholder="Например: Caesar Salad"
          />
          {errors.title && <p style={errorStyle}>{errors.title}</p>}
        </div>

        <div style={fieldRow}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Категория *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                ...selectStyle,
                borderColor: errors.category ? "#e74c3c" : "var(--border)",
              }}
            >
              <option value="">Выберите категорию</option>
              <option value="Завтрак">Завтрак</option>
              <option value="Обед">Обед</option>
              <option value="Ужин">Ужин</option>
              <option value="Десерт">Десерт</option>
              <option value="Салат">Салат</option>
              <option value="Суп">Суп</option>
            </select>
            {errors.category && <p style={errorStyle}>{errors.category}</p>}
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Время приготовления (мин)</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.time ? "#e74c3c" : "var(--border)",
              }}
              min="1"
              placeholder="30"
            />
            {errors.time && <p style={errorStyle}>{errors.time}</p>}
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
              placeholder="2"
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
                style={{
                  ...inputStyle,
                  borderColor: errors.ingredients ? "#e74c3c" : "var(--border)",
                }}
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

          {errors.ingredients && <p style={errorStyle}>{errors.ingredients}</p>}

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
            style={{
              ...textareaStyle,
              borderColor: errors.instructions ? "#e74c3c" : "var(--border)",
            }}
            placeholder="Опишите шаги приготовления..."
          />
          {errors.instructions && (
            <p style={errorStyle}>{errors.instructions}</p>
          )}
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

          {formData.image && (
            <div style={previewBox}>
              <p style={previewText}>Image preview</p>
              <img src={formData.image} alt="Preview" style={previewImage} />
            </div>
          )}
        </div>

        <div style={buttonGroup}>
          <button type="submit" style={submitButton}>
            Добавить рецепт
          </button>
          <button
            type="button"
            onClick={() => navigate("/recipes")}
            style={cancelButton}
          >
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
  flex: 1,
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
  boxSizing: "border-box",
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

const errorStyle = {
  color: "#e74c3c",
  fontSize: "14px",
  marginTop: "6px",
  marginBottom: 0,
};

const previewBox = {
  marginTop: "15px",
};

const previewText = {
  color: "var(--text-secondary)",
  fontWeight: "600",
  marginBottom: "8px",
};

const previewImage = {
  width: "100%",
  maxHeight: "260px",
  objectFit: "cover",
  borderRadius: "var(--radius)",
  border: "1px solid var(--border)",
};