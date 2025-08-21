import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Causes from './pages/Causes'
import Volunteers from './pages/Volunteers'
import Events from './pages/Events'
import Blogs from './pages/Blogs'
import Testimonials from './pages/Testimonials'
import Media from './pages/Media'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Protected from './lib/protected'
import { AuthProvider, useAuth } from './lib/auth'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/causes', label: 'Causes', icon: '🎯' },
  { to: '/volunteers', label: 'Volunteers', icon: '🤝' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/blogs', label: 'Blogs', icon: '📝' },
  { to: '/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/media', label: 'Media', icon: '🖼️' },
  { to: '/contact', label: 'Contact', icon: '☎️' }
]

function HeaderRight(){
  const { user, logout, token } = useAuth()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      {token ? (<>
        <span className="hidden md:inline">{user?.email}</span>
        <button className="btn btn-outline px-3 py-1" onClick={logout}>Logout</button>
      </>) : null}
      <span>API: {api}</span>
    </div>
  )
}

function Shell(){
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const isAuth = location.pathname === '/login' // <- hide chrome on login

  return (
    <div className="min-h-screen bg-[radial-gradient(80rem_30rem_at_10%_-10%,rgba(247,79,34,0.08),transparent),radial-gradient(70rem_40rem_at_90%_-10%,rgba(2,132,199,0.07),transparent)]">
      <Toaster position="top-right" />

      {/* Top bar (hidden on login) */}
      {!isAuth && (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={()=>setOpen(!open)} className="btn btn-outline px-3 py-1">☰</button>
              <div className="text-xl font-semibold tracking-tight text-brand-600">Hungry4Change Admin</div>
            </div>
            <HeaderRight />
          </div>
        </header>
      )}

      {/* Body container */}
      <div className={isAuth ? '' : 'mx-auto max-w-7xl px-6 py-8 grid grid-cols-12 gap-6'}>
        {/* Sidebar (hidden on login) */}
        {!isAuth && (
          <motion.aside
            initial={{opacity:0, x:-10}}
            animate={{opacity:1, x:0}}
            transition={{type:'spring', stiffness:120, damping:15}}
            className="col-span-12 md:col-span-3 lg:col-span-2"
          >
            <div className="card p-3 sticky top-20">
              <nav className="flex flex-col gap-1">
                {nav.map(i => (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    className={({isActive}) =>
                      `px-3 py-2 rounded-xl transition ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`
                    }
                  >
                    <span className="mr-2">{i.icon}</span>{i.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}

        {/* Main */}
        <main className={isAuth ? '' : 'col-span-12 md:col-span-9 lg:col-span-10'}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login/>} />
            {/* Secured */}
            <Route element={<Protected/>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/causes" element={<Causes/>} />
              <Route path="/volunteers" element={<Volunteers/>} />
              <Route path="/events" element={<Events/>} />
              <Route path="/blogs" element={<Blogs/>} />
              <Route path="/testimonials" element={<Testimonials/>} />
              <Route path="/media" element={<Media/>} />
              <Route path="/contact" element={<Contact/>} />
            </Route>
          </Routes>
        </main>
      </div>

      {/* Footer (hidden on login) */}
      {!isAuth && <footer className="py-10 text-center text-slate-500">Built with ❤️ for Hungry4Change</footer>}
    </div>
  )
}

export default function App(){ return (<AuthProvider><Shell/></AuthProvider>) }