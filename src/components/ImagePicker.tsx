import { useState } from 'react'
import MediaUploader from './MediaUploader'
export default function ImagePicker({value,onChange}:{value?:string,onChange:(url:string)=>void}){
  const [open, setOpen] = useState(false)
  return (<div className="space-y-2">
    {value ? <img src={value} className="w-40 h-24 object-cover rounded-xl border" /> : <div className="w-40 h-24 bg-slate-100 rounded-xl border flex items-center justify-center text-slate-400">No image</div>}
    <div className="flex gap-2"><button className="btn btn-outline" onClick={()=>setOpen(o=>!o)}>{open? 'Close' : 'Choose / Upload'}</button>{value ? <button className="btn btn-outline" onClick={()=>onChange('')}>Remove</button> : null}</div>
    {open ? <MediaUploader onSelect={(m)=>{ onChange(m.fullUrl || m.url); setOpen(false) }} /> : null}
  </div>)
}
