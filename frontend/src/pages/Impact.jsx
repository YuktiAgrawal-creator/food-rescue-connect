import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#059669', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const Impact = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('analytics/');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load impact stats from analytics endpoint', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary)' }}>Loading impact dashboard...</h2>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)' }}>Failed to load impact data.</h2>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  // Formatting data for charts
  const donationVsPickupData = [
    { name: 'Total Donations', value: stats.total_donations || 0 },
    { name: 'Completed Pickups', value: stats.completed_pickups || 0 }
  ];

  const breakdownData = (stats.completed_breakdown || []).map(item => ({
    name: (item.unit || 'unknown').toUpperCase(),
    value: item.quantity || 0
  }));

  const communityData = [
    { name: 'Food Donors', value: stats.food_donors || 0 },
    { name: 'Partner Orgs', value: stats.partner_organizations || 0 },
    { name: 'Completed Pickups', value: stats.completed_pickups || 0 }
  ];

  const rescueProgressData = [
    { name: 'Created Donations', value: stats.rescue_progress?.created_donations || 0 },
    { name: 'Rescued Donations', value: stats.rescue_progress?.rescued_donations || 0 }
  ];

  return (
    <div style={{ paddingBottom: '60px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <section className="hero-section" style={{ 
        background: 'linear-gradient(135deg, rgba(5,150,105,0.9) 0%, rgba(4,120,87,0.9) 100%), url("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', 
        padding: '80px 20px', 
        textAlign: 'center' 
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '15px', fontWeight: '800' }}>Real Impact, Real Data.</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
          Every completed pickup represents food successfully redirected from waste to people who need it.
        </p>
      </section>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="grid grid-cols-2" style={{ gap: '30px' }}>
          
          {/* CHART 1: DONATIONS VS PICKUPS */}
          <div className="card" style={{ padding: '25px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
              Donations vs Pickups
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationVsPickupData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: '#475569'}} />
                  <YAxis allowDecimals={false} tick={{fill: '#475569'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} name="Count">
                    {donationVsPickupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: COMPLETED FOOD BREAKDOWN */}
          <div className="card" style={{ padding: '25px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
              Completed Food Breakdown
            </h3>
            <div style={{ height: '300px' }}>
              {breakdownData.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* CHART 3: COMMUNITY PARTICIPATION */}
          <div className="card" style={{ padding: '25px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
              Community Participation
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={communityData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{fill: '#475569'}} />
                  <YAxis dataKey="name" type="category" tick={{fill: '#475569', fontWeight: '500'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={40} name="Participants">
                    {communityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 4: RESCUE PROGRESS */}
          <div className="card" style={{ padding: '25px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
              Rescue Progress
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rescueProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: '#475569'}} />
                  <YAxis allowDecimals={false} tick={{fill: '#475569'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={60} name="Total">
                    {rescueProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#ec4899'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
      
      <section className="container" style={{ marginTop: '60px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>Join the Movement</h3>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px' }}>Whether you have surplus food or can help distribute it, your participation matters.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Become a Donor</a>
          <a href="/register" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Register Organization</a>
        </div>
      </section>
    </div>
  );
};

export default Impact;
