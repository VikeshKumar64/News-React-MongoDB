import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ApiNotice from './components/ApiNotice';
import Home from './pages/Home';
import Category from './pages/Category';
import ArticleDetails from './pages/ArticleDetails';
import BookmarksPage from './pages/Bookmarks.jsx';
import SearchPage from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { isApiConfigured } from './api/newsApi';

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white flex flex-col">
      <Navbar />
      {!isApiConfigured() && <ApiNotice />}
      <div className="flex-1">
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/categories" element={user ? <Category /> : <Navigate to="/login" replace />} />
          <Route path="/article/:id" element={user ? <ArticleDetails /> : <Navigate to="/login" replace />} />
          <Route path="/bookmarks" element={user ? <BookmarksPage /> : <Navigate to="/login" replace />} />
          <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" replace />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-8xl mb-4">🗺️</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
              <p className="text-gray-500 dark:text-dark-muted mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">← Back to Home</a>
            </div>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <Router>
            <AppRoutes />
          </Router>
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
