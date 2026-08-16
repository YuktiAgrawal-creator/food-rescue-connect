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
        <div className="grid grid-cols-3" style={{ marginBottom: '40px', gap: '20px' }}>
          <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Donations</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', margin: '10px 0' }}>{stats.total_donations || 0}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '4px solid var(--warning)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Pickups</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--warning)', margin: '10px 0' }}>{stats.pending_requests || 0}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '4px solid var(--secondary)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed Rescues</h3>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--secondary)', margin: '10px 0' }}>{stats.completed_donations || 0}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Your Recent Donations</h3>
      </div>
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--light)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Title</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Quantity</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(don => (
              <tr key={don.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '15px 20px', fontWeight: '500' }}>{don.title}</td>
                <td style={{ padding: '15px 20px', color: 'var(--text-main)' }}>{don.quantity} {don.unit}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span className={`badge badge-${don.status.toLowerCase()}`}>{don.status}</span>
                </td>
                <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>{new Date(don.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '15px 20px' }}>
                  <Link to={`/donations/${don.id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>View</Link>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px', color: '#cbd5e1' }}>📦</div>
                  <p>You haven't listed any food donations yet.</p>
                </td>
              </tr>
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
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Scheduled For</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Notes</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>{p.donation_details ? `${p.donation_details.title} — ${p.donation_details.quantity} ${p.donation_details.unit}` : `Donation #${p.donation}`}</td>
                <td style={{ padding: '12px' }}>{p.requester_details ? (p.requester_details.organization_name || p.requester_details.first_name || p.requester_details.username || 'Unknown Organization') : `User #${p.requester}`}</td>
                <td style={{ padding: '12px' }}>{p.donation_details?.address || '-'}</td>
                <td style={{ padding: '12px', color: 'var(--text-main)' }}>{p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : (p.donation_details?.pickup_ready_by ? new Date(p.donation_details.pickup_ready_by).toLocaleString() : 'Not scheduled yet')}</td>
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
                </td>
              </tr>
            ))}
            {pickups.length === 0 && (
              <tr><td colSpan="7" style={{ padding: '12px', textAlign: 'center' }}>No pickup requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorDashboard;
