/**
 * useNewsFeed.js
 *
 * Versatile hook used by the Category page.
 * Switches between two endpoints automatically:
 *   - Search query  → /everything   (full-text search)
 *   - Category name → /top-headlines?category=...
 *   - Fallback      → /top-headlines (all news)
 *
 * Re-fetches whenever category or searchQuery changes.
 *
 * @example
 *   const { articles, loading, error } = useNewsFeed({ category: 'sports' });
 *   const { articles, loading, error } = useNewsFeed({ searchQuery: 'bitcoin' });
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTopHeadlines, searchEverything, isApiConfigured } from '../api/newsApi';
import { transformArticles } from '../api/newsTransformer';
import { cacheArticles } from '../api/articleCache';
import { articles as mockArticles } from '../data/newsData';

/**
 * @param {object} [options]
 * @param {string} [options.category='']      - NewsAPI category filter
 * @param {string} [options.searchQuery='']   - Free-text search query
 * @param {number} [options.pageSize=20]
 */
const useNewsFeed = ({ category = '', searchQuery = '', pageSize = 20 } = {}) => {
  const [articles,     setArticles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    /* ── No API key – filter mock data locally ─────────────────── */
    if (!isApiConfigured()) {
      await new Promise(r => setTimeout(r, 400));

      let result = [...mockArticles];

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(a =>
          a.title.toLowerCase().includes(q)   ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      } else if (category && category !== 'all') {
        result = result.filter(a => a.category === category);
      }

      setArticles(result.slice(0, pageSize));
      setTotalResults(result.length);
      setLoading(false);
      return;
    }

    /* ── Live fetch ─────────────────────────────────────────────── */
    try {
      let response;

      if (searchQuery?.trim()) {
        // Full-text search across all sources
        response = await searchEverything({ query: searchQuery.trim(), pageSize });
      } else {
        // Top headlines (optionally filtered by category)
        response = await fetchTopHeadlines({
          category: category && category !== 'all' ? category : '',
          pageSize,
        });
      }

      const transformed = transformArticles(response.articles ?? [], category);
      cacheArticles(transformed);
      setArticles(transformed);
      setTotalResults(response.totalResults ?? transformed.length);
    } catch (err) {
      setError(err.message);
      // Show mock data as fallback
      setArticles(mockArticles);
      setTotalResults(mockArticles.length);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, pageSize]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isApiConfigured()) {
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) return;

        let result = [...mockArticles];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          result = result.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.tags.some(t => t.toLowerCase().includes(q))
          );
        } else if (category && category !== 'all') {
          result = result.filter(a => a.category === category);
        }
        setArticles(result.slice(0, pageSize));
        setTotalResults(result.length);
        setLoading(false);
        return;
      }

      try {
        let response;
        if (searchQuery?.trim()) {
          response = await searchEverything({ query: searchQuery.trim(), pageSize });
        } else {
          response = await fetchTopHeadlines({
            category: category && category !== 'all' ? category : '',
            pageSize,
          });
        }
        if (cancelled) return;
        const transformed = transformArticles(response.articles ?? [], category);
        cacheArticles(transformed);
        setArticles(transformed);
        setTotalResults(response.totalResults ?? transformed.length);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setArticles(mockArticles);
        setTotalResults(mockArticles.length);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [category, searchQuery, pageSize]);

  return { articles, loading, error, totalResults, refetch: load };
};

export default useNewsFeed;
