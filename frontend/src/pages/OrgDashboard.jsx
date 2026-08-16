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
        <div className="grid grid-cols-3" style={{ marginBottom: '40px', gap: '20px' }}>
          <div className="card text-center" style={{ borderTop: '4px solid var(--warning)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Requests</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--warning)', margin: '10px 0' }}>{stats.pending_requests || 0}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Accepted Pickups</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', margin: '10px 0' }}>{stats.accepted_pickups || 0}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '4px solid var(--secondary)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed Rescues</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--secondary)', margin: '10px 0' }}>{stats.completed_pickups || 0}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Your Pickup Requests</h3>
      </div>
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--light)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Food</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Location</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Scheduled For</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '15px 20px', fontWeight: '500' }}>{p.donation_details ? `${p.donation_details.title} — ${p.donation_details.quantity} ${p.donation_details.unit}` : `Donation #${p.donation}`}</td>
                <td style={{ padding: '15px 20px' }}>{p.donation_details?.address || '-'}</td>
                <td style={{ padding: '15px 20px', color: 'var(--text-main)' }}>{p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : (p.donation_details?.pickup_ready_by ? new Date(p.donation_details.pickup_ready_by).toLocaleString() : 'Not scheduled yet')}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td style={{ padding: '15px 20px', display: 'flex', gap: '10px' }}>
                  <Link to={`/donations/${p.donation}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>View Donation</Link>
                  {p.status === 'ACCEPTED' && (
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={async () => {
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
              <tr>
                <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px', color: '#cbd5e1' }}>🚚</div>
                  <p>You haven't requested any pickups yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrgDashboard;
