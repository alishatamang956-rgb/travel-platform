import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 420 }}>
      <h1 style={{ fontSize: '1.6rem' }}>Create an account</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px' }}>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} />
        </div>
        {error && <p style={{ color: 'crimson', fontSize: '0.9rem' }}>{error}</p>}
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
