/**
 * articleCache.js — in-memory registry for API-fetched articles.
 *
 * When the Home or Category page fetches articles from the news API,
 * each transformed article is stored here so the ArticleDetails page
 * can look it up by ID — even for articles that don't exist in the
 * local mock data (newsData.js).
 *
 * All data lives in module scope: it persists across re-renders
 * but resets on full page reload (which is fine for a news app).
 */

/** @type {Map<string, object>} */
const cache = new Map();

/** Store a single article by its numeric id. */
export const cacheArticle = (article) => {
  if (article?.id) cache.set(String(article.id), article);
};

/** Store an array of articles. */
export const cacheArticles = (articles = []) => {
  articles.forEach(cacheArticle);
};

/**
 * Retrieve a cached article by id.
 * @param {string|number} id
 * @returns {object|undefined}
 */
export const getCachedArticle = (id) => cache.get(String(id));

/** How many articles are currently cached. */
export const cacheSize = () => cache.size;

/** Clear the entire cache (useful in tests). */
export const clearCache = () => cache.clear();
