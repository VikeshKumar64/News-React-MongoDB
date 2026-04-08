/**
 * Bookmarks.js — Premium saved articles page.
 *
 * Features:
 *  • Staggered entrance animations for saved cards
 *  • Grid / List view toggle that syncs with animated layout
 *  • Animated empty state with gradient icon
 *  • "Clear all" functionality
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import NewsCard from '../components/NewsCard';

/* ══════════════════════════ Icons ══════════════════════════════════ */

const BookmarkFilledIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ════════════════════ Animated Card Wrapper ════════════════════════ */

const AnimatedCard = ({ article, index, variant }) => (
  <div
    className="animate-slide-up"
    style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
  >
    <NewsCard article={article} variant={variant} />
  </div>
);

/* ══════════════════════════ Bookmarks Page ═════════════════════════ */

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [viewMode, setViewMode] = useState('grid');
  const [gridKey, setGridKey] = useState(0);

  // Bump key when viewMode changes to re-trigger staggered animations
  useEffect(() => {
    setGridKey(k => k + 1);
  }, [viewMode]);

  const handleClearAll = () => {
    if (window.confirm('Remove all bookmarks? This cannot be undone.')) {
      // Create a copy of the array so we aren't modifying it while iterating
      const toRemove = [...bookmarks];
      toRemove.forEach(b => removeBookmark(b.id));
    }
  };

  /* ── 1. Empty State ─────────────────────────────────────────────── */
  if (bookmarks.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-28 animate-fade-in flex flex-col items-center text-center">
        {/* Animated icon */}
        <div className="relative mb-8 text-7xl animate-bounce-in">
          📚
          <div className="absolute -inset-8 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-dark-border animate-spin-slow -z-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          Your reading list is empty
        </h1>
        <p className="text-gray-500 dark:text-dark-muted max-w-sm mb-10 leading-relaxed text-lg">
          Tap the <span className="font-semibold text-primary-600 dark:text-primary-400">bookmark icon</span> on any article to save it here for later reading. It works entirely offline!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-xl shadow-primary-500/30 transition-all active:scale-95 w-full sm:w-auto"
          >
            Explore Top Headlines
          </Link>
          <Link
            to="/categories"
            className="group flex items-center justify-center px-6 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all w-full sm:w-auto"
          >
            Browse Categories <ArrowRightIcon />
          </Link>
        </div>
      </main>
    );
  }

  /* ── 2. Filled State ────────────────────────────────────────────── */
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">

      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-[2rem] p-8 sm:p-10 bg-gradient-to-br from-primary-600 to-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-primary-500/10">
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-bounce-in">
            <BookmarkFilledIcon />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1.5 drop-shadow-sm">Bookmarks</h1>
            <p className="text-primary-100 font-medium">
              You have <strong className="text-white">{bookmarks.length}</strong> saved article{bookmarks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Desktop View Toggles & Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-black/20 backdrop-blur-md rounded-xl">
            {[
              { id: 'grid', icon: <GridIcon />, label: 'Grid view' },
              { id: 'list', icon: <ListIcon />, label: 'List view' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                title={label}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${viewMode === id
                    ? 'bg-white shadow-sm text-primary-600 scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {icon}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/80 text-white font-bold rounded-xl border border-red-400/30 backdrop-blur-md transition-all active:scale-95"
            title="Clear all bookmarks"
          >
            <TrashIcon /> <span className="hidden sm:inline text-sm">Clear All</span>
          </button>
        </div>
      </header>

      {/* Responsive Grid/List Results */}
      <section key={gridKey}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article, i) => (
              <AnimatedCard key={article.id} article={article} index={i} variant="default" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((article, i) => (
              <AnimatedCard key={article.id} article={article} index={i} variant="horizontal" />
            ))}
          </div>
        )}
      </section>

    </main>
  );
};

export default Bookmarks;
