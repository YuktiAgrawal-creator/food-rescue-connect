import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import L from 'leaflet';

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
  const [donations, setDonations] = useState([]);
  
  const [center, setCenter] = useState([20.5937, 78.9629]); // Fallback neutral coordinates (India center roughly)
  const [zoom, setZoom] = useState(5);
  const [locError, setLocError] = useState('');
  const [locating, setLocating] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  const requestLocation = () => {
    setLocError('');
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(15);
          setHasLocation(true);
          setLocating(false);
        },
        (error) => {
          setLocError('Location permission denied or unavailable.');
          setLocating(false);
          // If no location, we can try to center on the first donation if available
          if (donations.length > 0) {
             setCenter([donations[0].latitude, donations[0].longitude]);
             setZoom(10);
          } else {
             setZoom(4); // Default to a broader view but not the whole world
          }
        },
        { timeout: 10000 }
      );
    } else {
      setLocError('Geolocation not supported by your browser.');
      setLocating(false);
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations/');
        const validDonations = res.data.filter(d => d.latitude && d.longitude);
        setDonations(validDonations);
        // Auto request location on load
        requestLocation();
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '20px' }}>
      <div style={{ padding: '15px 20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Donation Map</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Find food near you.</p>
        </div>
        <div>
          {!hasLocation && (
            <button onClick={requestLocation} className="btn btn-primary" disabled={locating}>
              {locating ? 'Finding...' : 'Use My Current Location'}
            </button>
          )}
          {locError && <span style={{ color: 'var(--danger)', marginLeft: '10px' }}>{locError}</span>}
        </div>
      </div>
      <div style={{ height: 'min(550px, 60vh)', width: '100%', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <MapUpdater center={hasLocation ? center : null} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donations.map(don => (
          <Marker key={don.id} position={[don.latitude, don.longitude]}>
            <Popup>
              <strong>{don.title}</strong><br/>
              {don.quantity} {don.unit} - {don.food_category}<br/>
              <Link to={`/donations/${don.id}`} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block' }}>View Details</Link>
            </Popup>
          </Marker>
        ))}
        {hasLocation && (
          <Marker position={center} icon={L.divIcon({className: 'custom-user-marker', html: '<div style="background:var(--secondary);width:15px;height:15px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5);"></div>'})}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
