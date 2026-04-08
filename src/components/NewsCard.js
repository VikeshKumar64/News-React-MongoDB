import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { saveBookmark } from '../api/serverApi';
import { getCategoryInfo, formatDate } from '../data/newsData';

/* ──────────────────────────── SVG Icons ─────────────────────────── */

const BookmarkFilledIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const BookmarkOutlineIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ClockIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SourceIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const ArrowRightIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ──────────────────── Image with shimmer skeleton ───────────────── */

const CardImage = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Shimmer skeleton while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-dark-border dark:via-dark-surface dark:to-dark-border animate-shimmer bg-[length:200%_100%]" />
      )}

      {!error ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-dark-border gap-2">
          <span className="text-3xl">📰</span>
          <span className="text-xs text-gray-400">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

/* ──────────────────── Bookmark button (shared) ─────────────────── */

const BookmarkBtn = ({ bookmarked, onClick, variant = 'card' }) => {
  const [pop, setPop] = useState(false);

  const handleClick = (e) => {
    onClick(e);
    setPop(true);
    setTimeout(() => setPop(false), 400);
  };

  if (variant === 'overlay') {
    return (
      <button
        onClick={handleClick}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
        className={`
          p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-90
          ${pop ? 'scale-125' : 'scale-100'}
          ${bookmarked
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40'
            : 'bg-black/30 text-white hover:bg-primary-500/80'}
        `}
      >
        {bookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
      className={`
        p-1.5 rounded-lg transition-all duration-200 active:scale-90
        ${pop ? 'scale-125' : 'scale-100'}
        ${bookmarked
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
          : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'}
      `}
    >
      {bookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════════
   DEFAULT card – the main grid card with all features
══════════════════════════════════════════════════════════════════ */

const DefaultCard = ({ article, categoryInfo, bookmarked, onBookmark }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative flex flex-col bg-white dark:bg-dark-card
        rounded-2xl overflow-hidden
        border border-gray-100/80 dark:border-dark-border/60
        transition-all duration-300 ease-out
        ${hovered
          ? 'shadow-2xl shadow-black/10 dark:shadow-black/40 -translate-y-1.5 border-primary-100 dark:border-primary-900/40'
          : 'shadow-sm hover:shadow-md'
        }
      `}
    >
      {/* ── Image zone ── */}
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
        {/* Actual image */}
        <div className={`w-full h-full transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}>
          <CardImage src={article.image} alt={article.title} className="w-full h-full" />
        </div>

        {/* Dark gradient for overlaid text readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-60'}`} />

        {/* Category badge – top left */}
        {categoryInfo && (
          <div className="absolute top-3 left-3">
            <span className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
              backdrop-blur-md bg-white/85 dark:bg-dark-card/85 shadow-sm
              ${categoryInfo.color}
              border border-white/40 dark:border-dark-border/40
            `}>
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.name}</span>
            </span>
          </div>
        )}

        {/* Trending badge – top right */}
        {article.trending && (
          <div className="absolute top-3 right-12">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg backdrop-blur-sm">
              🔥 Hot
            </span>
          </div>
        )}

        {/* Bookmark button – top right corner */}
        <div className="absolute top-2.5 right-2.5">
          <BookmarkBtn bookmarked={bookmarked} onClick={onBookmark} variant="overlay" />
        </div>

        {/* Source name – overlaid bottom left on image */}
        {article.source && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-semibold tracking-wide">
              <SourceIcon className="w-3 h-3" />
              {article.source}
            </div>
          </div>
        )}

        {/* Read time – overlaid bottom right on image */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-medium">
            <ClockIcon className="w-3 h-3" />
            {article.readTime}
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Published date */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-dark-muted mb-2.5 font-medium tracking-wide uppercase">
          <ClockIcon className="w-3 h-3" />
          {formatDate(article.publishedAt)}
        </div>

        {/* Title */}
        <h3 className={`
          font-bold leading-snug mb-2.5 line-clamp-2 text-[15px]
          transition-colors duration-200
          ${hovered ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}
        `}>
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-dark-muted line-clamp-2 leading-relaxed flex-1 mb-4">
          {article.excerpt}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent mb-4" />

        {/* Footer: author + Read More */}
        <div className="flex items-center justify-between gap-3">
          {/* Author info */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={article.authorAvatar}
              alt={article.author}
              className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-dark-border flex-shrink-0 object-cover"
            />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
              {article.author}
            </span>
          </div>

          {/* Read More CTA */}
          <Link
            to={`/article/${article.id}`}
            onClick={(e) => e.stopPropagation()}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold
              transition-all duration-200 group/btn
              ${hovered
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'}
            `}
          >
            <span>Read More</span>
            <ArrowRightIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${hovered ? 'translate-x-0.5' : ''}`} />
          </Link>
        </div>
      </div>

      {/* ── Bottom accent line on hover ── */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 transition-all duration-300 rounded-b-2xl ${hovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
    </article>
  );
};

/* ══════════════════════════════════════════════════════════════════
   FEATURED hero card
══════════════════════════════════════════════════════════════════ */

const FeaturedCard = ({ article, categoryInfo, bookmarked, onBookmark }) => (
  <Link to={`/article/${article.id}`} className="group relative block overflow-hidden rounded-2xl">
    <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
        <CardImage src={article.image} alt={article.title} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
    </div>

    {/* Overlay content */}
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        {categoryInfo && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/90 text-white backdrop-blur-sm shadow-lg">
            {categoryInfo.icon} {categoryInfo.name}
          </span>
        )}
        {article.trending && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-white backdrop-blur-sm shadow-lg">
            🔥 Trending
          </span>
        )}
        {article.source && (
          <span className="flex items-center gap-1 text-white/70 text-xs font-medium">
            <SourceIcon className="w-3.5 h-3.5" />
            {article.source}
          </span>
        )}
      </div>

      <h2 className="text-white font-extrabold text-xl md:text-3xl line-clamp-2 mb-3 leading-tight drop-shadow-sm">
        {article.title}
      </h2>
      <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-5 hidden md:block max-w-3xl leading-relaxed">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={article.authorAvatar} alt={article.author} className="w-9 h-9 rounded-full border-2 border-white/40 object-cover" />
          <div>
            <p className="text-white text-sm font-semibold">{article.author}</p>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <ClockIcon />
              <span>{formatDate(article.publishedAt)}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Read More button */}
          <span className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/20 transition-all duration-200 group-hover:bg-primary-500 group-hover:border-primary-400">
            Read More <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <BookmarkBtn bookmarked={bookmarked} onClick={onBookmark} variant="overlay" />
        </div>
      </div>
    </div>
  </Link>
);

/* ══════════════════════════════════════════════════════════════════
   COMPACT sidebar card
══════════════════════════════════════════════════════════════════ */

const CompactCard = ({ article, categoryInfo }) => (
  <Link to={`/article/${article.id}`} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-all duration-200">
    {/* Thumbnail */}
    <div className="w-[72px] h-[72px] flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
      <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
        <CardImage src={article.image} alt={article.title} className="w-full h-full" />
      </div>
    </div>

    <div className="min-w-0 flex-1 py-0.5">
      {/* Source + category row */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`text-[10px] font-bold uppercase tracking-wide ${categoryInfo ? `text-${categoryInfo.color.match(/text-(\w+-\d+)/)?.[1] || 'primary-600'}` : 'text-primary-600 dark:text-primary-400'}`}>
          {categoryInfo?.name}
        </span>
        {article.source && (
          <>
            <span className="text-gray-300 dark:text-dark-border text-[10px]">·</span>
            <span className="text-[10px] text-gray-400 dark:text-dark-muted font-medium">{article.source}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {article.title}
      </h4>

      {/* Date + read time */}
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-dark-muted text-[11px]">
        <ClockIcon className="w-3 h-3" />
        <span>{formatDate(article.publishedAt)}</span>
        <span>·</span>
        <span>{article.readTime}</span>
      </div>
    </div>
  </Link>
);

/* ══════════════════════════════════════════════════════════════════
   HORIZONTAL card – for list views (e.g. bookmarks)
══════════════════════════════════════════════════════════════════ */

const HorizontalCard = ({ article, categoryInfo, bookmarked, onBookmark }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group flex items-start gap-4 p-4 rounded-2xl
        bg-white dark:bg-dark-card
        border border-gray-100 dark:border-dark-border
        transition-all duration-300
        ${hovered ? 'shadow-xl shadow-black/8 dark:shadow-black/30 -translate-y-0.5 border-primary-100 dark:border-primary-900/40' : 'shadow-sm'}
      `}
    >
      {/* Thumbnail */}
      <Link to={`/article/${article.id}`} className="flex-shrink-0 w-28 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shadow-sm">
        <div className={`w-full h-full transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}>
          <CardImage src={article.image} alt={article.title} className="w-full h-full" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Top row: category + source + bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {categoryInfo && (
              <span className={`badge ${categoryInfo.color} text-[10px]`}>
                {categoryInfo.icon} {categoryInfo.name}
              </span>
            )}
            {article.source && (
              <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-dark-muted font-medium">
                <SourceIcon className="w-3 h-3" />
                {article.source}
              </span>
            )}
          </div>
          <BookmarkBtn bookmarked={bookmarked} onClick={onBookmark} variant="card" />
        </div>

        {/* Title */}
        <Link to={`/article/${article.id}`}>
          <h3 className={`font-bold leading-snug line-clamp-2 text-sm sm:text-base transition-colors duration-200 ${hovered ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
            {article.title}
          </h3>
        </Link>

        {/* Description (hidden on small) */}
        <p className="hidden sm:block text-sm text-gray-500 dark:text-dark-muted line-clamp-1 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt={article.author} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-[11px] text-gray-500 dark:text-dark-muted font-medium">{article.author}</span>
            <span className="text-gray-200 dark:text-dark-border text-xs">·</span>
            <span className="text-[11px] text-gray-400 dark:text-dark-muted flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <Link
            to={`/article/${article.id}`}
            className={`
              hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold
              transition-all duration-200
              ${hovered
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'}
            `}
          >
            Read More <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ══════════════════════════════════════════════════════════════════
   Main export – NewsCard router
══════════════════════════════════════════════════════════════════ */

const NewsCard = ({ article, variant = 'default' }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(article.id);
  const categoryInfo = getCategoryInfo(article.category);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If user is logged in, persist to server as well
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    if (bookmarked) {
      removeBookmark(article.id);
      return;
    }

    addBookmark(article);
    if (user && (user._id || user.id)) {
      // Fire-and-forget; keep UI responsive. Simple error log on failure.
      saveBookmark({
        userId: user._id || user.id,
        title: article.title,
        description: article.excerpt || article.description || '',
        image: article.image || article.urlToImage || '',
        url: article.externalUrl || article.url || article.external_url || ''
      }).catch(err => console.error('Failed to save bookmark to server', err));
    }
  };

  switch (variant) {
    case 'featured':
      return <FeaturedCard article={article} categoryInfo={categoryInfo} bookmarked={bookmarked} onBookmark={handleBookmark} />;
    case 'compact':
      return <CompactCard article={article} categoryInfo={categoryInfo} />;
    case 'horizontal':
      return <HorizontalCard article={article} categoryInfo={categoryInfo} bookmarked={bookmarked} onBookmark={handleBookmark} />;
    default:
      return <DefaultCard article={article} categoryInfo={categoryInfo} bookmarked={bookmarked} onBookmark={handleBookmark} />;
  }
};

export default NewsCard;
