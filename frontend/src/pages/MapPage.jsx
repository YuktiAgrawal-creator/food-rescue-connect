import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
  const [donations, setDonations] = useState([]);
  
  // Default to a central location (e.g. center of US) if browser geoloc fails
  const [center, setCenter] = useState([39.8283, -98.5795]);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations/');
        setDonations(res.data.filter(d => d.latitude && d.longitude)); // Only map items with coords
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(11);
      });
    }
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 70px)', width: '100%' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donations.map(don => (
          <Marker key={don.id} position={[don.latitude, don.longitude]}>
            <Popup>
              <strong>{don.title}</strong><br/>
              {don.quantity} {don.unit} - {don.food_category}<br/>
              <Link to={`/donations/${don.id}`}>View Details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
