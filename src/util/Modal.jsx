import { AnimatePresence, motion } from 'framer-motion'
import Portal from './Portal'


export default function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <Portal>
          
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-2xl p-6 w-[400px]"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  )
}