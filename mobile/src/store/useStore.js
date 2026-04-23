import { create } from 'zustand';

const useStore = create((set) => ({
  volunteerId: 1, // Mock volunteer ID
  isOnline: true,
  currentLocation: { latitude: 37.7749, longitude: -122.4194 },
  activeDelivery: null,
  
  setOnline: (status) => set({ isOnline: status }),
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),
  clearActiveDelivery: () => set({ activeDelivery: null }),
}));

export default useStore;
