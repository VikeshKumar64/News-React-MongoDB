import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBookmarks, saveBookmark as apiSaveBookmark, deleteBookmark as apiDeleteBookmark } from '../api/serverApi';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (user && (user.id || user._id)) {
      getBookmarks(user._id || user.id)
        .then(items => {
          if (!mounted) return;
          const mapped = items.map(b => ({
            id: b._id,
            title: b.title,
            excerpt: b.description,
            image: b.image,
            url: b.url,
            externalUrl: b.url,
          }));
          setBookmarks(mapped);
          localStorage.setItem('bookmarks', JSON.stringify(mapped));
        })
        .catch(console.error);
    } else {
      // Clear bookmarks if no user
      setBookmarks([]);
      localStorage.removeItem('bookmarks');
    }
    return () => { mounted = false; };
  }, [user?.id, user?._id]);

  const addBookmark = async (article) => {
    if (!user) return; // Prevent bookmarking if not logged in

    setBookmarks(prev => {
      if (prev.find(b => b.id === article.id || b.url === (article.externalUrl || article.url))) return prev;
      return [article, ...prev];
    });

    try {
      const serverArticle = await apiSaveBookmark({
        userId: user._id || user.id,
        title: article.title,
        description: article.excerpt || article.description || '',
        image: article.image || '',
        url: article.externalUrl || article.url || '',
      });
      
      setBookmarks(prev => prev.map(b => b.id === article.id ? {
        ...b,
        id: serverArticle._id,
      } : b));
    } catch (err) {
      console.error('Failed to save bookmark to server', err);
    }
  };

  const removeBookmark = async (id) => {
    if (!user) return;

    setBookmarks(prev => prev.filter(b => b.id !== id));

    if (typeof id !== 'number') { // server ids are strings
      try {
        await apiDeleteBookmark(id);
      } catch (err) {
        console.error('Failed to delete bookmark from server', err);
      }
    }
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
};
