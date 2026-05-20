import { useState } from "react";
import "./Profile.css";
import asylPhoto from "../assets/asyl.jpeg";
import azizaPhoto from "../assets/aziza.jpeg";

export default function Profile() {
  const [users, setUsers] = useState([
    {
      name: "Асыл",
      email: "gkemelkhanova@gmail.com",
      role: "Admin",
      bio: "I like creating and managing recipes in this application.",
      avatar: asylPhoto,
      github: "https://github.com/zhanabbaevass",
      stats: { favorites: 8, added: 5, reviews: 12 },
    },
    {
      name: "Азиза",
      email: "azizakuanysh@icloud.com",
      role: "User",
      bio: "I enjoy searching recipes, saving favorites, and writing reviews.",
      avatar: azizaPhoto,
      github: "https://github.com/azizakuanysh",
      stats: { favorites: 6, added: 3, reviews: 9 },
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});

  const openEdit = (index) => {
    setEditingIndex(index);
    setFormData({ ...users[index] });
  };

  const closeEdit = () => {
    setEditingIndex(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setUsers((prev) =>
      prev.map((user, i) => (i === editingIndex ? { ...user, ...formData } : user))
    );
    closeEdit();
  };

  return (
    <div className="profile-page">
      {users.map((user, index) => (
        <div className="profile-wrapper" key={user.email}>
          <div className="profile-card">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role">{user.role}</span>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-links">
              <a href={user.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <button className="edit-profile-btn" onClick={() => openEdit(index)}>
              Edit Profile
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h2>{user.stats.favorites}</h2>
              <p>Favorite Recipes</p>
            </div>
            <div className="stat-card">
              <h2>{user.stats.added}</h2>
              <p>Added Recipes</p>
            </div>
            <div className="stat-card">
              <h2>{user.stats.reviews}</h2>
              <p>Reviews</p>
            </div>
          </div>
        </div>
      ))}

      {/* Модалка редактирования */}
      {editingIndex !== null && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} />

            <label>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} />

            <label>GitHub URL</label>
            <input name="github" value={formData.github} onChange={handleChange} />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={closeEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}