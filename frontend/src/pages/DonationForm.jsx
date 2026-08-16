import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', quantity: '', unit: 'kg', 
    food_category: '', expires_at: '', pickup_ready_by: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare payload, converting empty strings to null for numbers
    const payload = {
      ...formData,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      latitude: null,
      longitude: null,
    };

    try {
      await api.post('/donations/', payload);
      navigate('/donor/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert('Validation Error: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create donation. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '40px', paddingBottom: '40px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '30px', borderBottom: '2px solid var(--border)', paddingBottom: '15px' }}>Create Food Donation</h2>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>Food Information</h3>
          <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <div className="form-group">
              <label className="form-label">Food Title</label>
              <input className="form-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g., 5 trays of baked ziti" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Include details about ingredients, allergens, or packaging."></textarea>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '20px' }}>
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" step="0.1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required placeholder="Amount" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Unit</label>
                  <select className="form-input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="items">items</option>
                    <option value="meals">meals</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Expires At</label>
              <input className="form-input" type="datetime-local" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} required />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '15px' }}>Pickup Details</h3>
          <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <div className="form-group">
              <label className="form-label">Pickup Ready By</label>
              <input className="form-input" type="datetime-local" value={formData.pickup_ready_by} onChange={e => setFormData({...formData, pickup_ready_by: e.target.value})} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pickup Location *</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                required 
                placeholder="e.g., Shop 12, Sector 62, Noida, Uttar Pradesh"
              ></textarea>
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                Please provide the complete location where the organization should collect the food.
              </small>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} disabled={loading || !formData.address.trim()}>
            {loading ? 'Creating Listing...' : 'Publish Food Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
