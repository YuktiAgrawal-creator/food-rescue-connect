import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDonateClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else if (user.role === 'DONOR') {
      navigate('/donate');
    } else {
      alert('Only food donors can create donations.');
      navigate('/org/dashboard');
    }
  };

  const handleFindClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/donations');
    }
  };

  return (
    <div>
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontSize: '3.5rem', color: 'var(--dark)', marginBottom: '20px', fontWeight: '800', lineHeight: 1.2 }}>Turn Surplus Food Into Shared Hope.</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '40px' }}>
              Connect surplus food from local businesses, supermarkets, and households with verified NGOs and community organizations.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button onClick={handleDonateClick} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 35px' }}>Donate Food</button>
              <button onClick={handleFindClick} className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 35px' }}>Find Food</button>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
            <img src={heroImg} alt="Volunteers sharing food boxes" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)' }} />
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem', fontWeight: '700' }}>How It Works</h2>
        <div className="grid grid-cols-3" style={{ gap: '40px' }}>
          <div className="card text-center" style={{ padding: '0', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=600&q=80" 
              alt="Fresh produce" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='200' style='background:%23d1fae5'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23059669'%3EList Surplus%3C/text%3E%3C/svg%3E" }}
            />
            <div style={{ padding: '30px 20px' }}>
              <div style={{ background: '#d1fae5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-55px auto 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', position: 'relative', zIndex: 2, border: '4px solid white' }}>1</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>List Surplus</h3>
              <p style={{ color: 'var(--text-muted)' }}>Donors quickly list perfectly good food that would otherwise go to waste.</p>
            </div>
          </div>
          <div className="card text-center" style={{ padding: '0', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80" 
              alt="Volunteers organizing food" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='200' style='background:%23dbeafe'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%233b82f6'%3EConnect%3C/text%3E%3C/svg%3E" }}
            />
            <div style={{ padding: '30px 20px' }}>
              <div style={{ background: '#dbeafe', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-55px auto 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)', position: 'relative', zIndex: 2, border: '4px solid white' }}>2</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Connect</h3>
              <p style={{ color: 'var(--text-muted)' }}>Organizations discover nearby available food and request a pickup.</p>
            </div>
          </div>
          <div className="card text-center" style={{ padding: '0', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80" 
              alt="Community sharing meal" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='200' style='background:%23fef3c7'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23d97706'%3ERescue%3C/text%3E%3C/svg%3E" }}
            />
            <div style={{ padding: '30px 20px' }}>
              <div style={{ background: '#fef3c7', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-55px auto 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)', position: 'relative', zIndex: 2, border: '4px solid white' }}>3</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Rescue</h3>
              <p style={{ color: 'var(--text-muted)' }}>Coordinate, pickup, and distribute to communities in need safely.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '15px' }}>Built for Community</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Real connections. Real impact. Food Rescue Connect brings donors and community organizations together to make sure surplus food reaches people who can use it.
          </p>
        </div>
        
        <div className="grid grid-cols-3" style={{ gap: '30px' }}>
          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ color: 'var(--warning)', fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--dark)', fontSize: '1.1rem', flex: 1, lineHeight: '1.6' }}>
              "Food Rescue Connect makes it much easier for us to find available food and coordinate pickups for our community."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏢</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>Community Partner</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>NGO</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ color: 'var(--warning)', fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--dark)', fontSize: '1.1rem', flex: 1, lineHeight: '1.6' }}>
              "Instead of letting our surplus food go to waste, we can now easily connect it with organizations that actually need it."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏪</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>Local Food Donor</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Supermarket</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ color: 'var(--warning)', fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--dark)', fontSize: '1.1rem', flex: 1, lineHeight: '1.6' }}>
              "Having donation and pickup information all in one place makes it so much easier for our team to contribute and track rescues."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤝</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>Community Volunteer</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Local Charity</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section style={{ background: 'var(--dark)', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '2.5rem', fontWeight: '800' }}>Every connection matters.</h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
          Every donation creates a connection. Every connection creates an impact.
        </p>
        {user ? (
           user.role === 'DONOR' ? (
             <Link to="/donate" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Join the Movement</Link>
           ) : (
             <Link to="/donations" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Join the Movement</Link>
           )
        ) : (
          <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Join the Movement</Link>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
