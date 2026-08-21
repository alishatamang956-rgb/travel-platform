import React, { useEffect, useState } from 'react';
import { searchPlaces } from '../api/client';
import FilterSidebar from '../components/FilterSidebar';
import PlaceCard from '../components/PlaceCard';

const EMPTY_FILTERS = {
  keyword: '', type: '', difficulty: '', season: '', province: '',
  budgetMin: '', budgetMax: '', vehicleAccess: '',
  familyFriendly: false, soloFriendly: false, networkAvailable: false,
};

export default function BrowsePage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.type) params.type = filters.type;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.season) params.season = filters.season;
        if (filters.province) params.province = filters.province;
        if (filters.budgetMin) params.budgetMin = filters.budgetMin;
        if (filters.budgetMax) params.budgetMax = filters.budgetMax;
        if (filters.vehicleAccess) params.vehicleAccess = filters.vehicleAccess;
        if (filters.familyFriendly) params.familyFriendly = 'true';
        if (filters.soloFriendly) params.soloFriendly = 'true';
        if (filters.networkAvailable) params.networkAvailable = 'true';

        const data = await searchPlaces(params);
        if (!cancelled) setResults(data);
      } catch (err) {
        if (!cancelled) setError('Could not load places. Is the backend running on :8080?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filters]);

  return (
    <div className="container section">
      <h1 style={{ fontSize: '1.8rem' }}>Browse places</h1>
      <div className="browse-layout" style={{ marginTop: '20px' }}>
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} />
        <div>
          {loading && <p style={{ color: 'var(--color-ink-soft)' }}>Loading…</p>}
          {error && <div className="empty-state" style={{ color: 'crimson' }}>{error}</div>}
          {!loading && !error && (
            <>
              <p style={{ color: 'var(--color-ink-soft)', marginTop: 0 }}>
                {results.length} place{results.length === 1 ? '' : 's'} match your filters
              </p>
              {results.length === 0 ? (
                <div className="empty-state">No places match those filters yet. Try loosening a filter.</div>
              ) : (
                <div className="place-grid">
                  {results.map((p) => <PlaceCard key={p.id} place={p} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
