import React from 'react';

/* SVG icons */
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.72 3h16.92a2 2 0 001.72-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const WifiOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12h.01M9.172 9.172a4 4 0 015.656 0M4.929 4.929A10 10 0 0112 2m0 0a10 10 0 017.071 2.929M2 12h20M2 2l20 20" />
  </svg>
);

/**
 * ErrorState — polished full-page error display with retry.
 *
 * Props:
 *   message   {string}   - Error message to show
 *   onRetry   {function} - Callback for retry button (omit to hide button)
 *   compact   {boolean}  - Smaller inline version (default: false)
 *   isNetwork {boolean}  - Show network-specific icon/text
 */
const ErrorState = ({ message, onRetry, compact = false, isNetwork = false }) => {
  const isNetworkErr = isNetwork || /network|connection|internet/i.test(message || '');

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 animate-fade-in">
        <AlertIcon />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Failed to load latest news</p>
          <p className="text-xs opacity-80 mt-0.5 truncate">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <RefreshIcon /> Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 flex items-center justify-center text-red-400 dark:text-red-500 mb-5 shadow-sm">
        {isNetworkErr ? <WifiOffIcon /> : <AlertIcon />}
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {isNetworkErr ? 'No internet connection' : 'Failed to load news'}
      </h3>

      {/* Error message */}
      {message && (
        <div className="mb-5 max-w-md">
          <code className="block px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface text-xs text-gray-600 dark:text-gray-400 font-mono break-words">
            {message}
          </code>
        </div>
      )}

      <p className="text-gray-500 dark:text-dark-muted text-sm mb-6 max-w-sm leading-relaxed">
        {isNetworkErr
          ? 'Check your internet connection and try again. Showing cached content in the meantime.'
          : 'Something went wrong fetching the latest headlines. Showing demo content below.'}
      </p>

      {/* Actions */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-500/30 transition-all duration-200"
        >
          <RefreshIcon />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
