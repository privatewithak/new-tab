import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import {
  CloudLightning, CloudDrizzle, CloudRain, CloudSnow,
  Wind, Tornado, Sun, Cloud, CloudFog
} from 'lucide-react'

import { useCreds } from '../stores/stores'



 const useWeather = create((set) => ({
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
   set({error: null, loading: false})
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

function Weather({theme}) {
   const { weather, loading, error, fetchWeather } = useWeather()
   const {apiKey, manualLat, manualLon, locationMode, coords, setAutoCoords} = useCreds()
   const weatherMap = {
  Thunderstorm: { icon: CloudLightning, label: "Гроза" },
  Drizzle:      { icon: CloudDrizzle,   label: "Морось" },
  Rain:         { icon: CloudRain,      label: "Дождь" },
  Snow:         { icon: CloudSnow,      label: "Снег" },
  Mist:         { icon: CloudFog,       label: "Туман" },
  Fog:          { icon: CloudFog,       label: "Туман" },
  Haze:         { icon: CloudFog,       label: "Дымка" },
  Dust:         { icon: Wind,           label: "Пыль" },
  Smoke:        { icon: Wind,           label: "Дым" },
  Squall:       { icon: Wind,           label: "Шквал" },
  Tornado:      { icon: Tornado,        label: "Торнадо" },
  Clear:        { icon: Sun,            label: "Ясно" },
  Clouds:       { icon: Cloud,          label: "Облачно" },
}

   const { icon: Icon, label } = weather ? weatherMap[weather.weather] ?? { icon: Cloud, label: "Неизвестно" } : { icon: Cloud, label: "Неизвестно" };


   useEffect(() => {
  fetchWeather()
}, [apiKey, locationMode, manualLat, manualLon, coords])


     useEffect(() => {
    if (locationMode !== "auto") return

    if (!navigator.geolocation) {
      console.error("Geolocation не поддерживается")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude

        setAutoCoords(lat, lon)
      },
      (err) => {
        console.error("Ошибка геолокации:", err.message)
      }
    )
  }, [locationMode])

   console.log(weather)

   return (
      <div className={`absolute top-10 w-3/20 h-4/20 bg-white/5 rounded-3xl backdrop-blur-xl border ${theme.cardHalo} py-4 flex items-center justify-center`} style={{ boxShadow: theme.cardShadow }}>
         <AnimatePresence mode='wait'>
         {loading && (
            <motion.div
               key='loading'
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center gap-2"
            >
               <motion.div className='w-8 h-8 rounded-full border-2 border-white/20 border-t-white'
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               />

              

            </motion.div>
            )}
            {error && !loading && (
               <motion.div
                  key='error'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm text-center px-4"
               >
                  ⚠️ {error}
               </motion.div>
            )}

            {weather && !loading && (
<motion.div
  key='weather'
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className='w-full h-full px-4 flex flex-col justify-between items-center pt-2 pb-3'
>
  
  <div className='flex flex-col items-center'>
    <Icon size={48} className='text-white' />
    <div className='text-white font-bold text-lg text-center'>
      <p>{Math.floor(weather.temp)}°C</p>
      <p className='text-gray-400 text-xs'>{weather.weatherDesc}</p>
    </div>
  </div>

  
  <div className='w-full flex flex-row justify-between items-end text-white text-xs'>
    <p className='font-semibold'>{weather.city}</p>
    <div className='flex flex-col items-end gap-0.5 text-gray-400'>
      <p>💨 {weather.wind} м/с</p>
      <p>🌡 ощущается {Math.floor(weather.feelsLike)}°C</p>
    </div>
  </div>
</motion.div>




            )}

         </AnimatePresence>

      </div>
   )
}

export default Weather;