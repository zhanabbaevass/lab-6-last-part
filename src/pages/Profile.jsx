import "./Profile.css";
import asylPhoto from "../assets/asyl.jpeg";

export default function Profile() {
  const users = [
    {
      name: "Асыл",
      email: "gkemelkhanova@gmail.com",
      role: "Admin",
      bio: "I like creating and managing recipes in this application.",
      avatar: asylPhoto,
      github: "https://github.com/",
      stats: {
        favorites: 8,
        added: 5,
        reviews: 12,
      },
    },
    {
      name: "Азиза",
      email: "aziza@gmail.com",
      role: "User",
      bio: "I enjoy searching recipes, saving favorites, and writing reviews.",
      avatar:"https://i.pravatar.cc/150?img=32",
      github: "https://github.com/",
      stats: {
        favorites: 6,
        added: 3,
        reviews: 9,
      },
    },
  ];

  return (
    <div className="profile-page">
      {users.map((user) => (
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

            <button className="edit-profile-btn">Edit Profile</button>
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
    </div>
  );
}