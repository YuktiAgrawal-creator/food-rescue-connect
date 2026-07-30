import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [pickups, setPickups] = useState([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const statsRes = await api.get('/auth/dashboard/');
        setStats(statsRes.data);
        
        const donRes = await api.get('/donations/');
        setDonations(donRes.data);
        
        const pickRes = await api.get('/pickups/');
        setPickups(pickRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const handleAction = async (pickupId, action) => {
    try {
      await api.post(`/pickups/${pickupId}/${action}/`);
      const pickRes = await api.get('/pickups/');
      setPickups(pickRes.data);
      const donRes = await api.get('/donations/');
      setDonations(donRes.data);
    } catch (err) {
      alert(`Failed to ${action} pickup.`);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Welcome back, {user?.first_name || user?.username}!</h2>
        <Link to="/donate" className="btn btn-primary">Create Donation</Link>
      </div>

      {stats && (
        <div className="grid grid-cols-3" style={{ marginBottom: '40px' }}>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Total Donations</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total_donations || 0}</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Pending Pickups</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pending_requests || 0}</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Completed Rescues</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.completed_donations || 0}</p>
          </div>
        </div>
      )}

      <h3>Your Recent Donations</h3>
      <div className="card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(don => (
              <tr key={don.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>{don.title}</td>
                <td style={{ padding: '12px' }}>{don.quantity} {don.unit}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${don.status.toLowerCase()}`}>{don.status}</span>
                </td>
                <td style={{ padding: '12px' }}>{new Date(don.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <Link to={`/donations/${don.id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>View</Link>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No donations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: '40px' }}>Pickup Requests for Your Donations</h3>
      <div className="card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Donation</th>
              <th style={{ padding: '12px' }}>Requester</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Notes</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>Donation #{p.donation}</td>
                <td style={{ padding: '12px' }}>User #{p.requester}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td style={{ padding: '12px' }}>{p.notes || '-'}</td>
                <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                  {p.status === 'PENDING' && (
                    <>
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleAction(p.id, 'accept')}>Accept</button>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleAction(p.id, 'reject')}>Reject</button>
                    </>
                  )}
                  {p.status === 'ACCEPTED' && (
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleAction(p.id, 'complete')}>Mark Completed</button>
                  )}
                </td>
              </tr>
            ))}
            {pickups.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No pickup requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorDashboard;
