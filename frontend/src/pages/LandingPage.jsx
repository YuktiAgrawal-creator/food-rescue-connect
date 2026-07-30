import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <section style={{ textAlign: 'center', padding: '100px 20px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--dark)', marginBottom: '20px' }}>Rescue Food. Reduce Waste. Feed Communities.</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Connect surplus food from local businesses with organizations that can distribute it to those in need.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>Donate Food</Link>
          <Link to="/register" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>Find Food</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>How It Works</h2>
        <div className="grid grid-cols-3">
          <div className="card text-center" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px' }}>1. List Surplus</h3>
            <p>Donors quickly list perfectly good food that would otherwise go to waste.</p>
          </div>
          <div className="card text-center" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px' }}>2. Connect</h3>
            <p>Organizations discover nearby available food and request a pickup.</p>
          </div>
          <div className="card text-center" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px' }}>3. Rescue</h3>
            <p>Coordinate, pickup, and distribute to communities in need.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
