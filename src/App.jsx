import { useEffect, useState, } from 'react'
import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { COLOR_RGB, generateTheme } from './themes/generateTheme'
import Typewriter from 'typewriter-effect'
import { Search } from 'lucide-react'
import Blobs from './components/Blobs' 
import Weather from './components/Weather'
import { greets, placeholders } from './data/randomArrs'
import Anchors from './components/Anchors'
import Settings from './components/Settings'
import Portal from './util/Portal'
import { useCreds } from './stores/stores'

// TODO

// история поиска



  const useQuery = create((set) => ({
    query: '',
    setQuery: (q) => set({ query: q }),
  }))




const App = () => {
  const query = useQuery((state) => state.query)
  const setQuery = useQuery((state) => state.setQuery)
  const {username} = useCreds()

  const handleSearch = (ev) => {
    ev.preventDefault();
    
   if (query.trim()) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_self');
  }

  const [theme, setTheme] = useState({})

  useEffect(() => {
    const keys = Object.keys(COLOR_RGB)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    const currTheme = randomKey
    console.log(currTheme)
    setTheme(() => generateTheme(currTheme))
  }, [])

  return (
    <div className='bg-slate-950 h-screen w-screen relative overflow-hidden'>
      
        <Blobs />

      <div className='w-screen h-screen text-3xl text-white'>
        
        <div className='flex justify-start items-center w-screen h-screen relative flex-col gap-7 pt-70'>
<Portal>
  <div className="fixed top-4 right-4 z-50">
    <Settings />
  </div>
</Portal>
          <Weather theme={theme}/>
          <div>
            <h1>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(700)
                    .typeString(`${greets[Math.floor(Math.random() * greets.length)]}, `)
                    .pauseFor(500)
                    .typeString(`${username}!`)
                    .pauseFor(4500)
                    .callFunction(() => {
                      
                      try {
                        document.querySelector('.Typewriter__cursor').style.display = 'none'
                      } catch (e) {
                        console.error('ты ахуел биля?: ' + e)
                      }
                    })
                    .start();
                }}
                options={{
                  delay: 50,
                  deleteSpeed: 38
                }}
              />
            </h1></div>
          <AnimatePresence mode='wait'>
          
            <motion.div initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} exit={{opacity: 0.2, y: 40, scale: 0.95}}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.35 },
              }} className={`min-w-4/10 min-h-2/20 bg-white/5 rounded-3xl backdrop-blur-xl border ${theme.cardHalo} py-4 flex items-center justify-center`} style={{ boxShadow: theme.cardShadow }}>
              <motion.div whileHover={{scale: 1.02, y: -3}} className={`w-8/10 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 px-5 py-3 flex items-center gap-3`}>
                <div>
                  <Search size={20} className='text-white/50 shrink-0' />
                </div>
                <form className='contents' onSubmit={handleSearch}>
                  <input className={`w-full bg-transparent outline-none ${theme.textSoft} placeholder:${theme.textAccent} text-base`} placeholder={`${placeholders[Math.floor(Math.random() * placeholders.length)]}`} value={query} onChange={(e) => setQuery(e.target.value)} />
                </form>
              </motion.div>
            </motion.div>
            
             
              <motion.div exit={{opacity: 0, y: 10}}>
                <Anchors theme={theme}/> </motion.div>
                
          </AnimatePresence>
          

          
        </div>
        
      </div>
      </div>
  )
}

export default App;