/**
 * useNewsApi.js — Generic base hook for all NewsAPI calls.
 *
 * Demonstrates the core React data-fetching pattern:
 *   useState  → tracks articles, loading, and error
 *   useEffect → fires the async fetch on mount / when deps change
 *   useCallback → stable refetch reference prevents infinite loops
 *
 * Usage (internal — prefer the specific hooks below):
 *
 *   const { data, loading, error, refetch } = useNewsApi(
 *     () => fetchTopHeadlines({ pageSize: 10 }),
 *     []
 *   );
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @template T
 * @param {() => Promise<T>} fetchFn  - Async function that returns data
 * @param {any[]}            deps     - Dependency array (same as useEffect)
 * @returns {{ data: T|null, loading: boolean, error: string|null, refetch: () => void }}
 */
const useNewsApi = (fetchFn, deps = []) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /**
   * Store fetchFn in a ref so the useCallback below doesn't
   * need it in its dependency array (avoids recreating on every render).
   */
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => { fetchFnRef.current = fetchFn; });

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFnRef.current();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    /** Cleanup: ignore stale responses if deps change before fetch completes */
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: execute };
};

export default useNewsApi;
