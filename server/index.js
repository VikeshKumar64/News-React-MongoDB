// Simple Express server for authentication and bookmarks
// Keep code small and commented for beginners
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB using provided connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vikesh:vikesh123@cluster0.c2e8nf3.mongodb.net/mydb';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Bookmark = require('./models/Bookmark');

// Routes
// Auth: signup and login
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email, password });
    await user.save();
    // Return user without password
    const u = user.toObject();
    delete u.password;
    res.status(201).json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const u = user.toObject();
    delete u.password;
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmarks
// Save bookmark
app.post('/bookmark', async (req, res) => {
  try {
    const { userId, title, description, image, url } = req.body;
    if (!userId || !title || !url) return res.status(400).json({ message: 'Missing fields' });

    // Prevent duplicate bookmarks for the same user + URL
    const existing = await Bookmark.findOne({ userId, url });
    if (existing) return res.status(200).json(existing);

    const bm = new Bookmark({ userId, title, description, image, url });
    await bm.save();
    res.status(201).json(bm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookmarks for user
app.get('/bookmarks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Bookmark.find({ userId }).sort({ _id: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bookmark
app.delete('/bookmark/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Bookmark.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// NewsAPI Proxy Routes to bypass localhost-only restriction in production
app.get('/api/news/top-headlines', async (req, res) => {
  try {
    const { country = 'us', category, pageSize = 20 } = req.query;
    const apiKey = process.env.NEWS_API_KEY || 'ffee724039374e79bdf72d4c8a077aae';
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${apiKey}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching from NewsAPI' });
  }
});

app.get('/api/news/everything', async (req, res) => {
  try {
    const { q, pageSize = 20, sortBy = 'publishedAt' } = req.query;
    const apiKey = process.env.NEWS_API_KEY || 'ffee724039374e79bdf72d4c8a077aae';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=${pageSize}&sortBy=${sortBy}&language=en&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching from NewsAPI' });
  }
});

// Health endpoint for quick reachability checks
app.get('/', (req, res) => res.json({ ok: true, name: 'smart-news-server' }));

// Bind explicitly to 0.0.0.0 and log the bound address for easier debugging
const server = app.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`Server running and listening on ${addr.address}:${addr.port}`);
});
