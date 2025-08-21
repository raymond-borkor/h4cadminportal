import { createContext, useContext, useEffect, useState } from 'react'
type User = { id:string; email:string; name:string } | null
type AuthCtx = { user: User; token: string | null; login: (email:string, password:string)=>Promise<void>; logout: ()=>void }
const Ctx = createContext<AuthCtx>({ user: null, token: null, login: async()=>{}, logout: ()=>{} })
export function AuthProvider({children}:{children:any}){
  const [user, setUser] = useState<User>(null)
  const [token, setToken] = useState<string | null>(null)
  useEffect(()=>{ const t = localStorage.getItem('token'); const u = localStorage.getItem('user'); if (t) setToken(t); if (u) setUser(JSON.parse(u)) },[])
  async function login(email:string, password:string){
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})
    })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    localStorage.setItem('token', data.access_token); localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.access_token); setUser(data.user)
  }
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null) }
  return <Ctx.Provider value={{user, token, login, logout}}>{children}</Ctx.Provider>
}
export const useAuth = ()=>useContext(Ctx)
