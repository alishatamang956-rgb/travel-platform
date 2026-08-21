import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedPlaces } from '../api/client';
import PlaceCard from '../components/PlaceCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getFeaturedPlaces()
      .then(setFeatured)
      .catch(() => setError('Could not load featured places. Is the backend running?'));
  }, []);

  return (
    <div>
      <section className="hero">
        <svg className="contours" viewBox="0 0 1200 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 300 Q 200 200 400 280 T 900 220 T 1300 300" stroke="#E8A33D" strokeWidth="2" fill="none" />
          <path d="M-50 340 Q 250 260 450 320 T 950 260 T 1300 340" stroke="#E8A33D" strokeWidth="2" fill="none" />
          <path d="M-50 380 Q 300 320 500 360 T 1000 310 T 1300 380" stroke="#E8A33D" strokeWidth="2" fill="none" />
        </svg>
        <div className="container">
          <h1 style={{ color: '#fff' }}>Nepal's most trusted, community-driven travel intelligence.</h1>
          <p className="lede">
            Structured, experience-based reviews — trail, transport, stay, season, budget, and safety —
            instead of one big generic comment. Built by travelers who've actually been there.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Link to="/browse" className="btn btn-primary">Browse Places</Link>
            <Link to="/add-place" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Add a Place</Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Featured this season</h2>
        {error && <div className="empty-state" style={{ color: 'crimson' }}>{error}</div>}
        <div className="place-grid" style={{ marginTop: '16px' }}>
          {featured.map((p) => <PlaceCard key={p.id} place={p} />)}
        </div>
      </section>
    </div>
  );
}
