import { useState, useMemo, useCallback } from "react";

export function useFilter(items = []) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const filtered = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.tags?.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((item) => item.category === category);
    }

    result.sort((a, b) => {
      const valA = a[sortBy] ?? "";
      const valB = b[sortBy] ?? "";
      const cmp = String(valA).localeCompare(String(valB));
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [items, search, category, sortBy, sortOrder]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setCategory("");
    setSortBy("title");
    setSortOrder("asc");
  }, []);

  return {
    filtered,
    search, setSearch,
    category, setCategory,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    resetFilters,
  };
}