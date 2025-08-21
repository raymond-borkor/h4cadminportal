import axios from 'axios'
export const API_URL = import.meta.env.VITE_API_URL || 'https://769b3f045ffd.ngrok-free.app'
export const api = axios.create({ baseURL: API_URL, withCredentials: false })
api.interceptors.request.use((config)=>{ const t = localStorage.getItem('token'); if (t) config.headers = { ...(config.headers||{}), Authorization: `Bearer ${t}` }; return config })
export function mediaSrc(url?: string){ if (!url) return ''; if (url.startsWith('http')) return url; return API_URL.replace(/\/$/,'') + url }
export function handleError(e:any){ if (e?.response?.data?.message) return Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message; return e?.message || 'Unexpected error' }
