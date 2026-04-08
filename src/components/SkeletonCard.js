/**
 * SkeletonCard.js — pixel-perfect loading skeletons for every
 * card variant used in the app.
 *
 * The shimmer animation is defined in tailwind.config.js and used
 * via `animate-shimmer`. Each block mirrors the real card's layout
 * so the transition from skeleton → content is seamless.
 */

import React from 'react';

/* ── Shared shimmer block ────────────────────────────────────────── */
const Shimmer = ({ className = '' }) => (
  <div
    className={`
      bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
      dark:from-dark-border dark:via-dark-surface dark:to-dark-border
      animate-shimmer bg-[length:200%_100%]
      rounded ${className}
    `}
  />
);

/* ══════════════ Default card skeleton ══════════════════════════════ */

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm">
    {/* Image placeholder */}
    <Shimmer className="aspect-[16/10] w-full rounded-none" />

    <div className="p-5 space-y-3">
      {/* Date line */}
      <Shimmer className="h-3 w-20 rounded-full" />

      {/* Title — two lines */}
      <div className="space-y-2">
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-4/5 rounded" />
      </div>

      {/* Excerpt — two lines */}
      <div className="space-y-1.5">
        <Shimmer className="h-3 w-full rounded" />
        <Shimmer className="h-3 w-11/12 rounded" />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent my-1" />

      {/* Footer: avatar + button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Shimmer className="w-7 h-7 rounded-full" />
          <Shimmer className="h-3 w-24 rounded" />
        </div>
        <Shimmer className="h-7 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ══════════════ Featured hero skeleton ══════════════════════════════ */

export const SkeletonFeatured = () => (
  <Shimmer className="aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl" />
);

/* ══════════════ Compact sidebar skeleton ════════════════════════════ */

export const SkeletonCompact = () => (
  <div className="flex items-start gap-3 p-3">
    <Shimmer className="w-[72px] h-[72px] flex-shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2 py-1">
      <Shimmer className="h-2.5 w-16 rounded-full" />
      <Shimmer className="h-3.5 w-full rounded" />
      <Shimmer className="h-3.5 w-4/5 rounded" />
      <Shimmer className="h-2.5 w-28 rounded" />
    </div>
  </div>
);

/* ══════════════ Horizontal card skeleton (bookmarks) ════════════════ */

export const SkeletonHorizontal = () => (
  <div className="flex items-start gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border">
    <Shimmer className="w-28 h-24 sm:w-36 sm:h-28 flex-shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2.5 py-1">
      <div className="flex items-center gap-2">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-3.5 w-14 rounded" />
      </div>
      <Shimmer className="h-4 w-full rounded" />
      <Shimmer className="h-4 w-4/5 rounded" />
      <Shimmer className="h-3 w-full rounded" />
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Shimmer className="w-5 h-5 rounded-full" />
          <Shimmer className="h-3 w-20 rounded" />
          <Shimmer className="h-3 w-16 rounded" />
        </div>
        <Shimmer className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

/* ══════════════ Trending list skeleton ══════════════════════════════ */

export const SkeletonTrendingItem = () => (
  <div className="flex items-start gap-3 p-2">
    <Shimmer className="w-6 h-6 rounded flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-1.5">
      <Shimmer className="h-3.5 w-full rounded" />
      <Shimmer className="h-3.5 w-4/5 rounded" />
      <Shimmer className="h-2.5 w-24 rounded" />
    </div>
  </div>
);

/* ══════════════ Composite grid skeleton ═════════════════════════════ */

const SkeletonGrid = ({ count = 6, showFeatured = false, cols = 3 }) => (
  <div className="space-y-8">
    {showFeatured && <SkeletonFeatured />}
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export { SkeletonGrid };
export default SkeletonCard;
