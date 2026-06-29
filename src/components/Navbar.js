import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────── SVG icons ─────────────────────────── */

const LogoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
    <path d="M7 9h5l3 9 3-9h5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="14" cy="18.5" r="1.5" fill="white"/>
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/>
        <stop offset="1" stopColor="#ec4899"/>
      </linearGradient>
    </defs>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="4"/>
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
  </svg>
);

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const BookmarkOutlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
  </svg>
);

/* ─────────────────────── Nav link definitions ──────────────────── */

const navLinks = [
  {
    label: 'Home',
    to: '/',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/categories',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    ),
  },
  {
    label: 'Bookmarks',
    to: '/bookmarks',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    ),
  },
];

/* ─────────────────────── Hamburger component ───────────────────── */

const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
    className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl
               text-gray-600 dark:text-gray-300
               hover:bg-gray-100 dark:hover:bg-dark-border
               active:scale-90
               transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
  >
    {/* Three bars that morph into an X */}
    <span className="sr-only">{isOpen ? 'Close' : 'Menu'}</span>
    <div className="w-5 h-[14px] relative flex flex-col justify-between">
      <span
        className={`block h-[2px] rounded-full bg-current origin-center transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-[6px]' : ''
        }`}
      />
      <span
        className={`block h-[2px] rounded-full bg-current transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-0 scale-x-0' : ''
        }`}
      />
      <span
        className={`block h-[2px] rounded-full bg-current origin-center transition-all duration-300 ease-in-out ${
          isOpen ? '-rotate-45 -translate-y-[6px]' : ''
        }`}
      />
    </div>
  </button>
);

/* ──────────────────────── Dark mode toggle ─────────────────────── */

const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className={`
      relative w-[52px] h-[28px] rounded-full border-2 transition-all duration-300 ease-in-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50
      ${isDark
        ? 'bg-primary-600 border-primary-500 shadow-lg shadow-primary-500/30'
        : 'bg-gray-200 border-gray-300 dark:border-dark-border'}
    `}
  >
    {/* Track highlight */}
    <span className={`absolute inset-0 rounded-full transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 opacity-80" />
    </span>

    {/* Sliding knob */}
    <span
      className={`
        absolute top-[3px] w-[18px] h-[18px] rounded-full shadow-md flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${isDark
          ? 'left-[26px] bg-white text-primary-600'
          : 'left-[3px] bg-white text-gray-500'}
      `}
    >
      <span className="animate-spin-once" key={isDark ? 'moon' : 'sun'}>
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </span>
  </button>
);

/* ──────────────────────── Search bar ───────────────────────────── */

const SearchBar = ({ value, onChange, onSubmit, onClear, inputRef }) => (
  <form onSubmit={onSubmit} className="hidden sm:flex items-center">
    <div className="relative group">
      {/* Icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200">
        <SearchIcon />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search news..."
        aria-label="Search articles"
        className="
          pl-9 py-2 text-sm rounded-xl outline-none
          bg-gray-100 dark:bg-dark-surface
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          border-2 border-transparent
          focus:border-primary-500 focus:bg-white dark:focus:bg-dark-card
          focus:shadow-lg focus:shadow-primary-500/10
          transition-all duration-300 ease-in-out
          w-36 focus:w-52 lg:w-48 lg:focus:w-72
        "
      />

      {/* Clear / Submit button */}
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <XIcon />
        </button>
      ) : (
        <button
          type="submit"
          className="absolute inset-y-0 right-2 hidden group-focus-within:flex items-center px-1
                     text-primary-600 dark:text-primary-400 transition-all"
          aria-label="Submit search"
        >
          <span className="text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-md">↵</span>
        </button>
      )}
    </div>
  </form>
);

/* ─────────────────────── Bookmark badge ────────────────────────── */

const BookmarkBadge = ({ count }) => (
  <Link
    to="/bookmarks"
    aria-label={`Bookmarks (${count} saved)`}
    className="
      relative p-2 rounded-xl
      text-gray-600 dark:text-gray-300
      hover:text-primary-600 dark:hover:text-primary-400
      hover:bg-primary-50 dark:hover:bg-primary-900/20
      active:scale-90
      transition-all duration-200
    "
  >
    <BookmarkOutlineIcon />
    {count > 0 && (
      <span
        key={count}
        className="
          absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
          bg-gradient-to-br from-primary-500 to-accent-500
          text-white text-[10px] font-bold rounded-full
          flex items-center justify-center
          animate-bounce-in shadow-lg shadow-primary-500/40
        "
      >
        {count > 9 ? '9+' : count}
      </span>
    )}
  </Link>
);

/* ═══════════════════════ Main Navbar ═══════════════════════════════ */

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* Scroll-aware shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  /* Global ⌘K / Ctrl K shortcut */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full
          bg-white/80 dark:bg-dark-bg/80
          backdrop-blur-xl
          border-b border-gray-200/60 dark:border-dark-border/60
          transition-shadow duration-300
          ${scrolled ? 'shadow-lg shadow-black/5 dark:shadow-black/30' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="SmartNews home"
            >
              <div className="w-8 h-8 flex-shrink-0 drop-shadow-md group-hover:drop-shadow-lg group-hover:scale-110 transition-all duration-300 ease-out">
                <LogoIcon />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight text-gray-900 dark:text-white group-hover:opacity-80 transition-opacity duration-200">
                Smart<span className="gradient-text">News</span>
              </span>
            </Link>

            {/* ── Desktop Nav links ── */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={({ isActive }) => `
                    relative group flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    animate-nav-item
                    ${isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-dark-border/60'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-500' : ''}`}>
                        {link.icon}
                      </span>

                      {link.label}

                      {/* Active pill bg */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-xl bg-primary-50 dark:bg-primary-900/25 -z-10 animate-scale-in" />
                      )}

                      {/* Active underline bar */}
                      <span
                        className={`
                          absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-t-full
                          bg-gradient-to-r from-primary-500 to-accent-500
                          transition-all duration-300 ease-out
                          ${isActive ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover:w-[40%] group-hover:opacity-50'}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── Right action cluster ── */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Search */}
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSubmit={handleSearch}
                onClear={clearSearch}
                inputRef={searchInputRef}
              />

              {/* Keyboard shortcut hint (shown on md+) */}
              <span className="hidden lg:flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600 font-medium select-none">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-border border border-gray-200 dark:border-dark-border/80 text-gray-500 dark:text-gray-400">⌘K</kbd>
              </span>

              {/* Divider */}
              <span className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-dark-border mx-1" />

              {/* Bookmark badge */}
              <BookmarkBadge count={bookmarks.length} />

              {/* User Greeting & Logout */}
              {user && (
                <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-gray-200 dark:border-dark-border pl-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Welcome</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Hamburger */}
              <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(o => !o)} />
            </div>
          </div>
        </div>

        {/* ── Progress bar (decorative, shows on scroll) ── */}
        <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 transition-all duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`} style={{ width: '100%' }} />
      </header>

      {/* ═══════════ Mobile menu overlay + drawer ═══════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-16 left-0 right-0 z-40
          bg-white dark:bg-dark-bg
          border-b border-gray-200 dark:border-dark-border
          shadow-2xl shadow-black/10 dark:shadow-black/40
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        aria-label="Mobile navigation"
        role="navigation"
      >
        <div className="px-4 pt-4 pb-5 space-y-4">

          {/* Mobile search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <SearchIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics or tags..."
                className="
                  w-full pl-10 pr-10 py-3 text-sm rounded-xl outline-none
                  bg-gray-100 dark:bg-dark-surface
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  border-2 border-transparent focus:border-primary-500
                  transition-all duration-200
                "
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XIcon />
                </button>
              )}
            </div>
          </form>

          {/* Nav links */}
          <nav className="space-y-1">
            {navLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={{
                  animationDelay: isMenuOpen ? `${i * 55}ms` : '0ms',
                }}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl w-full
                  text-sm font-semibold
                  transition-all duration-200
                  ${isMenuOpen ? 'animate-slide-down' : ''}
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-50 to-accent-500/5 dark:from-primary-900/30 dark:to-accent-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-dark-border/70 border border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className={`p-1.5 rounded-lg ${isActive ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-gray-400'}`}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    {link.to === '/bookmarks' && bookmarks.length > 0 && (
                      <span className="ml-auto text-[10px] font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
                        {bookmarks.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User info (mobile only) */}
          {user && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-dark-muted truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}

          {/* Footer row inside drawer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">
              {isDark ? '🌙 Dark mode on' : '☀️ Light mode on'}
            </span>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
