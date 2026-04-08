/**
 * Search.js — Dedicated full-page search experience.
 *
 * Layout (top → bottom):
 *  1. Hero search bar     – large, auto-focused, with live character count
 *  2. Suggestion chips    – trending / recent keywords
 *  3. Status row          – debounce progress bar + result count
 *  4. Results             – staggered grid of NewsCards
 *  5. "No results" state  – animated empty illustration
 *  6. "Idle" state        – shown before the user types anything
 *
 * Data flow:
 *   rawInput (immediate) → useDebounce (400 ms) → useNewsFeed → articles
 *
 * Recent searches are persisted to localStorage (max 8 entries).
 */

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { SkeletonCard } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import useDebounce from '../hooks/useDebounce';
import useNewsFeed from '../hooks/useNewsFeed';

/* ══════════════════════════ Icons ══════════════════════════════════ */

const SearchIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ══════════════════ Recent search persistence ═══════════════════════ */

const STORAGE_KEY = 'smartnews_recent_searches';
const MAX_RECENT  = 8;

const loadRecent  = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
};

const saveRecent = (term, prev) => {
  const deduped = [term, ...prev.filter(t => t !== term)].slice(0, MAX_RECENT);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped)); }
  catch { /* storage full / SSR */ }
  return deduped;
};

const removeRecent = (term, prev) => {
  const next = prev.filter(t => t !== term);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  catch { /* */ }
  return next;
};

/* ══════════════════ Trending suggestion chips ═══════════════════════ */

const TRENDING_TAGS = [
  'Artificial Intelligence', 'SpaceX', 'Climate', 'Bitcoin',
  'Apple', 'Olympics', 'Quantum Computing', 'ChatGPT',
];

/* ══════════════════ Debounce progress bar ═══════════════════════════
 *
 * While the user is typing (rawInput !== debouncedQuery), a thin
 * gradient bar animates across the top of the results area to signal
 * that a search is pending. It disappears once the debounce fires.
 */
const DebounceBar = ({ active }) => (
  <div
    className={`
      h-0.5 rounded-full overflow-hidden transition-opacity duration-300
      ${active ? 'opacity-100' : 'opacity-0'}
    `}
  >
    <div className="h-full bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400 animate-shimmer bg-[length:200%_100%]" />
  </div>
);

/* ══════════════════ Suggestion chip ════════════════════════════════ */

const Chip = ({ label, icon, onClick, onRemove, isRecent }) => (
  <div className="group relative">
    <button
      onClick={() => onClick(label)}
      className={`
        flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold
        whitespace-nowrap transition-all duration-200
        border ${isRecent
          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40'
          : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-400'
        }
        hover:-translate-y-0.5 hover:shadow-md active:scale-95
      `}
    >
      <span className="text-[13px]">{icon}</span>
      {label}
    </button>
    {/* Remove button for recent searches */}
    {isRecent && onRemove && (
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(label); }}
        className="
          absolute -top-1 -right-1 w-4 h-4 rounded-full
          bg-gray-400 dark:bg-gray-600 text-white text-[9px]
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
          transition-all duration-200 shadow-sm
        "
        title="Remove"
      >
        ✕
      </button>
    )}
  </div>
);

/* ══════════════════ Staggered result card ══════════════════════════ */

const ResultCard = ({ article, index }) => (
  <div
    style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    className="animate-slide-up"
  >
    <NewsCard article={article} />
  </div>
);

/* ══════════════════ Idle / before-search state ═════════════════════ */

const IdleState = ({ onSuggest }) => (
  <div className="flex flex-col items-center py-16 animate-fade-in text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-500/20 dark:from-primary-900/30 dark:to-accent-500/10 flex items-center justify-center shadow-xl shadow-primary-100 dark:shadow-primary-900/20">
        <SearchIcon className="w-12 h-12 text-primary-300 dark:text-primary-600" />
      </div>
      {/* Pulsing ring */}
      <div className="absolute -inset-3 rounded-[2rem] border-2 border-dashed border-primary-200/60 dark:border-primary-900/40 animate-pulse" />
    </div>
    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
      Search the news
    </h2>
    <p className="text-gray-500 dark:text-dark-muted max-w-xs mb-8 leading-relaxed text-sm">
      Type a keyword, topic, or person's name to search across all headlines.
    </p>

    {/* Popular topics */}
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
      Popular right now
    </p>
    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
      {TRENDING_TAGS.slice(0, 6).map(tag => (
        <Chip key={tag} label={tag} icon="🔥" onClick={onSuggest} />
      ))}
    </div>
  </div>
);

/* ══════════════════ No results state ════════════════════════════════ */

const NoResults = ({ query, onClear }) => (
  <div className="flex flex-col items-center py-20 animate-fade-in text-center">
    {/* Animated emoji */}
    <div className="text-7xl mb-5 animate-bounce-in">🔍</div>
    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
      No results for
    </h3>
    <p className="text-lg text-primary-600 dark:text-primary-400 font-bold mb-3">
      "{query}"
    </p>
    <p className="text-gray-500 dark:text-dark-muted text-sm max-w-sm mb-8 leading-relaxed">
      Try different keywords, check for typos, or browse a category to discover stories.
    </p>

    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/30 transition-all active:scale-95"
      >
        Clear search
      </button>
      <Link
        to="/categories"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all"
      >
        Browse categories <ArrowRightIcon />
      </Link>
    </div>

    {/* Suggestions */}
    <div className="mt-10">
      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-3">Try searching for</p>
      <div className="flex flex-wrap justify-center gap-2">
        {TRENDING_TAGS.slice(0, 5).map(tag => (
          <Chip key={tag} label={tag} icon="💡" onClick={(t) => { document.querySelector('#search-input')?.focus(); }} />
        ))}
      </div>
    </div>
  </div>
);

/* ════════════════════════ Search Page ══════════════════════════════ */

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);

  /* ── Input state ─────────────────────────────────────────────────
   * rawInput → updates immediately every keystroke
   * debouncedQuery → updates 400ms after typing stops → triggers API
   */
  const [rawInput,  setRawInput]  = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(rawInput, 400);
  const isPending      = rawInput !== debouncedQuery;   // typing in progress

  /* ── Recent searches ──────────────────────────────────────────── */
  const [recentSearches, setRecentSearches] = useState(loadRecent);

  /* ── Sync URL with debounced value ──────────────────────────────
   * Only update the URL once the debounce settles so the address bar
   * doesn't flicker on every keystroke.
   */
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  /* ── API call (only fires when debouncedQuery changes) ──────────  */
  const { articles, loading, error, totalResults, refetch } = useNewsFeed({
    searchQuery: debouncedQuery.trim(),
    pageSize:    18,
  });

  /* ── Save successful searches ───────────────────────────────────  */
  useEffect(() => {
    if (debouncedQuery.trim() && !loading && articles.length > 0) {
      setRecentSearches(prev => saveRecent(debouncedQuery.trim(), prev));
    }
  }, [debouncedQuery, loading, articles.length]);

  /* ── Auto-focus on mount ─────────────────────────────────────── */
  useEffect(() => { inputRef.current?.focus(); }, []);

  /* ── Key to force grid re-render / re-animate on new query ─────  */
  const [gridKey, setGridKey] = useState(0);
  useEffect(() => {
    if (debouncedQuery) setGridKey(k => k + 1);
  }, [debouncedQuery]);

  /* ── Handlers ───────────────────────────────────────────────────  */
  const handleInput = useCallback((e) => {
    setRawInput(e.target.value);
  }, []);

  const clearInput = useCallback(() => {
    setRawInput('');
    inputRef.current?.focus();
  }, []);

  const runQuery = useCallback((term) => {
    setRawInput(term);
    inputRef.current?.focus();
  }, []);

  const removeSearch = useCallback((term) => {
    setRecentSearches(prev => removeRecent(term, prev));
  }, []);

  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  }, []);

  /* ── Derived ────────────────────────────────────────────────────  */
  const isIdle     = !rawInput && !debouncedQuery;
  const hasResults = articles.length > 0;
  const isEmpty    = !loading && !isPending && debouncedQuery.trim() && !hasResults;
  const showGrid   = !isIdle && (loading || isPending || hasResults);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ══ 1. Hero search input ════════════════════════════════════ */}
      <div className="relative animate-slide-down">
        {/* Glow ring */}
        <div
          className={`
            absolute -inset-0.5 rounded-2xl transition-opacity duration-300 blur-sm
            bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400
            ${rawInput ? 'opacity-40' : 'opacity-0'}
          `}
        />

        <div className="relative bg-white dark:bg-dark-card rounded-2xl border-2 border-gray-200 dark:border-dark-border focus-within:border-primary-400 dark:focus-within:border-primary-600 shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 px-5 py-4">
            {/* Icon — spinner while pending, magnifier otherwise */}
            <div className={`flex-shrink-0 transition-all duration-200 ${rawInput ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`}>
              {(loading || isPending) && rawInput ? (
                <span className="w-6 h-6 rounded-full border-2 border-primary-400 border-t-transparent animate-spin block" />
              ) : (
                <SearchIcon className="w-6 h-6" />
              )}
            </div>

            <input
              id="search-input"
              ref={inputRef}
              type="text"
              value={rawInput}
              onChange={handleInput}
              placeholder="Search news, topics, people…"
              autoComplete="off"
              spellCheck="false"
              className="
                flex-1 text-lg font-medium
                bg-transparent outline-none
                text-gray-900 dark:text-white
                placeholder-gray-300 dark:placeholder-gray-600
              "
            />

            {/* Character / word count */}
            {rawInput && (
              <span className="text-xs text-gray-300 dark:text-gray-600 font-mono flex-shrink-0 hidden sm:block">
                {rawInput.length} chars
              </span>
            )}

            {/* Clear ✕ button */}
            {rawInput && (
              <button
                onClick={clearInput}
                className="
                  flex-shrink-0 p-1.5 rounded-xl text-gray-400 dark:text-gray-500
                  hover:text-gray-700 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-dark-border
                  transition-all animate-scale-in
                "
                aria-label="Clear search"
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          {!rawInput && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border">⌘K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* ══ 2. Recent + Trending chips ══════════════════════════════ */}
      {(recentSearches.length > 0 || !rawInput) && (
        <div className="space-y-4 animate-fade-in">

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest flex items-center gap-1.5">
                  <ClockIcon /> Recent
                </p>
                <button
                  onClick={clearAllRecent}
                  className="text-[11px] text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 font-semibold transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <Chip
                    key={term}
                    label={term}
                    icon={<ClockIcon />}
                    onClick={runQuery}
                    onRemove={removeSearch}
                    isRecent
                  />
                ))}
              </div>
            </div>
          )}

          {/* Trending suggestions */}
          {!rawInput && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                <TrendIcon /> Trending topics
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(tag => (
                  <Chip key={tag} label={tag} icon="🔥" onClick={runQuery} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ 3. Status row ═══════════════════════════════════════════ */}
      {!isIdle && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            {/* Left: query label */}
            <div className="flex items-center gap-2 flex-wrap">
              {debouncedQuery && !isPending && (
                <span className="text-gray-500 dark:text-dark-muted">
                  Results for{' '}
                  <strong className="text-gray-900 dark:text-white">"{debouncedQuery}"</strong>
                </span>
              )}
              {isPending && (
                <span className="text-gray-400 dark:text-gray-600 italic text-sm animate-pulse">
                  Searching for "{rawInput}"…
                </span>
              )}
            </div>

            {/* Right: count */}
            {!loading && !isPending && hasResults && (
              <span className="text-gray-400 dark:text-dark-muted text-xs flex-shrink-0">
                {articles.length}
                {totalResults > articles.length && ` of ${totalResults.toLocaleString()}`}
                {' '}results
              </span>
            )}
          </div>

          {/* Debounce progress bar */}
          <DebounceBar active={isPending} />
        </div>
      )}

      {/* ══ 4. Error ════════════════════════════════════════════════ */}
      {error && !loading && (
        <div className="animate-slide-down">
          <ErrorState message={error} onRetry={refetch} compact />
        </div>
      )}

      {/* ══ 5. Results grid ═════════════════════════════════════════ */}
      {showGrid && (
        <div>
          {(loading || isPending) && !hasResults ? (
            /* Loading skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                  className="animate-slide-up"
                >
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : hasResults ? (
            <div key={gridKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <ResultCard key={article.id} article={article} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* ══ 6. Empty / No-results state ═════════════════════════════ */}
      {isEmpty && (
        <NoResults query={debouncedQuery} onClear={clearInput} />
      )}

      {/* ══ 7. Idle state (before any typing) ═══════════════════════ */}
      {isIdle && (
        <IdleState onSuggest={runQuery} />
      )}

    </main>
  );
};

export default SearchPage;
