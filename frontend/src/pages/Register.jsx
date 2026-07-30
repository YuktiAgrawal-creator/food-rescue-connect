import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', role: 'DONOR', 
    first_name: '', last_name: '', organization_name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '60px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="DONOR">Donor (Restaurant, Supermarket, etc.)</option>
              <option value="ORGANIZATION">Organization (NGO, Food Bank, etc.)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2" style={{ gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <label className="form-label">{formData.role === 'DONOR' ? 'Business Name' : 'Organization Name'}</label>
            <input className="form-input" type="text" value={formData.organization_name} onChange={e => setFormData({...formData, organization_name: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
