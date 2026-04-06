import { create } from 'zustand'
import { persist } from 'zustand/middleware';

export const useCreds = create(
		persist((set) => ({
			username: 'privatewithak',
			locationMode: "auto",
			manualLat: '',
			manualLon: '',
			coords: null,
			apiKey: '',
			setUsername: (name) => set({username: name}),
			setLocationMode: (mode) => set({locationMode: mode}),
			setManualCoords: (lat, lon) => set({manualLat: lat, manualLon: lon, coords: {lat: parseFloat(lat), lon: parseFloat(lon)}}),
			setAutoCoords: (lat, lon) => set({ coords: { lat, lon } }),
			setAPIKey: (key) => set({apiKey: key})
		}), {name: 'newtab-settings'})
	)

