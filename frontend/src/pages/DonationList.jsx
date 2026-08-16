import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations/');
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Available Food Donations</h2>
        <Link to="/map" className="btn btn-secondary">View on Map</Link>
      </div>

      {loading ? (
        <p>Loading available food...</p>
      ) : (
        <div className="grid grid-cols-3">
          {donations.map(don => (
            <div key={don.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{don.food_category}</span>
                  <h3 style={{ margin: '5px 0 0 0', fontSize: '1.25rem', color: 'var(--dark)' }}>{don.title}</h3>
                </div>
                <span className={`badge badge-${don.status.toLowerCase()}`}>{don.status}</span>
              </div>
              
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '15px', flex: 1, fontSize: '0.95rem' }}>{don.description.substring(0, 100)}{don.description.length > 100 ? '...' : ''}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  <strong>Quantity:</strong> <span>{don.quantity} {don.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  <strong>Location:</strong> <span style={{ textAlign: 'right', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{don.address}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/donations/${don.id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '10px' }}>View Details</Link>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => window.location.href = `/donations/${don.id}`}>Request</button>
                </div>
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px' }}>
              <p>No food donations available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationList;
