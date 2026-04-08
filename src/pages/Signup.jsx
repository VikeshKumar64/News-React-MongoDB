import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as apiSignup } from '../api/serverApi';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await apiSignup({ name, email, password });
      login(user);
      navigate('/');
    } catch (err) {
      setError('Signup failed');
      console.error(err);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-dark-card rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 text-black border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 text-black border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 text-black border rounded" />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Sign up</button>
          <Link to="/login" className="text-sm text-primary-600">Already have an account?</Link>
        </div>
      </form>
    </main>
  );
}
