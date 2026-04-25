import axios from 'axios';

// Try direct IP first (phone and laptop on same WiFi)
// If this gives Network Error, switch to the tunnel URL below
const api = axios.create({
  // Direct IP - phone reaches this IP (Expo works on 192.168.1.8:8081)
  baseURL: 'http://192.168.1.8:8082/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  error => {
    console.error(`❌ API Error: ${error.config?.url} - ${error.message}`);
    throw error; // DO NOT swallow - let caller handle
  }
);

export const updateLocation = (volunteer_id, lat, lng) => 
  api.post('/location/update', { volunteer_id, lat, lng }).catch(e => console.log('Location update failed:', e.message));

export const getNearbyDonations = (lat, lng) =>
  api.get(`/donations/nearby?lat=${lat}&lng=${lng}`);

export const acceptDelivery = (volunteer_id, delivery_id) =>
  api.post('/deliveries/accept', { volunteer_id, delivery_id });

export const confirmPickup = (volunteer_id, delivery_id, photo_url) =>
  api.post('/deliveries/pickup', { volunteer_id, delivery_id, pickup_photo_url: photo_url });

export const confirmDelivery = (volunteer_id, delivery_id, photo_url, notes) =>
  api.post('/deliveries/complete', { volunteer_id, delivery_id, delivery_photo_url: photo_url, notes });

export default api;
