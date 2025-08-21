import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import toast from 'react-hot-toast'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@hungry4change.local')
  const [password, setPassword] = useState('admin123')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  async function submit(e:any){ e.preventDefault(); try { setBusy(true); await login(email, password); toast.success('Welcome back!'); nav('/dashboard') } catch(e:any){ toast.error(e?.message || 'Login failed') } finally { setBusy(false) } }
  return (<div className="min-h-screen flex items-center justify-center bg-slate-50">
    <form onSubmit={submit} className="card w-full max-w-md space-y-4">
      <div className="text-center"><div className="text-2xl font-semibold text-brand-600">Hungry4Change Admin</div><div className="text-sm text-slate-500">Sign in to continue</div></div>
      <label className="label">Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
      <label className="label">Password</label><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn btn-primary w-full" disabled={busy}>{busy? 'Signing in…' : 'Sign in'}</button>
      <div className="text-xs text-slate-500 text-center">Default creds are prefilled (from API seed)</div>
    </form></div>)
}
