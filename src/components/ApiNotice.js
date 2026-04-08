import React, { useState } from 'react';

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/**
 * ApiNotice — dismissible banner explaining mock-data mode.
 *
 * Shows automatically when no valid API key is configured.
 * Provides a direct link to the NewsAPI registration page.
 */
const ApiNotice = () => {
  const [dismissed, setDismissed] = useState(() =>
    sessionStorage.getItem('apiNoticeDismissed') === 'true'
  );

  const dismiss = () => {
    sessionStorage.setItem('apiNoticeDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden animate-slide-down">
      {/* Background with gradient border */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <KeyIcon />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Demo mode</span>
                <span className="hidden sm:inline"> — showing sample articles. </span>
                <span className="sm:hidden"> · </span>
                Add your free{' '}
                <a
                  href="https://newsapi.org/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2 inline-flex items-center gap-1 hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
                >
                  NewsAPI key <ExternalLinkIcon />
                </a>
                {' '}to see live headlines.
              </p>
            </div>

            {/* Setup steps (desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-700/50 font-mono">
              <span>REACT_APP_NEWS_API_KEY=</span>
              <span className="text-amber-500">your_key</span>
              <span className="ml-1 px-1.5 py-0.5 bg-amber-200 dark:bg-amber-800/60 rounded text-[10px] font-sans font-semibold">.env</span>
            </div>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss notice"
              className="flex-shrink-0 p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            >
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiNotice;
