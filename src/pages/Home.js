/**
 * Home.js — Premium news home page.
 *
 * Sections (top → bottom):
 *  1. Breaking News Ticker        – horizontally scrolling headlines
 *  2. Hero / Featured Carousel    – large auto-rotating featured article
 *  3. Browse Topics               – category quick-nav chips
 *  4. Top Headlines Today         – prominent section title with live dot + count badge
 *  5. Editor's Pick (first card)  – spans 2 cols, extra visual weight
 *  6. Latest News grid            – 2-col responsive grid with staggered fade-in
 *  7. Sidebar (right col)         – Trending list + ad-free Newsletter CTA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import ErrorState from '../components/ErrorState';
import {
  SkeletonCard,
  SkeletonFeatured,
  SkeletonTrendingItem,
} from '../components/SkeletonCard';
import useTopHeadlines from '../hooks/useTopHeadlines';
import { isApiConfigured } from '../api/newsApi';
import { formatDate } from '../data/newsData';

/* ══════════════════════════ SVG Icons ══════════════════════════════ */

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 transition-transform ${spinning ? 'animate-spin' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ══════════════════ Breaking News Ticker ═══════════════════════════ */

const BreakingNewsTicker = ({ headlines }) => {
  if (!headlines.length) return null;

  const text = headlines
    .slice(0, 8)
    .map(a => a.title)
    .join('   ·   ');

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-9">
          {/* Label */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pr-4 border-r border-white/30 mr-4">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
              Breaking
            </span>
          </div>

          {/* Scrolling text */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="inline-flex gap-8 whitespace-nowrap text-xs font-medium text-white/95"
              style={{
                animation: 'tickerScroll 40s linear infinite',
              }}
            >
              <span>{text}</span>
              {/* Duplicate for seamless loop */}
              <span aria-hidden>{text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker keyframe injected via style tag */}
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════ Hero / Featured Carousel ══════════════════════ */

const HeroSection = ({ articles, loading }) => {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance every 6 seconds unless paused
  useEffect(() => {
    if (paused || articles.length < 2) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % articles.length), 6000);
    return () => clearInterval(timer);
  }, [paused, articles.length]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <SkeletonFeatured />
      </div>
    );
  }
  if (!articles.length) return null;

  return (
    <section
      aria-label="Featured article"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="relative animate-fade-in">
        <NewsCard article={articles[idx]} variant="featured" />

        {/* Dot navigation */}
        {articles.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show article ${i + 1}`}
                className={`
                  rounded-full transition-all duration-400
                  ${i === idx ? 'bg-white w-7 h-2.5 shadow-md' : 'bg-white/45 w-2.5 h-2.5 hover:bg-white/70'}
                `}
              />
            ))}
          </div>
        )}

        {/* Pause indicator */}
        {paused && articles.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold z-10">
            <span>⏸</span> Paused
          </div>
        )}
      </div>
    </section>
  );
};

/* ══════════════════ Category Quick-nav ═══════════════════════════ */

const CATEGORIES = [
  { id: 'technology',    label: 'Technology',    icon: '💻', bg: 'hover:from-blue-500  hover:to-indigo-500' },
  { id: 'business',      label: 'Business',       icon: '📈', bg: 'hover:from-green-500 hover:to-emerald-500' },
  { id: 'science',       label: 'Science',        icon: '🔬', bg: 'hover:from-purple-500 hover:to-violet-500' },
  { id: 'health',        label: 'Health',         icon: '🏥', bg: 'hover:from-red-500    hover:to-rose-500' },
  { id: 'sports',        label: 'Sports',         icon: '⚽', bg: 'hover:from-orange-500 hover:to-amber-500' },
  { id: 'entertainment', label: 'Entertainment',  icon: '🎬', bg: 'hover:from-pink-500   hover:to-fuchsia-500' },
];

const BrowseTopics = () => (
  <section aria-label="Browse topics">
    <div className="flex items-center justify-between mb-5">
      <SectionHeader title="Browse Topics" />
      <Link
        to="/categories"
        className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-1.5 transition-all"
      >
        View All <ArrowRightIcon />
      </Link>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {CATEGORIES.map((cat, i) => (
        <Link
          key={cat.id}
          to={`/categories?cat=${cat.id}`}
          style={{ animationDelay: `${i * 60}ms` }}
          className={`
            group relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl
            bg-white dark:bg-dark-card
            border border-gray-100 dark:border-dark-border
            hover:border-transparent hover:bg-gradient-to-br ${cat.bg}
            hover:shadow-xl hover:-translate-y-1
            transition-all duration-250 ease-out
            animate-slide-up
          `}
        >
          <span className="text-2xl group-hover:scale-130 transition-transform duration-250 leading-none">
            {cat.icon}
          </span>
          <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  </section>
);

/* ══════════════════ Section Header ══════════════════════════════════ */

const SectionHeader = ({ title, badge, live = false }) => (
  <div className="flex items-center gap-3">
    {/* Gradient accent bar */}
    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h2>
    {live && (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live
      </span>
    )}
    {badge != null && (
      <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[11px] font-bold">
        {badge}
      </span>
    )}
  </div>
);

/* ══════════════════ Top Headlines Grid ═════════════════════════════ */

/**
 * Staggered card entrance: each card fades + slides up with
 * progressively longer delay so they cascade in left→right, top→bottom.
 */
const StaggeredCard = ({ article, index }) => (
  <div
    style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    className="animate-slide-up"
  >
    <NewsCard article={article} />
  </div>
);

/* ══════════════════ Editor's Pick ══════════════════════════════════ */

const EditorsPick = ({ article, loading }) => {
  if (loading) {
    return (
      <div className="sm:col-span-2 animate-pulse">
        <SkeletonCard />
      </div>
    );
  }
  if (!article) return null;

  return (
    <div className="sm:col-span-2 animate-fade-in">
      {/* Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
          <StarIcon /> Editor's Pick
        </div>
      </div>

      {/* This uses the default card but we can style a 2-col span */}
      <div className="grid sm:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-primary-100 dark:border-primary-900/40 shadow-xl shadow-primary-100/60 dark:shadow-primary-900/20">
        {/* Image half */}
        <Link
          to={`/article/${article.id}`}
          className="group relative block overflow-hidden"
        >
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full min-h-[200px] overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 dark:to-black/40" />
          </div>
        </Link>

        {/* Content half */}
        <div className="bg-white dark:bg-dark-card p-6 flex flex-col justify-between">
          <div>
            {article.source && (
              <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
                {article.source}
              </p>
            )}
            <Link to={`/article/${article.id}`}>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug mb-3 line-clamp-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-dark-muted line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-7 h-7 rounded-full ring-2 ring-primary-100 dark:ring-primary-900/30 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-white">{article.author}</p>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted">{formatDate(article.publishedAt)}</p>
              </div>
            </div>
            <Link
              to={`/article/${article.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/30 transition-all"
            >
              Read <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ Trending Sidebar ══════════════════════════════ */

const TrendingSidebar = ({ articles, loading }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm">
    {/* Header */}
    <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-gray-100 dark:border-dark-border">
      <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
        <TrendingUpIcon />
      </div>
      <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Trending Now</h3>
    </div>

    <div className="divide-y divide-gray-50 dark:divide-dark-border">
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonTrendingItem key={i} />)
      ) : (
        articles.slice(0, 6).map((article, idx) => {
          const isTop3 = idx < 3;
          return (
            <Link
              key={article.id}
              to={article.isApiArticle ? '#' : `/article/${article.id}`}
              onClick={article.isApiArticle ? (e) => { e.preventDefault(); window.open(article.externalUrl, '_blank', 'noopener'); } : undefined}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border/50 group transition-colors"
            >
              {/* Rank number / hot badge */}
              <span
                className={`
                  flex-shrink-0 w-6 text-center font-black leading-none mt-0.5 text-[15px]
                  ${isTop3 ? 'text-primary-500 dark:text-primary-400' : 'text-gray-200 dark:text-dark-border'}
                `}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {article.title}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-1.5">
                  {article.source && <span className="font-semibold mr-1">{article.source} ·</span>}
                  {formatDate(article.publishedAt)}
                </p>
              </div>
            </Link>
          );
        })
      )}
    </div>

    {/* See all link */}
    <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
      <Link
        to="/categories"
        className="flex items-center justify-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
      >
        See all news <ArrowRightIcon />
      </Link>
    </div>
  </div>
);

/* ══════════════════ Newsletter CTA ════════════════════════════════ */

const NewsletterCTA = () => {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

      <div className="relative">
        <span className="inline-block text-2xl mb-2">📬</span>
        <p className="text-white/75 text-[10px] font-black uppercase tracking-widest mb-1">Daily Digest</p>
        <h3 className="text-white font-extrabold text-base mb-1.5">Stay in the loop</h3>
        <p className="text-white/65 text-xs mb-4 leading-relaxed">
          Top stories, curated daily. No spam, ever.
        </p>

        {sent ? (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white/20 rounded-xl text-white text-sm font-semibold animate-bounce-in">
            ✅ You're subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3 py-2.5 text-sm bg-white/20 border border-white/25 rounded-xl text-white placeholder-white/55 outline-none focus:bg-white/30 focus:border-white/50 transition-all"
            />
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-white text-primary-700 font-extrabold text-sm rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              Subscribe Free →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════ HOME PAGE ══════════════════════════════ */

const Home = () => {
  const apiLive   = isApiConfigured();
  const [spinning, setSpinning] = useState(false);

  const { articles, loading, error, refetch } = useTopHeadlines({ pageSize: 20 });

  /* Animated refresh */
  const handleRefresh = useCallback(async () => {
    setSpinning(true);
    await refetch();
    setTimeout(() => setSpinning(false), 800);
  }, [refetch]);

  /* Split data into sections */
  const heroArticles    = articles.slice(0, 2);
  const editorPick      = articles[2] ?? null;
  const gridArticles    = articles.slice(3, 9);   // 6 cards → 3×2 grid
  const trendingArticles = articles.slice(0, 6);

  return (
    <>
      {/* ── Breaking news ticker ──────────────────────────────────── */}
      {!loading && articles.length > 0 && (
        <BreakingNewsTicker headlines={articles} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Live/error status row ─────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          {apiLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-xs font-semibold text-green-700 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live · NewsAPI.org
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Demo mode
            </div>
          )}

          {!loading && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-dark-border text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              <RefreshIcon spinning={spinning} />
              Refresh feed
            </button>
          )}
        </div>

        {/* ── Error banner ─────────────────────────────────────────── */}
        {error && !loading && (
          <div className="animate-slide-down">
            <ErrorState message={error} onRetry={handleRefresh} compact />
          </div>
        )}

        {/* ── 1. Hero / Featured Carousel ───────────────────────── */}
        <HeroSection articles={heroArticles} loading={loading} />

        {/* ── 2. Browse Topics ──────────────────────────────────── */}
        <BrowseTopics />

        {/* ── 3. Top Headlines + Sidebar ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: headlines */}
          <div className="lg:col-span-2 space-y-8">

            {/* Section title */}
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Top Headlines Today"
                badge={loading ? null : articles.length}
                live={apiLive}
              />
            </div>

            {/* Editor's Pick (spans 2 cols inside the 2-col grid) */}
            {loading ? (
              <div className="animate-pulse">
                <SkeletonCard />
              </div>
            ) : (
              <EditorsPick article={editorPick} loading={false} />
            )}

            {/* 3-col grid of remaining articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="animate-pulse"
                  >
                    <SkeletonCard />
                  </div>
                ))
              ) : (
                gridArticles.map((article, i) => (
                  <StaggeredCard key={article.id} article={article} index={i} />
                ))
              )}
            </div>

            {/* "More news" link */}
            {!loading && (
              <div className="flex justify-center pt-2 animate-fade-in">
                <Link
                  to="/categories"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-400 text-sm font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:hover:bg-primary-600 dark:hover:text-white transition-all duration-200 group"
                >
                  Load more stories
                  <ArrowRightIcon />
                </Link>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 self-start">

            {/* Trending */}
            <TrendingSidebar articles={trendingArticles} loading={loading} />

            {/* Newsletter */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <NewsletterCTA />
            </div>

            {/* Quick stats chip row */}
            {!loading && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                {[
                  { label: 'Stories',  value: articles.length, icon: '📰' },
                  { label: 'Topics',   value: 6,               icon: '📂' },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-center shadow-sm"
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">{value}</span>
                    <span className="text-[10px] text-gray-400 dark:text-dark-muted font-semibold uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
};

export default Home;
