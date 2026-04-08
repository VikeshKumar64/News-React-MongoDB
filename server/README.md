Server for Smart News App

Run locally:

- cd server
- npm install
- npm start

This simple Express server provides /signup, /login, /bookmark, /bookmarks/:userId, /bookmark/:id

It connects to the provided MongoDB Atlas connection string in code. For development you can change the URL in index.js or set up environment handling.
