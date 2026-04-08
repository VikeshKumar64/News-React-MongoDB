/**
 * useTopHeadlines.js
 *
 * Fetches top headlines from NewsAPI and transforms them into
 * the app's internal article format. Populates the article cache
 * so ArticleDetails can look up API articles by ID.
 *
 * @example
 *   const { articles, loading, error, refetch } = useTopHeadlines();
 *   const { articles } = useTopHeadlines({ category: 'technology', pageSize: 6 });
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTopHeadlines, isApiConfigured } from '../api/newsApi';
import { transformArticles } from '../api/newsTransformer';
import { cacheArticles } from '../api/articleCache';
import { articles as mockArticles } from '../data/newsData';

/**
 * @param {object}  [options]
 * @param {string}  [options.country='us']
 * @param {string}  [options.category='']   - maps to NewsAPI category
 * @param {number}  [options.pageSize=20]
 */
const useTopHeadlines = ({ country = 'us', category = '', pageSize = 20 } = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    /* ── If no API key is configured, fall back to mock data ──── */
    if (!isApiConfigured()) {
      // Simulate realistic loading delay
      await new Promise(r => setTimeout(r, 600));
      const filtered = category
        ? mockArticles.filter(a => a.category === category)
        : mockArticles;
      setArticles(filtered.slice(0, pageSize));
      setLoading(false);
      return;
    }

    /* ── Live API fetch ─────────────────────────────────────────── */
    try {
      const response = await fetchTopHeadlines({ country, category, pageSize });
      const transformed = transformArticles(response.articles ?? [], category);

      // Populate cache so ArticleDetails can resolve these IDs
      cacheArticles(transformed);
      setArticles(transformed);
    } catch (err) {
      setError(err.message);
      // Graceful fallback: show mock data on error so the UI isn't empty
      setArticles(mockArticles.slice(0, pageSize));
    } finally {
      setLoading(false);
    }
  }, [country, category, pageSize]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isApiConfigured()) {
        await new Promise(r => setTimeout(r, 600));
        if (cancelled) return;
        const filtered = category
          ? mockArticles.filter(a => a.category === category)
          : mockArticles;
        setArticles(filtered.slice(0, pageSize));
        setLoading(false);
        return;
      }

      try {
        const response = await fetchTopHeadlines({ country, category, pageSize });
        if (cancelled) return;
        const transformed = transformArticles(response.articles ?? [], category);
        cacheArticles(transformed);
        setArticles(transformed);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setArticles(mockArticles.slice(0, pageSize));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [country, category, pageSize]);

  return { articles, loading, error, refetch: load };
};

export default useTopHeadlines;
