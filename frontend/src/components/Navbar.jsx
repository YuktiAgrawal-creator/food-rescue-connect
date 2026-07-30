import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Leaf size={24} /> Food Rescue Connect
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'DONOR' && (
              <>
                <Link to="/donor/dashboard">Dashboard</Link>
                <Link to="/donate">Donate Food</Link>
              </>
            )}
            {user.role === 'ORGANIZATION' && (
              <>
                <Link to="/org/dashboard">Dashboard</Link>
                <Link to="/donations">Find Food</Link>
                <Link to="/map">Map</Link>
              </>
            )}
            <Link to="/impact">Impact</Link>
            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '5px 15px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
