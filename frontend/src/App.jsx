import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import OrgDashboard from './pages/OrgDashboard';
import DonationList from './pages/DonationList';
import DonationForm from './pages/DonationForm';
import DonationDetail from './pages/DonationDetail';
import MapPage from './pages/MapPage';
import Impact from './pages/Impact';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/impact" element={<Impact />} />
            
            <Route path="/donor/dashboard" element={<ProtectedRoute role="DONOR"><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donate" element={<ProtectedRoute role="DONOR"><DonationForm /></ProtectedRoute>} />
            
            <Route path="/org/dashboard" element={<ProtectedRoute role="ORGANIZATION"><OrgDashboard /></ProtectedRoute>} />
            <Route path="/donations" element={<ProtectedRoute><DonationList /></ProtectedRoute>} />
            <Route path="/donations/:id" element={<ProtectedRoute><DonationDetail /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute role="ORGANIZATION"><MapPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
