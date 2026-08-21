import React from 'react';
import { Link } from 'react-router-dom';

const TYPE_LABEL = { TREK: 'Trek', ROAD_TRIP: 'Road Trip', HIKE: 'Hike', CAMPING: 'Camping' };

export default function PlaceCard({ place }) {
  return (
    <Link to={`/places/${place.id}`} className="place-card" style={{ color: 'inherit' }}>
      <div className="body">
        <div className="meta-row">
          <span className={`tag status-${place.status}`}>{place.status}</span>
          <span className="tag">{TYPE_LABEL[place.type]}</span>
          {place.difficulty && <span className="tag">{place.difficulty}</span>}
        </div>
        <h3 style={{ margin: '2px 0' }}>{place.name}</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
          {place.district}, {place.province}
        </div>
        <p style={{ fontSize: '0.88rem', margin: '4px 0 8px', flex: 1 }}>
          {place.overview?.slice(0, 110)}{place.overview?.length > 110 ? '…' : ''}
        </p>
        <div className="meta-row">
          <span>{place.duration}</span>
          {place.altitudeMeters && <span>{place.altitudeMeters}m</span>}
          <span>Rs {place.budgetMin?.toLocaleString()}–{place.budgetMax?.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-teal)', marginTop: '4px' }}>
          {place.reviewCount ?? 0} structured review{place.reviewCount === 1 ? '' : 's'}
        </div>
      </div>
    </Link>
  );
}
