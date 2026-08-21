import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="navbar">
        <div className="container">
          <Link to="/" className="brand">Yatra<span>Bata</span></Link>
          <nav>
            <Link to="/browse">Browse</Link>
            {user && <Link to="/add-place">Add a Place</Link>}
            {(user?.role === 'ADMIN') && <Link to="/admin">Admin</Link>}
            {(user?.role === 'MODERATOR') && <Link to="/moderation">Moderation</Link>}
            {user ? (
              <>
                <span style={{ color: '#9AA6AF', fontSize: '0.85rem' }}>@{user.username}</span>
                <button onClick={() => { logout(); navigate('/'); }}>Log out</button>
              </>
            ) : (
              <Link to="/login">Log in</Link>
            )}
          </nav>
        </div>
      </header>
      <div className="flag-strip"><span className="b" /><span className="w" /><span className="r" /><span className="g" /><span className="y" /></div>
    </>
  );
}
