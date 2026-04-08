import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/newsData';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SN</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                Smart<span className="gradient-text">News</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-muted max-w-xs leading-relaxed">
              Your intelligent news companion. Stay informed with curated stories from technology, science, business, and beyond.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/categories?cat=${cat.id}`}
                    className="text-sm text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Categories', to: '/categories' },
                { label: 'Bookmarks', to: '/bookmarks' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-dark-muted">
            © {new Date().getFullYear()} SmartNews. Built with React & Tailwind CSS.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-muted">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for modern readers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
