import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlace, getReviewsForPlace } from '../api/client';
import ReviewSections from '../components/ReviewSections';
import { useAuth } from '../context/AuthContext';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getPlace(id), getReviewsForPlace(id)])
      .then(([p, r]) => {
        setPlace(p);
        setReviews(r);
      })
      .catch(() => setError('Could not load place. Is the backend running?'));
  }, [id]);

  if (error) return <div className="container section" style={{ color: 'crimson' }}>{error}</div>;
  if (!place) return <div className="container section">Loading…</div>;

  const vehicle = Array.isArray(place.vehicleAccess) ? place.vehicleAccess.join(', ') : (place.vehicleAccess || '—');

  return (
    <div className="container section">
      <div className="meta-row" style={{ marginBottom: '8px' }}>
        <span className={`tag status-${place.status}`}>{place.status}</span>
        <span className="tag">{place.type}</span>
        {place.difficulty && <span className="tag">{place.difficulty}</span>}
        {place.bestSeason && <span className="tag">Best: {place.bestSeason}</span>}
      </div>
      <h1>{place.name}</h1>
      <p style={{ color: 'var(--color-ink-soft)' }}>{place.district}, {place.province}</p>
      <p style={{ maxWidth: '640px' }}>{place.overview}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', margin: '24px 0' }}>
        <div className="card"><label>Duration</label>{place.duration || '—'}</div>
        <div className="card"><label>Budget</label>Rs {place.budgetMin?.toLocaleString()}–{place.budgetMax?.toLocaleString()}</div>
        {place.altitudeMeters && <div className="card"><label>Altitude</label>{place.altitudeMeters}m</div>}
        <div className="card"><label>Vehicle access</label>{vehicle}</div>
        <div className="card"><label>Crowd level</label>{place.crowdLevel || '—'}</div>
        <div className="card"><label>Network</label>{place.networkAvailable ? 'Available' : 'Limited / none'}</div>
      </div>

      {(place.emergencyNetworkInfo || place.nearestPolicePost || place.nearestHealthPost) && (
        <div className="card" style={{ borderColor: 'var(--color-danger)', marginBottom: '28px' }}>
          <h3 style={{ color: 'var(--color-danger)' }}>Emergency info</h3>
          {place.emergencyNetworkInfo && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Network:</strong> {place.emergencyNetworkInfo}</p>}
          {place.nearestPolicePost && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Nearest police post:</strong> {place.nearestPolicePost}</p>}
          {place.nearestHealthPost && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Nearest health post:</strong> {place.nearestHealthPost}</p>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Structured reviews ({reviews.length})</h2>
        {user ? (
          <Link to={`/places/${place.id}/review`} className="btn btn-primary">Write a review</Link>
        ) : (
          <Link to="/login" className="btn btn-outline">Log in to review</Link>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">No approved reviews yet — be the first to share a structured review.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>@{r.author?.username || 'user'}</strong>
                <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.82rem' }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <ReviewSections review={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
