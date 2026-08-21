import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROVINCES, PLACE_TYPES, DIFFICULTIES, SEASONS, VEHICLE_ACCESS } from '../data/constants';
import { createPlace } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AddPlacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', overview: '', province: '', district: '', type: '', duration: '',
    difficulty: '', bestSeason: '', budgetMin: '', budgetMax: '', altitudeMeters: '',
    vehicleAccess: [], familyFriendly: false, soloFriendly: false, networkAvailable: false,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleVehicle(v) {
    setForm((prev) => ({
      ...prev,
      vehicleAccess: prev.vehicleAccess.includes(v) ? prev.vehicleAccess.filter((x) => x !== v) : [...prev.vehicleAccess, v],
    }));
  }

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        altitudeMeters: form.altitudeMeters ? Number(form.altitudeMeters) : null,
      };
      await createPlace(payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit place');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="container section">
        <p>Please <Link to="/login">log in</Link> to add a place.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <h2>Submitted for review</h2>
          <p style={{ color: 'var(--color-ink-soft)' }}>New places go to an admin for approval before they appear in public search.</p>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>Back to Browse</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 style={{ fontSize: '1.6rem' }}>Add a place</h1>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
        <div className="field"><label>Overview</label><textarea rows={3} value={form.overview} onChange={(e) => set('overview', e.target.value)} /></div>

        <div className="field-row">
          <div className="field"><label>Province</label>
            <select value={form.province} onChange={(e) => set('province', e.target.value)}>
              <option value="">Select…</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="field"><label>District</label><input value={form.district} onChange={(e) => set('district', e.target.value)} /></div>
        </div>

        <div className="field-row">
          <div className="field"><label>Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="">Select…</option>
              {PLACE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><label>Duration</label><input placeholder="e.g. 2N/3D" value={form.duration} onChange={(e) => set('duration', e.target.value)} /></div>
        </div>

        <div className="field-row">
          <div className="field"><label>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
              <option value="">Select…</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="field"><label>Best season</label>
            <select value={form.bestSeason} onChange={(e) => set('bestSeason', e.target.value)}>
              <option value="">Select…</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field"><label>Budget min (Rs)</label><input type="number" value={form.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} /></div>
          <div className="field"><label>Budget max (Rs)</label><input type="number" value={form.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} /></div>
        </div>

        <div className="field"><label>Altitude (m, for treks)</label><input type="number" value={form.altitudeMeters} onChange={(e) => set('altitudeMeters', e.target.value)} /></div>

        <div className="field">
          <label>Vehicle access</label>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {VEHICLE_ACCESS.map((v) => (
              <label key={v} style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" style={{ width: 'auto' }} checked={form.vehicleAccess.includes(v)} onChange={() => toggleVehicle(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div className="field" style={{ display: 'flex', gap: '14px' }}>
          <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={form.familyFriendly} onChange={(e) => set('familyFriendly', e.target.checked)} /> Family-friendly
          </label>
          <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={form.soloFriendly} onChange={(e) => set('soloFriendly', e.target.checked)} /> Solo-friendly
          </label>
          <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={form.networkAvailable} onChange={(e) => set('networkAvailable', e.target.checked)} /> Network available
          </label>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={handleSubmit}>Submit for approval</button>
      </div>
    </div>
  );
}
