import { useSearchHistory, useQuery } from "../stores/stores";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Trash2 } from "lucide-react";

function SearchHistory({ theme, isVisible, onClose }) {
  const { history, clear, remove } = useSearchHistory();
  const setQuery = useQuery((state) => state.setQuery);

  // Обработка клика по элементу истории
  const handleItemClick = (item) => {
    setQuery(item);
    onClose(); // Закрываем историю после выбора
  };

  return (
    <AnimatePresence>
      {isVisible && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`absolute top-full mt-4 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden z-40`}
          style={{ boxShadow: theme.cardShadow }}
        >
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <span className="text-sm font-medium text-white/40 flex items-center gap-2">
              <Clock size={14} /> Недавние запросы
            </span>
            <button 
              onClick={clear}
              className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} /> Очистить всё
            </button>
          </div>

          <div className="max-height-[300px] overflow-y-auto custom-scrollbar">
            {history.map((item, index) => (
              <div
                key={index}
                className="group flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-all cursor-pointer"
              >
                <div 
                  className="flex-grow flex items-center gap-3 text-base text-white/70 hover:text-white"
                  onClick={() => handleItemClick(item)}
                >
                  <Search size={16} className="text-white/20" />
                  {item}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(item);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchHistory;