import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeProvider, useRecipes } from "./context/RecipeContext";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import NavBar from "./components/NavBar";
import withAuth from "./hoc/withAuth";
import Toast from "./components/Toast";

const Home = lazy(() => import("./pages/Home"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile").then((module) => ({ default: withAuth(module.default) })));
const NotFound = lazy(() => import("./pages/NotFound"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Search = lazy(() => import("./pages/Search"));
const AddRecipe = lazy(() => import("./pages/AddRecipe"));
const Reviews = lazy(() => import("./pages/Reviews"));
const EditRecipe = lazy(() => import("./pages/EditRecipe"));

function Loading() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontSize: "24px", color: "#e67e22" }}>
      🍳 Загрузка...
    </div>
  );
}

function AppContent() {
  const { darkMode } = useRecipes();
  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode ? "#1a1a2e" : "#f5f0e8",
      color: darkMode ? "#eee" : "#222",
      transition: "all 0.3s",
    }}>
      <NavBar />
       <Toast />
      <div style={{ padding: "20px" }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </BrowserRouter>
    </RecipeProvider>
  );
}