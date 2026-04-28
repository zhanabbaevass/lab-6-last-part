import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useFetch – универсальный хук для загрузки данных с API
 * @param {string} url - адрес API
 * @returns {Object} { data, loading, error, refetch }
 */

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const loadData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      const json = await response.json();
      if (mountedRef.current) setData(json);
    } catch (err) {
      if (mountedRef.current) setError(err.message || "Неизвестная ошибка");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
}