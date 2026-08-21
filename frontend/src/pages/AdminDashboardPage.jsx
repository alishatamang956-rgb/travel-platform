import React, { useEffect, useState } from 'react';
import { getPendingPlaces, approvePlace, rejectPlace, getPendingReviews, approveReview, rejectReview } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  function load() {
    Promise.all([getPendingPlaces(), getPendingReviews()])
      .then(([places, reviews]) => {
        setPendingPlaces(places);
        setPendingReviews(reviews);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load. Are you logged in as admin?'));
  }

  useEffect(() => { load(); }, []);

  async function doApprovePlace(id) {
    try {
      await approvePlace(id);
      setMsg('Place approved');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Approve failed'); }
  }

  async function doRejectPlace(id) {
    try {
      await rejectPlace(id);
      setMsg('Place rejected');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Reject failed'); }
  }

  async function doApproveReview(id) {
    try {
      await approveReview(id);
      setMsg('Review approved');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Approve failed'); }
  }

  async function doRejectReview(id) {
    try {
      await rejectReview(id);
      setMsg('Review rejected');
      load();
    } catch (e) { setError(e.response?.data?.message || 'Reject failed'); }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container section">
        <h1>Admin dashboard</h1>
        <p>You need to <Link to="/login">log in as admin</Link> (username: admin / password: password123).</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 style={{ fontSize: '1.6rem' }}>Admin dashboard</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', margin: '20px 0' }}>
        <div className="card"><label>Pending places</label><h2 style={{ margin: 0 }}>{pendingPlaces.length}</h2></div>
        <div className="card"><label>Pending reviews</label><h2 style={{ margin: 0 }}>{pendingReviews.length}</h2></div>
      </div>

      <h2>Places awaiting approval</h2>
      {pendingPlaces.length === 0 ? (
        <div className="empty-state">Nothing pending — all caught up.</div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Type</th><th>Province</th><th>Duration</th><th></th></tr></thead>
          <tbody>
            {pendingPlaces.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.province}</td>
                <td>{p.duration}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-teal" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doApprovePlace(p.id)}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doRejectPlace(p.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: 32 }}>Reviews awaiting approval</h2>
      {pendingReviews.length === 0 ? (
        <div className="empty-state">No pending reviews.</div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Place ID</th><th>Author</th><th></th></tr></thead>
          <tbody>
            {pendingReviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.placeId}</td>
                <td>{r.authorId}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-teal" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doApproveReview(r.id)}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => doRejectReview(r.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
