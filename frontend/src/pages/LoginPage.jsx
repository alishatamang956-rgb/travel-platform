import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check username/password and that backend is running.');
    } finally {
      setLoading(false);
    }
  }

  function quickFill(u) {
    setUsername(u);
    setPassword('password123');
  }

  return (
    <div className="container section" style={{ maxWidth: 420 }}>
      <h1 style={{ fontSize: '1.6rem' }}>Log in</h1>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem' }}>
        Demo accounts all use password: <strong>password123</strong>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0 20px' }}>
        <button type="button" className="btn btn-outline" onClick={() => quickFill('admin')}>Admin</button>
        <button type="button" className="btn btn-outline" onClick={() => quickFill('moderator')}>Moderator</button>
        <button type="button" className="btn btn-outline" onClick={() => quickFill('sabin_k')}>sabin_k</button>
        <button type="button" className="btn btn-outline" onClick={() => quickFill('demo')}>demo</button>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px' }}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 16 }} />
        {error && <p style={{ color: 'crimson', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: '0.9rem' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
