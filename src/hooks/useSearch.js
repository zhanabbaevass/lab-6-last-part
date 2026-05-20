import { useMemo } from "react";

export default function useSearch(items, searchText, category, sortBy) {
  return useMemo(() => {
    let result = [...items];

    if (searchText) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (category && category !== "All") {
      result = result.filter((item) => item.category === category);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return result;
  }, [items, searchText, category, sortBy]);
}