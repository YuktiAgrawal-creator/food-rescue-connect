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
            <div key={don.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '10px' }}>{don.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '15px', flex: 1 }}>{don.description.substring(0, 100)}{don.description.length > 100 ? '...' : ''}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <strong>Quantity:</strong> <span>{don.quantity} {don.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
                <strong>Category:</strong> <span>{don.food_category}</span>
              </div>

              <Link to={`/donations/${don.id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
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
