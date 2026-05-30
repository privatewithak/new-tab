import {useState, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

const Tooltip ({children, text}) => {
    const [show, setShow] = useState(false)
    const timerRef = useRef(null)


    const handleMouseEnter = () => {
   
    timerRef.current = setTimeout(() => {
      setShow(true)
    }, 1500)
  }

  const handleMouseLeave = () => {
   
    clearTimeout(timerRef.current)
    setShow(false)
  }


  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap z-[100] shadow-xl pointer-events-none"
          >
            {text}
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
