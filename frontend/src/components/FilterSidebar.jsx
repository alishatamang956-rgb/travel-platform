import React from 'react';
import { PROVINCES, PLACE_TYPES, DIFFICULTIES, SEASONS, VEHICLE_ACCESS } from '../data/constants';

const TYPE_LABEL = { TREK: 'Trek', ROAD_TRIP: 'Road Trip', HIKE: 'Hike', CAMPING: 'Camping' };
const VEHICLE_LABEL = { BIKE: 'Bike', CAR: 'Car', BUS: 'Bus', WALK_ONLY: 'Walk only' };

export default function FilterSidebar({ filters, onChange, onReset }) {
  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <aside className="card" style={{ position: 'sticky', top: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Filters</h3>
        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={onReset}>Reset</button>
      </div>

      <div className="field">
        <label>Search</label>
        <input placeholder="Search by name…" value={filters.keyword} onChange={(e) => set('keyword', e.target.value)} />
      </div>

      <div className="field">
        <label>Place type</label>
        <select value={filters.type} onChange={(e) => set('type', e.target.value)}>
          <option value="">Any</option>
          {PLACE_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Difficulty</label>
        <select value={filters.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
          <option value="">Any</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Best season</label>
        <select value={filters.season} onChange={(e) => set('season', e.target.value)}>
          <option value="">Any</option>
          {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Province</label>
        <select value={filters.province} onChange={(e) => set('province', e.target.value)}>
          <option value="">Any</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Budget min (Rs)</label>
          <input type="number" value={filters.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} />
        </div>
        <div className="field">
          <label>Budget max (Rs)</label>
          <input type="number" value={filters.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Vehicle access</label>
        <select value={filters.vehicleAccess} onChange={(e) => set('vehicleAccess', e.target.value)}>
          <option value="">Any</option>
          {VEHICLE_ACCESS.map((v) => <option key={v} value={v}>{VEHICLE_LABEL[v]}</option>)}
        </select>
      </div>

      <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ marginBottom: 0 }}>Nice-to-have</label>
        <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={filters.familyFriendly} onChange={(e) => set('familyFriendly', e.target.checked)} />
          Family-friendly
        </label>
        <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={filters.soloFriendly} onChange={(e) => set('soloFriendly', e.target.checked)} />
          Solo-friendly
        </label>
        <label style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={filters.networkAvailable} onChange={(e) => set('networkAvailable', e.target.checked)} />
          Network available
        </label>
      </div>
    </aside>
  );
}
