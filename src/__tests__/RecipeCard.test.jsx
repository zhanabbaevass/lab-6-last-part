import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RecipeProvider } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

const mockRecipe = {
  id: 1,
  title: "Test Recipe",
  category: "Dinner",
  description: "Very tasty recipe for testing",
  image: "https://via.placeholder.com/300",
  liked: false,
  time: 30,
};

test("renders recipe title", () => {
  render(
    <BrowserRouter>
      <RecipeProvider>
        <RecipeCard recipe={mockRecipe} />
      </RecipeProvider>
    </BrowserRouter>
  );

  expect(screen.getByText("Test Recipe")).toBeTruthy();
});