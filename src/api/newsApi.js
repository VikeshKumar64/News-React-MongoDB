/**
 * newsApi.js — Axios instance + all API call functions
 *
 * Provider: NewsAPI.org   https://newsapi.org
 * Free tier: 100 requests / day, developer key, localhost only.
 *
 * Setup:
 *  1. Register at https://newsapi.org/register
 *  2. Copy your API key into .env:
 *       REACT_APP_NEWS_API_KEY=your_key_here
 *  3. Restart the dev server (npm start)
 *
 * Note: NewsAPI free keys are restricted to localhost in development.
 * For production you would need a paid plan or a server-side proxy.
 */

import axios from 'axios';

/* ── Constants ─────────────────────────────────────────────────── */

const API_KEY  = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/** True only when the user has filled in a real API key */
export const isApiConfigured = () =>
  Boolean(API_KEY && API_KEY !== 'your_newsapi_key_here');

/* ── Axios instance ─────────────────────────────────────────────── */

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'X-Api-Key': API_KEY ?? '' },
});

/* Request interceptor – log outgoing calls in development */
client.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[NewsAPI] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* Response interceptor – normalise errors into plain Error objects */
client.interceptors.response.use(
  (response) => response.data,   // unwrap the data envelope
  (error) => {
    if (error.response) {
      const msg = error.response.data?.message || `HTTP ${error.response.status}`;
      throw new Error(msg);
    }
    if (error.request) {
      throw new Error('Network error — check your internet connection.');
    }
    throw new Error(error.message || 'Unknown error occurred.');
  },
);

/* ── API functions ──────────────────────────────────────────────── */

/**
 * Fetch top headlines.
 * @param {object} options
 * @param {string} [options.country='us']
 * @param {string} [options.category]     - technology | business | science | health | sports | entertainment
 * @param {number} [options.pageSize=20]
 * @returns {Promise<{ articles: RawArticle[], totalResults: number }>}
 */
export const fetchTopHeadlines = ({ country = 'us', category, pageSize = 20 } = {}) => {
  const params = { country, pageSize };
  if (category && category !== 'all') params.category = category;
  return client.get('/top-headlines', { params });
};

/**
 * Full-text search across everything.
 * @param {object} options
 * @param {string} options.query
 * @param {number} [options.pageSize=20]
 * @param {string} [options.sortBy='publishedAt'] - relevancy | popularity | publishedAt
 * @returns {Promise<{ articles: RawArticle[], totalResults: number }>}
 */
export const searchEverything = ({ query, pageSize = 20, sortBy = 'publishedAt' } = {}) =>
  client.get('/everything', {
    params: { q: query, pageSize, sortBy, language: 'en' },
  });

export default client;
