import { useState, useEffect, useCallback } from "react";

/**
 * useFetch – универсальный хук для загрузки данных с API
 * @param {string} url - адрес API
 * @returns {Object} { data, loading, error, refetch }
 */

import { useState, useEffect, useCallback, useRef } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (fetchError) {
      if (mountedRef.current) setError(fetchError);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
