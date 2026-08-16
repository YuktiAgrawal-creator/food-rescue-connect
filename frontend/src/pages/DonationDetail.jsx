import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const DonationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await api.get(`/donations/${id}/`);
        setDonation(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  const handleRequestPickup = async () => {
    setRequesting(true);
    try {
      await api.post('/pickups/', { donation: id, notes });
      alert('Pickup requested successfully!');
      navigate('/org/dashboard');
    } catch (err) {
      alert('Failed to request pickup.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '40px' }}>Loading...</div>;
  if (!donation) return <div className="container" style={{ marginTop: '40px' }}>Donation not found.</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{donation.food_category}</span>
            <h2 style={{ margin: '5px 0 10px 0', fontSize: '2rem', color: 'var(--dark)' }}>{donation.title}</h2>
            <span className={`badge badge-${donation.status.toLowerCase()}`}>{donation.status}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Quantity</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
              {donation.quantity} <span style={{ fontSize: '1.2rem' }}>{donation.unit}</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--dark)' }}>Details</h3>
            <p style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--text-main)' }}>Category:</strong> {donation.food_category}</p>
            <p style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--text-main)' }}>Expires:</strong> {new Date(donation.expires_at).toLocaleString()}</p>
            <p style={{ marginBottom: '0' }}><strong style={{ color: 'var(--text-main)' }}>Pickup Ready:</strong> {new Date(donation.pickup_ready_by).toLocaleString()}</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--dark)' }}>Location</h3>
            <p style={{ marginBottom: '10px', lineHeight: '1.5' }}>{donation.address}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--dark)' }}>Description</h3>
          <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>{donation.description}</p>
        </div>

        {user?.role === 'ORGANIZATION' && donation.status === 'AVAILABLE' && (
          <div style={{ marginTop: '40px', borderTop: '2px solid var(--border)', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Request Pickup</h3>
            <div className="form-group">
              <label className="form-label">Add a note for the donor (optional)</label>
              <textarea className="form-input" rows="3" placeholder="Let them know when you plan to arrive..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>
            <button className="btn btn-primary" onClick={handleRequestPickup} disabled={requesting} style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
              {requesting ? 'Sending Request...' : 'Request Pickup'}
            </button>
          </div>
        )}
        
        {user?.role === 'DONOR' && (
          <div style={{ marginTop: '20px' }}>
             <p><em>As the donor, you can view this listing. Manage pickups from your dashboard.</em></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationDetail;
