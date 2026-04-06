import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  Plus, X, Pencil, Check, Globe, Github, Youtube, Instagram,
  Music, Film, BookOpen, Code, Terminal, Database, ShoppingCart,
  Mail, MessageCircle, Camera, Heart, Star, Bookmark, Home,
  Settings, User, Gamepad2, Tv, Monitor, Headphones, Coffee,
  Flame, Zap, Cloud, Map, Twitch, Twitter, Rss, Package,
  Newspaper, Briefcase, GraduationCap, Wallet, Mic, Rocket,
  Pizza, Bot, Brush, Dumbbell, Plane, Search, GripVertical
} from 'lucide-react'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


const useShortcuts = create(persist((set) => ({
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

const ICON_MAP = {
  Globe, Github, Youtube, Instagram, Music, Film, BookOpen, Code,
  Terminal, Database, ShoppingCart, Mail, MessageCircle, Camera,
  Heart, Star, Bookmark, Home, Settings, User, Gamepad2, Tv,
  Monitor, Headphones, Coffee, Flame, Zap, Cloud, Map, Twitch,
  Twitter, Rss, Package, Newspaper, Briefcase, GraduationCap,
  Wallet, Mic, Rocket, Pizza, Bot, Brush, Dumbbell, Plane, Search,
}

const ICON_NAMES = Object.keys(ICON_MAP)


function AnchorModal({ theme, onClose, onSave, initial }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [url, setUrl] = useState(initial?.url ?? '')
  const [iconName, setIconName] = useState(initial?.iconName ?? 'Globe')
  const [iconSearch, setIconSearch] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  )

  const SelectedIcon = ICON_MAP[iconName]

  const handleSave = () => {
    if (!name.trim() || !url.trim()) return
    const finalUrl = url.startsWith('http') ? url : `https://${url}`
    onSave({ name: name.trim(), url: finalUrl, iconName })
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        className={`relative z-10 w-96 bg-slate-950/90 rounded-3xl border ${theme.cardHalo} p-6 flex flex-col gap-5`}
        style={{ boxShadow: theme.cardShadow }}
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 24, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between">
          <span className="text-white text-base font-semibold">
            {initial ? 'Редактировать' : 'Новый якорь'}
          </span>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

     
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-white/10 border ${theme.cardHalo} flex items-center justify-center`}>
            <SelectedIcon size={24} className="text-white" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
          
            <input
              ref={inputRef}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder:text-white/30 focus:border-white/30 transition-colors"
              placeholder="Название (до 15 символов)"
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder:text-white/30 focus:border-white/30 transition-colors"
              placeholder="URL (например: google.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder:text-white/30 focus:border-white/30 transition-colors"
          placeholder="Поиск иконки..."
          value={iconSearch}
          onChange={(e) => setIconSearch(e.target.value)}
        />

        
        <div className="h-44 overflow-y-auto rounded-2xl bg-white/[0.03] border border-white/5 p-2">
          <div className="grid grid-cols-8 gap-1">
            {filtered.map((n) => {
              const Ic = ICON_MAP[n]
              const active = n === iconName
              return (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIconName(n)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    active
                      ? 'bg-white/20 border border-white/30'
                      : 'hover:bg-white/10'
                  }`}
                  title={n}
                >
                  <Ic size={16} className={active ? 'text-white' : 'text-white/50'} />
                </motion.button>
              )
            })}
          </div>
        </div>

      
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={!name.trim() || !url.trim()}
          className={`w-full py-3 rounded-2xl bg-white/10 border ${theme.cardHalo} text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity`}
          style={{ boxShadow: theme.cardShadow }}
        >
          <Check size={16} />
          Сохранить
        </motion.button>
      </motion.div>
    </motion.div>
  )
}


function AnchorCard({ shortcut, theme, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const Icon = ICON_MAP[shortcut.iconName] ?? Globe

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shortcut.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        className="flex flex-col items-center gap-2 group relative"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <>
              <motion.button
                key="edit"
                type="button"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-2 -right-2 z-20 w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(shortcut)
                }}
              >
                <Pencil size={10} />
              </motion.button>

              <motion.button
                key="del"
                type="button"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15, delay: 0.04 }}
                className="absolute -top-2 -left-2 z-20 w-5 h-5 rounded-full bg-red-500/40 border border-red-400/40 flex items-center justify-center text-red-300 hover:bg-red-500/60 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(shortcut.id)
                }}
              >
                <X size={10} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <div className="relative">
          <motion.a
            href={shortcut.url}
            target="_self"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.93 }}
            className={`w-14 h-14 rounded-2xl bg-white/5 border ${theme.cardHalo} backdrop-blur-xl flex items-center justify-center`}
            style={{ boxShadow: theme.cardShadow }}
            draggable={false}
            onClick={(e) => {
              if (isDragging) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <Icon size={26} className="text-white/80" />
          </motion.a>

          <motion.button
            type="button"
            {...listeners}
            className="absolute -bottom-1 -right-1 z-10 w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            aria-label="Перетаскивать"
          >
            <GripVertical size={11} />
          </motion.button>
        </div>

        <span className="text-white/60 text-xs font-medium text-center max-w-16 truncate leading-tight">
          {shortcut.name}
        </span>
      </motion.div>
    </div>
  )
}

function AddCard({ theme, onClick }) {
  return (
    <motion.button
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 260 }}
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-white/5 border border-dashed ${theme.cardHalo} backdrop-blur-xl flex items-center justify-center`}
      >
        <Plus size={22} className="text-white/40" />
      </div>
      <span className="text-white/30 text-xs font-medium">Добавить</span>
    </motion.button>
  )
}


function Anchors({ theme = {}, }) {
  const { shortcuts, addShortcut, removeShortcut, updateShortcut, reorderShortcut } = useShortcuts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const openAdd = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (s) => { setEditTarget(s); setModalOpen(true) }

  const sensors = useSensors(
    useSensor(PointerSensor, {
       activationConstraint: { distance: 8 },
    })
  )

    const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = shortcuts.findIndex((s) => s.id === active.id)
    const newIndex = shortcuts.findIndex((s) => s.id === over.id)
    reorderShortcut(oldIndex, newIndex)
  }

  const handleSave = (data) => {
    if (editTarget) {
      updateShortcut(editTarget.id, data)
    } else {
      addShortcut(data)
    }
  }

  if (!shortcuts.length && !theme.cardHalo) return null

  return (
    <>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      >
                <SortableContext
          items={shortcuts.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
      <div className="flex flex-row flex-wrap items-start justify-center gap-5 px-8 max-w-2xl">
        <AnimatePresence mode="popLayout">
          {shortcuts.map((s) => (
            <AnchorCard
              key={s.id}
              shortcut={s}
              theme={theme}
              onEdit={openEdit}
              onDelete={removeShortcut}
              
            />
          ))}
        </AnimatePresence>

        {shortcuts.length < 18 && (
          <AddCard theme={theme} onClick={openAdd} />
        )}
      </div>


      <AnimatePresence>
        {modalOpen && (
          <AnchorModal
            theme={theme}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initial={editTarget}
          />
        )}
      </AnimatePresence>
      </SortableContext>
      </DndContext>
    </>
  )
}

export default Anchors