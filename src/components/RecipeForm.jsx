import { useCallback, memo } from "react";
import { useRecipes } from "../context/RecipeContext";
import useForm from "../hooks/useForm.js";

const initialValues = {
  title: "",
  category: "",
  time: "",
  description: "",
  tags: "",
};

function RecipeForm({ onClose }) {
  const { addRecipe, addNotification } = useRecipes();

  const { values, errors, register, handleSubmit, resetForm } = useForm({
    initialValues,
    validate: (fields) => {
      const nextErrors = {};
      if (!fields.title.trim()) nextErrors.title = "Название обязательно";
      if (!fields.description.trim()) nextErrors.description = "Описание обязательно";
      return nextErrors;
    },
  });

  const onSubmit = useCallback(
    async (fields) => {
      await addRecipe(fields);
      resetForm();
      if (typeof onClose === "function") {
        onClose();
      }
    },
    [addRecipe, onClose, resetForm]
  );

  const onError = useCallback(() => {
    addNotification("Пожалуйста заполните обязательные поля", "error");
  }, [addNotification]);

  return (
    <div style={overlay}>
      <div style={formCard}>
        <div style={formHeader}>
          <h3>➕ Добавить рецепт</h3>
          <button type="button" onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <input style={inp} placeholder="Название*" {...register("title")} />
          {errors.title && <p style={errorText}>{errors.title}</p>}
          <input style={inp} placeholder="Категория" {...register("category")} />
          <input style={inp} type="number" placeholder="Время (мин)" {...register("time")} />
          <textarea style={inp} placeholder="Описание" {...register("description")} rows={4} />
          {errors.description && <p style={errorText}>{errors.description}</p>}
          <input style={inp} placeholder="Теги через запятую" {...register("tags")} />
          <button type="submit" style={submitBtn}>
            Добавить рецепт
          </button>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1200,
  padding: "16px",
};

const formCard = {
  width: "100%",
  maxWidth: "520px",
  background: "var(--bg-card)",
  borderRadius: "var(--radius)",
  padding: "24px",
  boxShadow: "var(--shadow)",
  border: "1px solid var(--border)",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "var(--text-primary)",
  fontSize: "20px",
  cursor: "pointer",
};

const inp = {
  display: "block",
  width: "100%",
  marginBottom: "14px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  boxSizing: "border-box",
};

const submitBtn = {
  width: "100%",
  padding: "12px 0",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  marginTop: "8px",
};

const errorText = {
  color: "#ff6b6b",
  marginTop: "-10px",
  marginBottom: "10px",
  fontSize: "13px",
};

export default memo(RecipeForm);
