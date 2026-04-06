import { useCreds } from "../stores/stores";
import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, MapPin, Key, Navigation, Map, Check, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from "../util/Modal";


function Field({ label, icon: Icon, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 uppercase tracking-widest">
                <Icon size={11} />
                {label}
            </label>
            {children}
        </div>
    );
}


function Input({ className = '', ...props }) {
    return (
        <input
            className={`bg-white/5 border border-white/8 hover:border-white/15 focus:border-white/25 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/20 outline-none transition-all duration-200 w-full ${className}`}
            {...props}
        />
    );
}


function SegmentedControl({ value, onChange, options }) {
    return (
        <div className="flex bg-white/5 border border-white/8 rounded-xl p-1 gap-1">
            {options.map(opt => (
                <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer ${
                        value === opt.value
                            ? 'text-white'
                            : 'text-white/30 hover:text-white/60'
                    }`}
                    style={{ position: 'relative' }}
                >
                    {value === opt.value && (
                        <motion.div
                            layoutId="segment-bg"
                            className="absolute inset-0 bg-white/10 rounded-lg border border-white/15"
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                        <opt.icon size={12} />
                        {opt.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}

// Toast notification
function SavedToast({ visible }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-400/80"
                >
                    <Check size={12} />
                    Сохранено
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function Settings() {
    const [open, setOpen] = useState(false);
    const {
        username, setUsername,
        locationMode, setLocationMode,
        manualLat, manualLon, setManualCoords,
        apiKey, setAPIKey,
    } = useCreds();

   
    const [draft, setDraft] = useState({
        username: '',
        locationMode: 'auto',
        manualLat: '',
        manualLon: '',
        apiKey: '',
    });
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    
    useEffect(() => {
        if (open) {
            setDraft({ username, locationMode, manualLat, manualLon, apiKey });
            setShowKey(false);
            setSaved(false);
        }
    }, [open]);

    function handleSave() {
        setUsername(draft.username);
        setLocationMode(draft.locationMode);
        setAPIKey(draft.apiKey);
        if (draft.locationMode === 'manual') {
            setManualCoords(draft.manualLat, draft.manualLon);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);

        window.location.reload()
    }

    const patch = (key) => (e) => setDraft(d => ({ ...d, [key]: e.target.value }));

    return (
        <>
            <motion.button
                onClick={() => setOpen(prev => !prev)}
                className="bg-white/5 border border-white/10 backdrop-blur-2xl p-3 rounded-xl flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <motion.div
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <SettingsIcon size={16} className="text-white/70" />
                </motion.div>
            </motion.button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-white flex flex-col gap-0">

                    
                    <div className="flex items-center justify-between pb-4 border-b border-white/8">
                        <div className="flex items-center gap-2">
                            <SettingsIcon size={14} className="text-white/40" />
                            <h2 className="text-sm font-semibold text-white/80 tracking-wide">Настройки</h2>
                        </div>
                        <SavedToast visible={saved} />
                    </div>

                    
                    <div className="flex flex-col gap-5 pt-5">

                        
                        <Field label="Имя пользователя" icon={User}>
                            <Input
                                value={draft.username}
                                onChange={patch('username')}
                                placeholder="Как тебя звать?"
                            />
                        </Field>

                        
                        <Field label="API ключ" icon={Key}>
                            <div className="relative">
                                <Input
                                    type={showKey ? 'text' : 'password'}
                                    value={draft.apiKey}
                                    onChange={patch('apiKey')}
                                    placeholder="Ваш API ключ..."
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                                >
                                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                
                            </div>
                            <p className="text-xs text-gray-600 ml-1">Использует <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank" className="underline">OpenWeatherMap API</a></p>
                        </Field>

                       
                        <Field label="Геолокация" icon={MapPin}>
                            <SegmentedControl
                                value={draft.locationMode}
                                onChange={(v) => setDraft(d => ({ ...d, locationMode: v }))}
                                options={[
                                    { value: 'auto', label: 'Авто', icon: Navigation },
                                    { value: 'manual', label: 'Вручную', icon: Map },
                                ]}
                            />
                        </Field>

                        
                        <AnimatePresence initial={false}>
                            {draft.locationMode === 'manual' && (
                                <motion.div
                                    key="manual-coords"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex gap-2 pt-0">
                                        <Input
                                            value={draft.manualLat}
                                            onChange={patch('manualLat')}
                                            placeholder="Широта (55.75)"
                                            type="number"
                                        />
                                        <Input
                                            value={draft.manualLon}
                                            onChange={patch('manualLon')}
                                            placeholder="Долгота (37.62)"
                                            type="number"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                 
                    <div className="pt-5 flex justify-end gap-2 border-t border-white/8 mt-5">
                        <motion.button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
                            whileTap={{ scale: 0.96 }}
                        >
                            Отмена
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
                            whileTap={{ scale: 0.96 }}
                        >
                            Сохранить
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </>
    );
}