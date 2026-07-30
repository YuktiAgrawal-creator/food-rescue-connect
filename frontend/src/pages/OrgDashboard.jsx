import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const OrgDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const statsRes = await api.get('/auth/dashboard/');
        setStats(statsRes.data);
        
        const pickRes = await api.get('/pickups/');
        setPickups(pickRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard - {user?.organization_name || user?.username}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/donations" className="btn btn-primary">Find Food</Link>
          <Link to="/map" className="btn btn-secondary">View Map</Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3" style={{ marginBottom: '40px' }}>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Pending Requests</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pending_requests || 0}</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Accepted Pickups</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.accepted_pickups || 0}</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Completed Rescues</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.completed_pickups || 0}</p>
          </div>
        </div>
      )}

      <h3>Your Pickup Requests</h3>
      <div className="card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Food</th>
              <th style={{ padding: '12px' }}>Scheduled For</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>Donation #{p.donation}</td>
                <td style={{ padding: '12px' }}>{p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : 'N/A'}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                  <Link to={`/donations/${p.donation}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>View Donation</Link>
                  {p.status === 'ACCEPTED' && (
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={async () => {
                      try {
                        await api.post(`/pickups/${p.id}/complete/`);
                        const pickRes = await api.get('/pickups/');
                        setPickups(pickRes.data);
                      } catch (err) {
                        alert('Failed to complete pickup.');
                      }
                    }}>Mark Completed</button>
                  )}
                </td>
              </tr>
            ))}
            {pickups.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>No pickup requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrgDashboard;
