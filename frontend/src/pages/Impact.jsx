import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Impact = () => {
  const [stats, setStats] = useState({
    total_rescued: 1250,
    total_donations: 430,
    active_orgs: 25,
    active_donors: 40
  });

  // If there was an analytics API:
  /*
  useEffect(() => {
    api.get('/analytics/').then(res => setStats(res.data)).catch(err => console.error(err));
  }, []);
  */

  return (
    <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Our Impact</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
        Together, we are making a difference in the fight against food waste and hunger. Here are our platform statistics.
      </p>

      <div className="grid grid-cols-2" style={{ gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="card glass">
          <h3 style={{ fontSize: '3rem', color: 'var(--primary)' }}>{stats.total_rescued}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>kg of Food Rescued</p>
        </div>
        <div className="card glass">
          <h3 style={{ fontSize: '3rem', color: 'var(--secondary)' }}>{stats.total_donations}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Successful Donations</p>
        </div>
        <div className="card glass">
          <h3 style={{ fontSize: '3rem', color: 'var(--warning)' }}>{stats.active_orgs}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Partner Organizations</p>
        </div>
        <div className="card glass">
          <h3 style={{ fontSize: '3rem', color: '#8b5cf6' }}>{stats.active_donors}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Food Donors</p>
        </div>
      </div>
    </div>
  );
};

export default Impact;
