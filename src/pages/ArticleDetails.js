/**
 * ArticleDetails.js — Premium reading experience for individual articles.
 *
 * Features:
 *  • Immersive Hero Header (large image with gradient overlay for title/meta)
 *  • Smooth staggered entrance animations (`animate-slide-up` with delays)
 *  • Sticky action bar for share & bookmark on desktop
 *  • Elegant typography optimized for reading
 *  • "Read Full Article" CTA for API-sourced content
 *  • Smooth back navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { getArticleById, getCategoryInfo, formatDate, articles as mockArticles } from '../data/newsData';
import { getCachedArticle } from '../api/articleCache';
import NewsCard from '../components/NewsCard';

/* ══════════════════════════ Icons ══════════════════════════════════ */

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const BookmarkFilledIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const BookmarkOutlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/* ══════════════════════════ Skeleton ═══════════════════════════════ */

const ArticleSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero skeleton */}
    <div className="w-full h-[50vh] min-h-[400px] bg-gray-200 dark:bg-dark-surface rounded-b-[2.5rem] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-dark-surface dark:via-dark-border dark:to-dark-surface animate-shimmer bg-[length:400%_100%]" />
      <div className="absolute bottom-10 left-4 right-4 max-w-4xl mx-auto space-y-4">
        <div className="h-4 w-24 bg-white/20 rounded-full backdrop-blur-sm" />
        <div className="h-10 md:h-14 w-3/4 bg-white/20 rounded-xl backdrop-blur-sm" />
        <div className="h-6 w-1/2 bg-white/20 rounded-lg backdrop-blur-sm" />
      </div>
    </div>
    {/* Body skeleton */}
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <div className="h-5 w-full bg-gray-200 dark:bg-dark-surface rounded-md" />
      <div className="h-5 w-full bg-gray-200 dark:bg-dark-surface rounded-md" />
      <div className="h-5 w-4/5 bg-gray-200 dark:bg-dark-surface rounded-md" />
      <div className="h-5 w-full bg-gray-200 dark:bg-dark-surface rounded-md mt-10" />
      <div className="h-5 w-5/6 bg-gray-200 dark:bg-dark-surface rounded-md" />
    </div>
  </div>
);

/* ══════════════════════════ Article Details ════════════════════════ */

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);
  const [related, setRelated] = useState([]);

  /* ── Fetch Data ─────────────────────────────────────────────────── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);

    const timer = setTimeout(() => {
      // Priority 1: Mock data array (fast)
      // Priority 2: In-memory articleCache for API results
      const found = getArticleById(id) || getCachedArticle(id);
      setArticle(found);

      if (found) {
        // Find 3 mock articles from the same category to act as "Related"
        const relatedArticles = mockArticles
          .filter(a => a.id !== found.id && a.category === found.category)
          .slice(0, 3);
        setRelated(relatedArticles);
      }
      setLoading(false);
    }, 400); // slight artificial delay for smooth transition

    return () => clearTimeout(timer);
  }, [id]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleBookmark = () => {
    if (!article) return;
    isBookmarked(article.id)
      ? removeBookmark(article.id)
      : addBookmark(article);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ── Render loading/error ───────────────────────────────────────── */
  if (loading) return <ArticleSkeleton />;

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
        <div className="text-8xl mb-6">🏜️</div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
          Story not found
        </h2>
        <p className="text-gray-500 dark:text-dark-muted mb-8 max-w-sm">
          It looks like this article has been moved, deleted, or never existed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-opacity"
        >
          <ArrowLeftIcon /> Back to Home
        </button>
      </div>
    );
  }

  /* ── Derived data ───────────────────────────────────────────────── */
  const categoryInfo = getCategoryInfo(article.category);
  const bookmarked   = isBookmarked(article.id);
  const isApiArticle = article.isApiArticle;

  // Split content cleanly
  const paragraphs = (article.content || article.excerpt || '')
    .split('\n\n')
    .filter(p => p.trim() !== '');

  return (
    <article className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">

      {/* ══ 1. Floating Back Button ════════════════════════════════ */}
      <div className="absolute top-20 left-4 sm:left-6 lg:left-10 z-20 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-full
            bg-black/20 hover:bg-black/40 text-white backdrop-blur-md
            border border-white/10 shadow-lg
            transition-all duration-200 group text-sm font-bold
          "
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            <ArrowLeftIcon />
          </span>
          Back
        </button>
      </div>

      {/* ══ 2. Immersive Hero Image ════════════════════════════════ */}
      <header className="relative w-full h-[60vh] min-h-[450px] max-h-[700px] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] animate-fade-in">
        {/* Background Image */}
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

        {/* Title Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 pb-12 pt-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Tags/Category */}
            <div
              style={{ animationDelay: '100ms', animationFillMode: 'both' }}
              className="flex flex-wrap items-center gap-3 mb-5 animate-slide-up"
            >
              {categoryInfo && (
                <Link
                  to={`/categories?cat=${article.category}`}
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold text-white shadow-md
                    backdrop-blur-md bg-white/20 border border-white/10
                    flex items-center gap-1.5 hover:bg-white/30 transition-colors
                  `}
                >
                  {categoryInfo.icon} {categoryInfo.name}
                </Link>
              )}
              {article.trending && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md flex items-center gap-1.5">
                  🔥 Trending
                </span>
              )}
              {article.source && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white border border-white/10 backdrop-blur-md">
                  {article.source}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{ animationDelay: '200ms', animationFillMode: 'both' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg"
            >
              {article.title}
            </h1>

            {/* Meta Row (Author, Date, Time) */}
            <div
              style={{ animationDelay: '300ms', animationFillMode: 'both' }}
              className="flex items-center gap-4 text-gray-200 animate-slide-up"
            >
              <img
                src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                alt={article.author}
                className="w-12 h-12 rounded-full border-2 border-white/20"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white leading-tight">{article.author}</span>
                <div className="flex items-center gap-2 text-sm text-gray-300/80">
                  <ClockIcon />
                  <time>{formatDate(article.publishedAt)}</time>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>{article.readTime || '5 min read'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ══ 3. Content Layer ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
        
        {/* Main reading column */}
        <div className="max-w-3xl mx-auto w-full">

          {/* Intro / Excerpt */}
          <div
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
            className="animate-slide-up mb-10"
          >
            <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed font-serif tracking-tight">
              {article.excerpt}
            </p>
          </div>

          {/* Action Bar (Mobile only, desktop is sticky in sidebar) */}
          <div className="lg:hidden flex items-center gap-3 mb-10 pb-8 border-b border-gray-100 dark:border-dark-border">
            <button
              onClick={handleBookmark}
              className={`
                flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all
                ${bookmarked
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-2 border-primary-200 dark:border-primary-800'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-dark-border'
                }
              `}
            >
              {bookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
              {bookmarked ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-200 font-bold text-sm border-2 border-transparent hover:border-gray-300 dark:hover:border-dark-border transition-all"
            >
              <ShareIcon />
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>

          {/* Actual Article Content */}
          <div
            style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            className="animate-slide-up prose prose-lg md:prose-xl prose-gray dark:prose-invert hover:prose-a:text-primary-500 max-w-none"
          >
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-gray-700 dark:text-gray-300 leading-[1.8] mb-6 tracking-wide font-sans text-lg sm:text-[19px]"
              >
                {para}
              </p>
            ))}

            {/* Call to action for truncated API articles */}
            {isApiArticle && (
              <div className="not-prose mt-12 mb-8 relative rounded-[2rem] overflow-hidden group">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br transition-all duration-300 from-gray-900 via-slate-800 to-black group-hover:scale-105" />
                
                <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">Continue reading</h3>
                    <p className="text-gray-400 text-sm max-w-sm">
                      This is a preview. Read the full story and support independent journalism on <span className="font-bold text-white">{article.source}</span>.
                    </p>
                  </div>
                  
                  <a
                    href={article.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5
                      bg-white text-gray-900 shadow-xl shadow-black/20
                      rounded-2xl font-black text-sm hover:bg-gray-100
                      hover:-translate-y-1 transition-all duration-300
                    "
                  >
                    Read on Source <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar (Desktop Sticky Actions) */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-28 space-y-6">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Share & Save</p>
            
            <button
              onClick={handleBookmark}
              title={bookmarked ? "Remove bookmark" : "Save article"}
              className={`
                w-14 h-14 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300
                ${bookmarked
                  ? 'bg-primary-600 text-white shadow-primary-500/40 hover:-translate-y-1'
                  : 'bg-white dark:bg-dark-card text-gray-400 hover:text-primary-500 hover:-translate-y-1 hover:shadow-xl dark:border dark:border-dark-border'
                }
              `}
            >
              {bookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
            </button>

            <button
              onClick={handleShare}
              title="Copy link"
              className="
                w-14 h-14 mx-auto flex items-center justify-center rounded-2xl shadow-lg
                bg-white dark:bg-dark-card text-gray-400 hover:text-primary-500
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                dark:border dark:border-dark-border
              "
            >
              <ShareIcon />
            </button>
            {copied && (
              <p className="text-xs font-bold text-primary-500 text-center animate-slide-up">
                Link copied!
              </p>
            )}
          </div>
        </aside>

      </div>

      {/* ══ 4. Related Articles ════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="bg-gray-50 dark:bg-[#151921] py-16 lg:py-24 border-t border-gray-200 dark:border-dark-border transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Related Stories</h2>
              <Link
                to={`/categories?cat=${article.category}`}
                className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                More {categoryInfo?.name} <ExternalLinkIcon />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a, i) => (
                <div
                  key={a.id}
                  style={{ animationDelay: `${i * 100}ms` }}
                  className="animate-slide-up"
                >
                  <NewsCard article={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  );
};

export default ArticleDetails;
