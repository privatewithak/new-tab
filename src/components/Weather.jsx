import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import {
  CloudLightning, CloudDrizzle, CloudRain, CloudSnow,
  Wind, Tornado, Sun, Cloud, CloudFog
} from 'lucide-react'

import { useCreds, useWeather } from '../stores/stores'



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