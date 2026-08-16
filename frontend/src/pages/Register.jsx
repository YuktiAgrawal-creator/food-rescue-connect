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
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value, role, currentFormData) => {
    let error = '';
    const val = value.trim();

    if (name === 'first_name') {
      if (!val) error = 'First name is required.';
      else if (val.length < 2 || val.length > 50) error = 'First name must contain at least 2 characters.';
      else if (!/^[A-Za-z\s-]+$/.test(val)) error = 'First name can contain only letters.';
    }
    
    if (name === 'last_name') {
      if (!val) error = 'Last name is required.';
      else if (val.length < 2 || val.length > 50) error = 'Last name must contain at least 2 characters.';
      else if (!/^[A-Za-z\s-]+$/.test(val)) error = 'Last name can contain only letters.';
    }
    
    if (name === 'organization_name') {
      const fieldName = role === 'DONOR' ? 'Business name' : 'Organization name';
      if (!val) error = `Please enter a valid ${fieldName.toLowerCase()}.`;
      else if (val.length < 2 || val.length > 100) error = `Please enter a valid ${fieldName.toLowerCase()}.`;
      else if (!/^[A-Za-z0-9\s&.\-']+$/.test(val) || !/[A-Za-z]/.test(val)) error = `Please enter a valid ${fieldName.toLowerCase()}.`;
    }
    
    if (name === 'username') {
      if (!val) error = 'Username is required.';
      else if (val.length < 3 || val.length > 30) error = 'Username may contain only letters, numbers and underscores.';
      else if (!/^[A-Za-z0-9_]+$/.test(val)) error = 'Username may contain only letters, numbers and underscores.';
    }
    
    if (name === 'email') {
      if (!val) error = 'Please enter a valid email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Please enter a valid email address.';
    }
    
    if (name === 'password') {
      if (!val) error = 'Password is required.';
      else if (val.length < 8 || val.length > 128 || !/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val) || !/[^A-Za-z0-9]/.test(val)) {
        error = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      setErrors(prevErrors => {
        const newErrors = {
          ...prevErrors,
          [name]: validateField(name, value, newFormData.role, newFormData)
        };
        return newErrors;
      });

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        newErrors[key] = validateField(key, formData[key], formData.role, formData);
      }
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return; // Stop if there are validation errors
    }
    
    setIsSubmitting(true);
    setGlobalError('');
    try {
      const payload = { ...formData };
      const loggedInUser = await register(payload);
      if (loggedInUser.role === 'DONOR') {
        navigate('/donor/dashboard');
      } else {
        navigate('/org/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle DRF validation errors mapped to fields
        const drfErrors = err.response.data;
        if (typeof drfErrors === 'object' && !Array.isArray(drfErrors)) {
          const apiErrors = {};
          let hasFieldErrors = false;
          for (let key in drfErrors) {
             if (formData.hasOwnProperty(key)) {
               apiErrors[key] = Array.isArray(drfErrors[key]) ? drfErrors[key][0] : drfErrors[key];
               hasFieldErrors = true;
             }
          }
          if (hasFieldErrors) {
             setErrors(prev => ({ ...prev, ...apiErrors }));
          } else {
             setGlobalError(JSON.stringify(drfErrors));
          }
        } else {
          setGlobalError(typeof drfErrors === 'string' ? drfErrors : JSON.stringify(drfErrors));
        }
      } else {
        setGlobalError('Registration failed. Please check your details.');
      }
      setIsSubmitting(false);
    }
  };

  const isFormValid = !Object.values(errors).some(err => err) && Object.keys(formData).every(k => k === 'role' || formData[k].trim() !== '');

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '60px', paddingBottom: '60px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        {globalError && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center', padding: '10px', background: '#fee2e2', borderRadius: '4px' }}>{globalError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-input" name="role" value={formData.role} onChange={handleChange}>
              <option value="DONOR">Donor (Restaurant, Supermarket, etc.)</option>
              <option value="ORGANIZATION">Organization (NGO, Food Bank, etc.)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2" style={{ gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={{ borderColor: errors.first_name ? 'var(--danger)' : '' }} />
              {errors.first_name && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.first_name}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={{ borderColor: errors.last_name ? 'var(--danger)' : '' }} />
              {errors.last_name && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.last_name}</div>}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <label className="form-label">{formData.role === 'DONOR' ? 'Business Name' : 'Organization Name'}</label>
            <input className="form-input" type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} required style={{ borderColor: errors.organization_name ? 'var(--danger)' : '' }} />
            {errors.organization_name && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.organization_name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" name="username" value={formData.username} onChange={handleChange} required style={{ borderColor: errors.username ? 'var(--danger)' : '' }} />
            {errors.username && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.username}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required style={{ borderColor: errors.email ? 'var(--danger)' : '' }} />
            {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} required style={{ borderColor: errors.password ? 'var(--danger)' : '' }} />
            {errors.password && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.password}</div>}
          </div>
          
          <div style={{ marginTop: '25px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: isFormValid ? 1 : 0.6 }} disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
