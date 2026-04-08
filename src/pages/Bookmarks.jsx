import React from 'react';
import { useBookmarks } from '../context/BookmarkContext';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  if (!bookmarks.length) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-28 text-center">
        <h1 className="text-2xl font-bold mb-3">No bookmarks yet</h1>
        <p className="text-gray-500">Save articles with the bookmark icon to see them here.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Bookmarks</h1>
      <div className="grid grid-cols-1 gap-4">
        {bookmarks.map((a) => (
          <div key={a.id} className="flex items-start gap-4">
            <img src={a.image} alt={a.title} className="w-36 h-24 object-cover rounded-lg" />
            <div className="flex-1">
              <h2 className="font-bold text-lg mb-1">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{a.excerpt}</p>
              <div className="flex items-center gap-2">
                <a href={a.externalUrl || a.url} target="_blank" rel="noreferrer" className="text-primary-600">Open</a>
                <button onClick={() => removeBookmark(a.id)} className="text-red-600">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
