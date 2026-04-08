/**
 * newsTransformer.js
 *
 * Converts raw NewsAPI article objects into the internal shape
 * used by the NewsCard component, so the UI never needs to know
 * which data source it's receiving from.
 *
 * Raw NewsAPI shape:
 *   { source: { id, name }, author, title, description,
 *     url, urlToImage, publishedAt, content }
 */

/* ── Helpers ────────────────────────────────────────────────────── */

/**
 * Deterministic numeric ID derived from the article's URL.
 * Guaranteed to be > 100 so it never collides with mock article IDs (1-8).
 */
export const urlToId = (url = '') => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0; // to 32-bit int
  }
  return Math.abs(hash) + 100;
};

/**
 * Rough read-time estimate from character count.
 * Average adult reads ~1,000 chars/min.
 */
const estimateReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
};

/**
 * Generate an avatar URL from an author name using ui-avatars.com.
 * Falls back to a generic "Reporter" avatar.
 */
const avatarFor = (name = '') => {
  const safeN = encodeURIComponent(name || 'News Reporter');
  return `https://ui-avatars.com/api/?name=${safeN}&background=3b82f6&color=fff&size=80&bold=true`;
};

/** Strip everything after "[+" (NewsAPI truncation marker) */
const cleanContent = (raw = '') =>
  raw ? raw.replace(/\s*\[\+\d+ chars\]$/, '').trim() : '';

/* ── Category detection ─────────────────────────────────────────── */

/** Map a NewsAPI category string → our internal category id */
const API_CATEGORY_MAP = {
  technology:    'technology',
  business:      'business',
  science:       'science',
  health:        'health',
  sports:        'sports',
  entertainment: 'entertainment',
  general:       'technology', // fallback to technology
};

/* ── Transformer ────────────────────────────────────────────────── */

/**
 * Transform a single raw NewsAPI article object.
 *
 * @param {object} raw       - Raw article from NewsAPI
 * @param {string} [apiCategory] - Category used in the API request (for context)
 * @returns {object} article in internal app format
 */
export const transformArticle = (raw, apiCategory = '') => {
  const id          = urlToId(raw.url || raw.title || String(Math.random()));
  const content     = cleanContent(raw.content);
  const description = raw.description || '';

  return {
    /* Identity */
    id,
    isApiArticle: true,         // flag so detail page can act accordingly
    externalUrl:  raw.url,      // link to original source

    /* Display fields */
    title:       raw.title || 'Untitled',
    excerpt:     description,
    content:     content || description, // full content often truncated by API
    image:       raw.urlToImage || '',
    tags:        [],

    /* Meta */
    source:       raw.source?.name || 'Unknown Source',
    author:       raw.author?.split(',')[0]?.trim() || raw.source?.name || 'Staff Reporter',
    authorAvatar: avatarFor(raw.author?.split(',')[0]?.trim()),
    publishedAt:  raw.publishedAt,
    readTime:     estimateReadTime(content || description),

    /* Taxonomy */
    category:  API_CATEGORY_MAP[apiCategory] || API_CATEGORY_MAP[raw.source?.id] || 'technology',
    featured:  false,
    trending:  false,
  };
};

/**
 * Transform an array of raw articles.
 * Filters out articles marked as "[Removed]" by NewsAPI.
 *
 * @param {object[]} rawArticles
 * @param {string}   [apiCategory]
 * @returns {object[]}
 */
export const transformArticles = (rawArticles = [], apiCategory = '') =>
  rawArticles
    .filter(a => a.title && a.title !== '[Removed]' && a.url)
    .map(a => transformArticle(a, apiCategory));
