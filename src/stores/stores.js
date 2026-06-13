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
      weather: true,
      searchHistory: [],
      setSearchHistory: (arr) => set({searchHistory: arr}),
			setUsername: (name) => set({username: name}),
			setLocationMode: (mode) => set({locationMode: mode}),
			setManualCoords: (lat, lon) => set({manualLat: lat, manualLon: lon, coords: {lat: parseFloat(lat), lon: parseFloat(lon)}}),
			setAutoCoords: (lat, lon) => set({ coords: { lat, lon } }),
			setAPIKey: (key) => set({apiKey: key}),
      setWeather: (mode) => set({weather: mode})
		}), {name: 'newtab-settings'})
	)


export const useQuery = create((set) => ({
    query: '',
    setQuery: (q) => set({ query: q }),
  }))

export const useWeather = create((set) => ({
    weather: null,
    loading: true,
    error: null,
    fetchWeather: async () => {
      
      const { apiKey, locationMode, manualLat, manualLon, coords } = useCreds.getState()

   let pLat
   let pLon

   if (locationMode === "manual") {
  pLat = parseFloat(manualLat)
  pLon = parseFloat(manualLon)
} else {
  if (!coords) {
    set({ loading: false, error: "Нет координат (разреши геолокацию)" })
    return
  }
  pLat = coords.lat
  pLon = coords.lon
}

  if (!apiKey) {
  set({ loading: false, error: "Нет API ключа" })
  return
} else {
   set({ error: null, loading: false })
}

const API_KEY = apiKey

  try {
  const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pLat}&lon=${pLon}&appid=${API_KEY}&units=metric&lang=ru`)

  if (!resp.ok) {
        let message = `HTTP error ${resp.status}`

        try {
          const errData = await resp.json()
          if (errData?.message) message = errData.message
        } catch (e) { console.error(e)}

        throw new Error(message)
      }

      const data = await resp.json()

      if (!data?.main || !data?.weather?.length) {
        throw new Error('Некорректный ответ от сервера')
      }
       
          set({
             weather: {
                city: data.name,
                feelsLike: data.main.feels_like,
                temp: data.main.temp,
                weatherDesc: data.weather[0].description,
                wind: data.wind.speed,
                weather: data.weather[0].main
             }, loading: false
          })
       } catch (e) {
          set({loading: false, error: e.message})
       }
  
    }
}))

export const useShortcuts = create(persist((set) => ({
  shortcuts: [],
  addShortcut: (s) =>
	set((state) => ({
	  shortcuts: [...state.shortcuts, { ...s, id: crypto.randomUUID() }],
	})),
  removeShortcut: (id) =>
	set((state) => ({
	  shortcuts: state.shortcuts.filter((s) => s.id !== id),
	})),
  updateShortcut: (id, updates) =>
	set((state) => ({
	  shortcuts: state.shortcuts.map((s) =>
		s.id === id ? { ...s, ...updates } : s
	  ),
	})),
		reorderShortcut: (from, to) => set((state) => {
		const items = [...state.shortcuts]
		const [moved] = items.splice(from, 1)
		items.splice(to, 0, moved)
		return { shortcuts: items }

	  })
})))

export const useSearchHistory = create(
  persist(
    (set) => ({
      history: [],
      isActive: false,
      push: (q) => {
        const trimmed = q.trim()
        if (!trimmed) return
        set((s) => ({
          history: [trimmed, ...s.history.filter((h) => h !== trimmed)].slice(0, 8),
        }))
      },
      remove: (q) => set((s) => ({ history: s.history.filter((h) => h !== q) })),
      clear: () => set({ history: [] }),
    }),
    { name: 'search-history' }
  )
)