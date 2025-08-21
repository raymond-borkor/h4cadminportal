import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { api, mediaSrc, handleError } from '../lib/api'
import toast from 'react-hot-toast'
type MediaItem = { id: string; url: string; filename: string; mimeType?: string; size?: string; createdAt?: string; fullUrl?: string }
export default function MediaUploader({onSelect}:{onSelect?:(item:MediaItem)=>void}){
  const [items, setItems] = useState<MediaItem[]>([])
  const [busy, setBusy] = useState(false)
  const [page, setPage] = useState({skip:0,take:24})
  const fetchList = async (reset=false) => { try { const { data } = await api.get('/media', { params: page }); setItems(reset ? data : [...items, ...data]) } catch (e:any) { toast.error(handleError(e)) } }
  useEffect(()=>{ fetchList(true) }, [page.skip, page.take])
  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0]; if (!file) return
    const form = new FormData(); form.append('file', file)
    try { setBusy(true); const { data } = await api.post('/media/upload', form); toast.success('Uploaded'); setItems([data, ...items]); onSelect?.(data) } catch(e:any){ toast.error(handleError(e)) } finally { setBusy(false) }
  }, [items])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.png','.jpg','.jpeg','.gif','.webp'] }, multiple:false })
  return (<div className="space-y-4">
    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-2xl ${isDragActive? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white'} cursor-pointer`}>
      <input {...getInputProps()} /><div className="text-center"><div className="text-lg font-medium mb-2">{busy ? 'Uploading…' : 'Drop image here or click to upload'}</div><div className="text-slate-500 text-sm">Allowed: jpg, jpeg, png, webp, gif</div></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map(m => (<button key={m.id} className="group relative rounded-xl overflow-hidden border border-slate-200" onClick={()=>onSelect?.(m)}>
        <img className="w-full h-28 object-cover group-hover:scale-105 transition" src={mediaSrc(m.fullUrl || m.url)} />
        <div className="absolute inset-0 ring-0 ring-brand-500/0 group-hover:ring-4 transition" /></button>))}
    </div>
    <div className="flex justify-center"><button className="btn btn-outline" onClick={()=>setPage(p=>({...p, skip:p.skip + p.take}))}>Load more</button></div>
  </div>)
}
