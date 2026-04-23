import axios from 'axios';

const api = axios.create({
  // For local development, use your machine's IP (not localhost) so the phone/emulator can reach it
  // Replace with your deployed URL (e.g., Render) for production
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

export const updateLocation = (volunteer_id, lat, lng) => 
  api.post('/location/update', { volunteer_id, lat, lng }).catch(e => console.log(e));

export const getNearbyDonations = (lat, lng) =>
  api.get(`/volunteers/nearby?lat=${lat}&lng=${lng}`).catch(e => console.log(e));

export const acceptDelivery = (volunteer_id, delivery_id) =>
  api.post('/deliveries/accept', { volunteer_id, delivery_id });

export const confirmPickup = (volunteer_id, delivery_id, photo_url) =>
  api.post('/deliveries/pickup', { volunteer_id, delivery_id, pickup_photo_url: photo_url });

export const confirmDelivery = (volunteer_id, delivery_id, photo_url, notes) =>
  api.post('/deliveries/complete', { volunteer_id, delivery_id, delivery_photo_url: photo_url, notes });

export default api;
