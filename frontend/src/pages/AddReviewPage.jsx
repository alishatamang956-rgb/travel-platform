import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlace, createReview } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AddReviewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPlace(id).then(setPlace).catch(() => setError('Place not found'));
  }, [id]);

  if (!user) {
    return (
      <div className="container section">
        <p>Please <Link to="/login">log in</Link> to write a review.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createReview({
        placeId: Number(id),
        trailReview: { comments },
      });
      navigate(`/places/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  if (!place && !error) return <div className="container section">Loading…</div>;

  return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: '1.5rem' }}>Review: {place?.name}</h1>
      <p style={{ color: 'var(--color-ink-soft)' }}>Your review will be held for moderation before it appears publicly.</p>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 20 }}>
        <div className="field">
          <label>Trail / experience notes</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={5} required style={{ width: '100%' }} />
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit review'}
        </button>
      </form>
    </div>
  );
}
