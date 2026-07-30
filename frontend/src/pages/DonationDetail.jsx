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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '10px' }}>{donation.title}</h2>
            <span className={`badge badge-${donation.status.toLowerCase()}`}>{donation.status}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {donation.quantity} {donation.unit}
          </p>
        </div>
        
        <div style={{ margin: '30px 0', padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
          <p><strong>Category:</strong> {donation.food_category}</p>
          <p><strong>Expires:</strong> {new Date(donation.expires_at).toLocaleString()}</p>
          <p><strong>Pickup Ready:</strong> {new Date(donation.pickup_ready_by).toLocaleString()}</p>
          <p><strong>Address:</strong> {donation.address}</p>
          <p style={{ marginTop: '15px' }}><strong>Description:</strong> {donation.description}</p>
        </div>

        {user?.role === 'ORGANIZATION' && donation.status === 'AVAILABLE' && (
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h3>Request Pickup</h3>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label className="form-label">Add a note for the donor (optional)</label>
              <textarea className="form-input" rows="2" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>
            <button className="btn btn-primary" onClick={handleRequestPickup} disabled={requesting} style={{ width: '100%' }}>
              {requesting ? 'Requesting...' : 'Request Pickup'}
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
