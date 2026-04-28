import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";

export default function Reviews() {
  const { recipes, addNotification } = useRecipes();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("reviews");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newReview, setNewReview] = useState({
    recipeId: "",
    author: "",
    rating: 5,
    comment: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      addNotification("Пожалуйста, заполните имя и комментарий", "error");
      return;
    }

    const review = {
      id: Date.now(),
      ...newReview,
      date: new Date().toISOString()
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    
    setNewReview({
      recipeId: "",
      author: "",
      rating: 5,
      comment: "",
      date: new Date().toISOString().split('T')[0]
    });
    
    addNotification("Отзыв добавлен успешно!", "success");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={container}>
      <h1>⭐ Отзывы</h1>
      
      <div style={statsContainer}>
        <div style={statBox}>
          <h3>Всего отзывов</h3>
          <p style={statNumber}>{reviews.length}</p>
        </div>
        <div style={statBox}>
          <h3>Средний рейтинг</h3>
          <p style={statNumber}>{averageRating} ⭐</p>
        </div>
      </div>

      <div style={contentContainer}>
        <div style={reviewsList}>
          <h2>Отзывы пользователей</h2>
          {reviews.length === 0 ? (
            <p style={noReviews}>Пока нет отзывов. Будьте первым!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} style={reviewCard}>
                <div style={reviewHeader}>
                  <strong>{review.author}</strong>
                  <span style={reviewDate}>
                    {new Date(review.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {review.recipeId && (
                  <p style={recipeName}>
                    Рецепт: {recipes.find(r => r.id === parseInt(review.recipeId))?.title || 'Неизвестный рецепт'}
                  </p>
                )}
                <div style={rating}>
                  {"⭐".repeat(review.rating)}
                </div>
                <p style={comment}>{review.comment}</p>
              </div>
            ))
          )}
        </div>

        <div style={addReviewForm}>
          <h2>Добавить отзыв</h2>
          <form onSubmit={handleSubmit} style={form}>
            <div style={formGroup}>
              <label style={label}>Ваше имя *</label>
              <input
                type="text"
                name="author"
                value={newReview.author}
                onChange={handleChange}
                style={input}
                required
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Рецепт (опционально)</label>
              <select
                name="recipeId"
                value={newReview.recipeId}
                onChange={handleChange}
                style={select}
              >
                <option value="">Общий отзыв о приложении</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={formGroup}>
              <label style={label}>Рейтинг</label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleChange}
                style={select}
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>

            <div style={formGroup}>
              <label style={label}>Комментарий *</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleChange}
                style={textarea}
                placeholder="Расскажите о вашем опыте..."
                required
              />
            </div>

            <button type="submit" style={submitButton}>
              Отправить отзыв
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
};

const statsContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const statBox = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "20px",
  textAlign: "center",
  minWidth: "150px",
  boxShadow: "var(--shadow)",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "var(--accent)",
  margin: "10px 0 0 0",
};

const contentContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "30px",
  alignItems: "start",
};

const reviewsList = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "20px",
  boxShadow: "var(--shadow)",
};

const noReviews = {
  textAlign: "center",
  color: "var(--text-secondary)",
  fontStyle: "italic",
  padding: "40px",
};

const reviewCard = {
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "15px",
  marginBottom: "15px",
  background: "var(--bg-secondary)",
};

const reviewHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const reviewDate = {
  color: "var(--text-secondary)",
  fontSize: "14px",
};

const recipeName = {
  color: "var(--accent)",
  fontSize: "14px",
  marginBottom: "8px",
};

const rating = {
  marginBottom: "10px",
  fontSize: "18px",
};

const comment = {
  lineHeight: "1.5",
  color: "var(--text-primary)",
};

const addReviewForm = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "20px",
  boxShadow: "var(--shadow)",
  position: "sticky",
  top: "20px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const label = {
  fontWeight: "600",
  color: "var(--text-primary)",
};

const input = {
  padding: "10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontSize: "16px",
};

const select = {
  ...input,
  cursor: "pointer",
};

const textarea = {
  ...input,
  minHeight: "100px",
  resize: "vertical",
};

const submitButton = {
  padding: "12px",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  marginTop: "10px",
};