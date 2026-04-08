// Simple helper for communicating with the local backend server
// Adjust BASE_URL if your server runs on a different host/port
const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

export async function signup(user) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveBookmark(bookmark) {
  const res = await fetch(`${BASE_URL}/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookmark),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getBookmarks(userId) {
  const res = await fetch(`${BASE_URL}/bookmarks/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBookmark(id) {
  const res = await fetch(`${BASE_URL}/bookmark/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
