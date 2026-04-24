import { create } from 'zustand';

const useStore = create((set) => ({
  volunteerId: 2, // Mock volunteer ID from db.js (John Doe)
  restaurantId: 1, // Mock restaurant ID from db.js (Fresh Bakes)
  shelterId: 4, // Mock shelter ID from db.js (City Shelter)
  isOnline: true,
  currentLocation: { latitude: 17.385, longitude: 78.4867 }, // Set to Hyderabad coordinates for demo
  activeDelivery: null,
  
  setOnline: (status) => set({ isOnline: status }),
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),
  clearActiveDelivery: () => set({ activeDelivery: null }),
}));

export default useStore;
