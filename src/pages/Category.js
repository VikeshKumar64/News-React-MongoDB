/**
 * Category.js — Premium category-based news page.
 *
 * Key design features:
 *  • Per-category color theme — active category paints the hero header
 *  • Animated pill indicator tracks the active tab (CSS translate)
 *  • Grid ↔ List view toggle with smooth icon morph
 *  • Crossfade animation when category or search changes
 *  • "Featured first" layout — top article spans full width in grid mode
 *  • Staggered card entrance: `slideUp` with per-card delay
 *  • Spinning loader inside search bar while fetching
 */

import React, {
  useState, useEffect, useCallback, useRef, useLayoutEffect,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { SkeletonCard } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import useNewsFeed from '../hooks/useNewsFeed';
import { categories } from '../data/newsData';

/* ══════════════════════════ Icons ══════════════════════════════════ */

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ══════════════════════ Per-Category Theme ══════════════════════════
 *
 * Each category gets:
 *   from/to  - hero gradient
 *   ring     - active tab ring color
 *   badge    - pill background on active tab
 *   text     - text color on active tab
 *   shadow   - shadow tint on active tab button
 */
const THEME = {
  all: {
    from: 'from-slate-700',   to: 'to-slate-900',
    badge: 'bg-slate-700',    text: 'text-white',
    ring: 'ring-slate-400',   shadow: 'shadow-slate-500/30',
    iconBg: 'bg-slate-600',
  },
  technology: {
    from: 'from-blue-600',    to: 'to-indigo-700',
    badge: 'bg-blue-600',     text: 'text-white',
    ring: 'ring-blue-400',    shadow: 'shadow-blue-500/40',
    iconBg: 'bg-blue-500',
  },
  business: {
    from: 'from-emerald-600', to: 'to-teal-700',
    badge: 'bg-emerald-600',  text: 'text-white',
    ring: 'ring-emerald-400', shadow: 'shadow-emerald-500/40',
    iconBg: 'bg-emerald-500',
  },
  science: {
    from: 'from-violet-600',  to: 'to-purple-700',
    badge: 'bg-violet-600',   text: 'text-white',
    ring: 'ring-violet-400',  shadow: 'shadow-violet-500/40',
    iconBg: 'bg-violet-500',
  },
  health: {
    from: 'from-rose-600',    to: 'to-red-700',
    badge: 'bg-rose-600',     text: 'text-white',
    ring: 'ring-rose-400',    shadow: 'shadow-rose-500/40',
    iconBg: 'bg-rose-500',
  },
  sports: {
    from: 'from-orange-500',  to: 'to-amber-600',
    badge: 'bg-orange-500',   text: 'text-white',
    ring: 'ring-orange-400',  shadow: 'shadow-orange-500/40',
    iconBg: 'bg-orange-400',
  },
  entertainment: {
    from: 'from-fuchsia-600', to: 'to-pink-700',
    badge: 'bg-fuchsia-600',  text: 'text-white',
    ring: 'ring-fuchsia-400', shadow: 'shadow-fuchsia-500/40',
    iconBg: 'bg-fuchsia-500',
  },
};

/* ══════════════════════ Category Tab Bar ════════════════════════════ */

const ALL_CATEGORIES = [
  { id: 'all', name: 'All News', icon: '📰' },
  ...categories,
];

/**
 * CategoryTabBar
 *
 * Renders the horizontal pill strip. A sliding `indicator` div
 * moves under the active pill using `style.transform` calculated
 * from the active button's `offsetLeft` and `offsetWidth`.
 */
const CategoryTabBar = ({ activeId, onChange }) => {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const theme = THEME[activeId] ?? THEME.all;

  /**
   * After every render, measure the active button and slide the indicator.
   * useLayoutEffect avoids a flash of the indicator at position 0.
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]');
    if (!active) return;
    const { offsetLeft: left, offsetWidth: width } = active;
    setIndicatorStyle({ left, width, opacity: 1 });
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
    >
      {/* Sliding background indicator */}
      <span
        aria-hidden
        className={`
          absolute bottom-0 top-0 rounded-xl transition-all duration-300 ease-out
          ${theme.badge}
        `}
        style={{
          left:    indicatorStyle.left,
          width:   indicatorStyle.width,
          opacity: indicatorStyle.opacity,
          zIndex:  0,
        }}
      />

      {ALL_CATEGORIES.map(cat => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            data-active={isActive ? 'true' : 'false'}
            onClick={() => onChange(cat.id)}
            className={`
              relative z-10 flex items-center gap-1.5 px-4 py-2.5 rounded-xl
              text-sm font-bold whitespace-nowrap
              transition-colors duration-200
              ${isActive
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
            {/* Article count badge — only on active */}
            {isActive && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-black leading-none">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* ══════════════════════ Category Hero Header ════════════════════════ */

const CategoryHero = ({ activeId, articleCount, loading }) => {
  const cat   = ALL_CATEGORIES.find(c => c.id === activeId) ?? ALL_CATEGORIES[0];
  const theme = THEME[activeId] ?? THEME.all;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl px-6 py-8
        bg-gradient-to-br ${theme.from} ${theme.to}
        transition-all duration-500 ease-out
      `}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative flex items-center gap-5">
        {/* Big emoji icon */}
        <div className={`
          text-5xl w-20 h-20 rounded-2xl ${theme.iconBg}
          flex items-center justify-center shadow-lg flex-shrink-0
          transition-all duration-500
        `}>
          {cat.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            {activeId === 'all' ? 'All Categories' : 'Category'}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
            {cat.name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {loading ? (
              <span className="flex items-center gap-2 text-white/70 text-sm">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                Loading stories…
              </span>
            ) : (
              <>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm font-semibold backdrop-blur-sm">
                  {articleCount} article{articleCount !== 1 ? 's' : ''} found
                </span>
                <span className="text-white/50 text-xs">Updated just now</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════ View Mode Toggle ════════════════════════════ */

const ViewToggle = ({ mode, onChange }) => (
  <div className="flex items-center p-1 bg-gray-100 dark:bg-dark-surface rounded-xl gap-0.5">
    {[
      { id: 'grid', icon: <GridIcon />, label: 'Grid view' },
      { id: 'list', icon: <ListIcon />, label: 'List view' },
    ].map(({ id, icon, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        title={label}
        className={`
          p-1.5 rounded-lg transition-all duration-200
          ${mode === id
            ? 'bg-white dark:bg-dark-card shadow-sm text-primary-600 dark:text-primary-400 scale-105'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }
        `}
      >
        {icon}
      </button>
    ))}
  </div>
);

/* ══════════════════ Animated Grid / List results ════════════════════
 *
 *  - Grid: 3-col with staggered card entrance on each category change
 *  - List: horizontal cards using the NewsCard horizontal variant
 *  - Both modes crossfade via key-based unmount/remount
 */

/** A wrapper that applies staggered slide-up animation per card */
const AnimatedCard = ({ article, index, variant = 'default' }) => (
  <div
    key={article.id}
    style={{
      animationDelay: `${index * 70}ms`,
      animationFillMode: 'both',
    }}
    className="animate-slide-up"
  >
    <NewsCard article={article} variant={variant} />
  </div>
);

/* ══════════════════════════ Category Page ═══════════════════════════ */

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput,  setSearchInput]  = useState(searchParams.get('search') || '');
  const [viewMode,     setViewMode]     = useState('grid');   // 'grid' | 'list'
  const [gridKey,      setGridKey]      = useState(0);        // bump to trigger re-animation
  const [spinning,     setSpinning]     = useState(false);

  const activeCategory = searchParams.get('cat') || 'all';
  const searchQuery    = searchParams.get('search') || '';

  /* Sync search input with URL */
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  /* Bump key whenever category changes → forces grid re-mount → re-animates cards */
  const prevCat = useRef(activeCategory);
  useEffect(() => {
    if (prevCat.current !== activeCategory) {
      prevCat.current = activeCategory;
      setGridKey(k => k + 1);
    }
  }, [activeCategory]);

  /* ── Data hook ──────────────────────────────────────────────────── */
  const feedCategory = activeCategory === 'all' ? '' : activeCategory;

  const { articles, loading, error, totalResults, refetch } = useNewsFeed({
    category:    feedCategory,
    searchQuery,
    pageSize:    21,
  });

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleCategoryChange = useCallback((catId) => {
    const params = {};
    if (catId !== 'all') params.cat = catId;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = {};
    if (activeCategory !== 'all') params.cat = activeCategory;
    if (searchInput.trim()) params.search = searchInput.trim();
    setSearchParams(params);
  }, [activeCategory, searchInput, setSearchParams]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    const params = {};
    if (activeCategory !== 'all') params.cat = activeCategory;
    setSearchParams(params);
  }, [activeCategory, setSearchParams]);

  const handleRefresh = useCallback(async () => {
    setSpinning(true);
    setGridKey(k => k + 1);
    await refetch();
    setTimeout(() => setSpinning(false), 700);
  }, [refetch]);

  /* ── Derived ────────────────────────────────────────────────────── */
  const currentCat    = ALL_CATEGORIES.find(c => c.id === activeCategory);
  const theme         = THEME[activeCategory] ?? THEME.all;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">

      {/* ══ 1. Category Hero Header ════════════════════════════════ */}
      <CategoryHero
        activeId={activeCategory}
        articleCount={loading ? 0 : articles.length}
        loading={loading}
      />

      {/* ══ 2. Search bar ══════════════════════════════════════════ */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            {loading
              ? <span className="w-5 h-5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
              : <SearchIcon />
            }
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={`Search ${currentCat?.name ?? 'all'} articles, topics…`}
            className="
              w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm
              bg-white dark:bg-dark-card
              border-2 border-gray-200 dark:border-dark-border
              focus:border-primary-400 dark:focus:border-primary-600
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-dark-muted
              outline-none transition-all duration-200
              shadow-sm focus:shadow-md
            "
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <XIcon />
            </button>
          )}
        </div>
      </form>

      {/* ══ 3. Tab bar + View toggle row ═══════════════════════════ */}
      <div className="flex items-start gap-4">
        {/* Scrollable tab strip */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="bg-gray-100 dark:bg-dark-surface rounded-2xl p-1.5">
            <CategoryTabBar
              activeId={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* View toggle + refresh */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <button
            onClick={handleRefresh}
            title="Refresh articles"
            className={`
              p-2 rounded-xl border border-gray-200 dark:border-dark-border
              text-gray-500 dark:text-gray-400
              hover:text-primary-600 dark:hover:text-primary-400
              hover:border-primary-300 dark:hover:border-primary-700
              transition-all duration-200
            `}
          >
            <RefreshIcon spinning={spinning} />
          </button>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* ══ 4. Active category label / search result line ══════════ */}
      <div className="flex items-center gap-3">
        {searchQuery ? (
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Results for{' '}
            <span className="font-bold text-primary-600 dark:text-primary-400">"{searchQuery}"</span>
            {!loading && (
              <span className="ml-2 text-gray-400">
                · {articles.length} of {totalResults?.toLocaleString?.()} found
              </span>
            )}
          </p>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                ${theme.badge} text-white shadow-sm ${theme.shadow}
                transition-all duration-300
              `}
            >
              {currentCat?.icon} {currentCat?.name}
            </span>
            {!loading && (
              <span className="text-xs text-gray-400 dark:text-dark-muted">
                {articles.length} article{articles.length !== 1 ? 's' : ''}
                {totalResults > articles.length ? ` of ${totalResults.toLocaleString()}` : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ══ 5. Error banner ════════════════════════════════════════ */}
      {error && !loading && (
        <div className="animate-slide-down">
          <ErrorState message={error} onRetry={handleRefresh} compact />
        </div>
      )}

      {/* ══ 6. Results ═════════════════════════════════════════════
       *
       * We use `key={gridKey}` on the results container so every
       * category switch unmounts + remounts the grid, restarting
       * all staggered animations from the beginning.
       */}
      {loading ? (
        /* Loading: skeleton grid */
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              className="animate-slide-up"
            >
              <SkeletonCard />
            </div>
          ))}
        </div>

      ) : articles.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in">
          <div className="text-6xl mb-5">
            {searchQuery ? '🔍' : currentCat?.icon ?? '📰'}
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
            {searchQuery ? `No results for "${searchQuery}"` : `No ${currentCat?.name} news yet`}
          </h3>
          <p className="text-gray-500 dark:text-dark-muted mb-8 max-w-xs leading-relaxed text-sm">
            {searchQuery
              ? 'Try different keywords or browse another category.'
              : 'Check back later or explore a different category.'}
          </p>
          <button
            onClick={() => { setSearchInput(''); setSearchParams({}); }}
            className={`
              px-6 py-3 rounded-2xl ${theme.badge} text-white font-bold text-sm
              shadow-lg ${theme.shadow} hover:opacity-90 active:scale-95
              transition-all duration-200
            `}
          >
            Clear and browse all →
          </button>
        </div>

      ) : viewMode === 'grid' ? (
        /* ── Grid mode ─────────────────────────────────────────── */
        <div key={`grid-${gridKey}`} className="space-y-6">
          {/* Featured first article (full width) */}
          <div
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
            className="animate-slide-up"
          >
            <NewsCard article={articles[0]} variant="featured" />
          </div>

          {/* Remaining cards in 3-col grid */}
          {articles.slice(1).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((article, i) => (
                <AnimatedCard
                  key={article.id}
                  article={article}
                  index={i + 1}
                />
              ))}
            </div>
          )}
        </div>

      ) : (
        /* ── List mode ─────────────────────────────────────────── */
        <div key={`list-${gridKey}`} className="space-y-4">
          {articles.map((article, i) => (
            <AnimatedCard
              key={article.id}
              article={article}
              index={i}
              variant="horizontal"
            />
          ))}
        </div>
      )}

      {/* ══ 7. Load more / footer hint ═════════════════════════════ */}
      {!loading && articles.length > 0 && (
        <div className="flex justify-center pt-4 animate-fade-in">
          <button
            onClick={handleRefresh}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold
              border-2 border-gray-200 dark:border-dark-border
              text-gray-600 dark:text-gray-300
              hover:border-primary-400 dark:hover:border-primary-600
              hover:text-primary-600 dark:hover:text-primary-400
              transition-all duration-200
            `}
          >
            <RefreshIcon spinning={spinning} />
            Refresh for more stories
          </button>
        </div>
      )}
    </main>
  );
};

export default Category;
