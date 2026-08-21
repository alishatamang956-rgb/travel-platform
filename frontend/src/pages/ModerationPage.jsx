import React, { useEffect, useState } from 'react';
import { getPendingReviews, approveReview, rejectReview } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ModerationPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  function load() {
    getPendingReviews()
      .then(setReviews)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load pending reviews'));
  }

  useEffect(() => { load(); }, []);

  if (!user || (user.role !== 'MODERATOR' && user.role !== 'ADMIN')) {
    return (
      <div className="container section">
        <h1>Moderation</h1>
        <p>You need to <Link to="/login">log in as moderator or admin</Link>.</p>
      </div>
    );
  }

  async function doApprove(id) {
    try {
      await approveReview(id);
      setMsg('Review approved');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Failed'); }
  }

  async function doReject(id) {
    try {
      await rejectReview(id);
      setMsg('Review rejected');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Failed'); }
  }

  return (
    <div className="container section">
      <h1>Moderation queue</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {reviews.length === 0 ? (
        <div className="empty-state">No pending reviews.</div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Place ID</th><th>Author ID</th><th></th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.placeId}</td>
                <td>{r.authorId}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-teal" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doApprove(r.id)}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doReject(r.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
