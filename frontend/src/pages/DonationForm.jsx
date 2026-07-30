import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', quantity: '', unit: 'kg', 
    food_category: '', expires_at: '', pickup_ready_by: '',
    address: '', latitude: '', longitude: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/donations/', formData);
      navigate('/donor/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create donation. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Create Food Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Title</label>
            <input className="form-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g., 5 trays of baked ziti" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" step="0.1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="items">items</option>
                <option value="meals">meals</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={formData.food_category} onChange={e => setFormData({...formData, food_category: e.target.value})} required>
              <option value="">Select a category...</option>
              <option value="Produce">Produce</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Bakery">Bakery</option>
              <option value="Prepared">Prepared Food</option>
              <option value="Pantry">Pantry Items</option>
            </select>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Expires At</label>
              <input className="form-input" type="datetime-local" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Pickup Ready By</label>
              <input className="form-input" type="datetime-local" value={formData.pickup_ready_by} onChange={e => setFormData({...formData, pickup_ready_by: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Address</label>
            <input className="form-input" type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'List Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
