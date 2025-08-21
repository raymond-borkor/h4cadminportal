import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
type Stats = { byCause: { causeId:string, title:string, total:string }[], overall: string }
type MediaItem = { size?: string }
export default function Dashboard(){
  const [counts, setCounts] = useState({causes:0, volunteers:0, events:0, blogs:0, testimonials:0, media:0})
  const [stats, setStats] = useState<Stats | null>(null)
  const [storage, setStorage] = useState<number>(0)
  useEffect(()=>{
    Promise.all([ api.get('/causes'), api.get('/volunteers'), api.get('/events'), api.get('/blogs'), api.get('/testimonials'), api.get('/media',{params:{take:100}}), api.get('/donations/stats') ])
    .then(([causes,vols,events,blogs,tests,media,don])=>{
      setCounts({causes:causes.data.length, volunteers:vols.data.length, events:events.data.length, blogs:blogs.data.length, testimonials:tests.data.length, media:media.data.length})
      const bytes = (media.data as MediaItem[]).reduce((a,m)=>a + Number(m.size||0),0); setStorage(bytes); setStats(don.data)
    }).catch(e=>toast.error(e?.message||'Failed to load'))
  },[])
  const COLORS = ['#f74f22','#0ea5e9','#14b8a6','#f59e0b','#6366f1','#10b981']
  const chartData = (stats?.byCause || []).map((c)=>({ name: c.title, value: Number(c.total) }))
  function fmtMoney(n:number){ return '$'+n.toLocaleString() }
  function fmtBytes(b:number){ if(!b) return '0 B'; const u=['B','KB','MB','GB']; let i=0; while(b>1024 && i<u.length-1){ b/=1024; i++ } return b.toFixed(1)+' '+u[i] }
  return (<div className="space-y-6">
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} transition={{duration:.4}} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[{label:'Causes',value:counts.causes},{label:'Volunteers',value:counts.volunteers},{label:'Events',value:counts.events},{label:'Blogs',value:counts.blogs},{label:'Testimonials',value:counts.testimonials},{label:'Media',value:counts.media}].map((k,i)=>(
        <div key={i} className="card text-center"><div className="text-3xl font-semibold text-slate-800">{k.value}</div><div className="text-slate-500">{k.label}</div></div>
      ))}
    </motion.div>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-7"><div className="card">
        <div className="mb-3 text-lg font-semibold">Donations by Cause</div>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" outerRadius={110}>
          {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(v)=>fmtMoney(Number(v))} /></PieChart></ResponsiveContainer></div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">{chartData.map((d,i)=>(<div key={i} className="flex items-center gap-2 text-slate-700"><div className="w-3 h-3 rounded-full" style={{background:COLORS[i%COLORS.length]}} /><span className="text-sm">{d.name}</span></div>))}</div>
      </div></div>
      <div className="col-span-12 lg:col-span-5"><div className="card">
        <div className="mb-3 text-lg font-semibold">Totals</div>
        <div className="space-y-3"><div className="flex justify-between"><span className="text-slate-600">Overall Raised</span><span className="font-semibold">{fmtMoney(Number(stats?.overall||0))}</span></div>
        <div className="flex justify-between"><span className="text-slate-600">Media Storage (approx)</span><span className="font-semibold">{fmtBytes(storage)}</span></div></div>
      </div></div>
    </div>
  </div>)
}
