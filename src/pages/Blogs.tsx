import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError, mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'
type Blog = { id:string; title:string; slug:string; excerpt?:string; content:string; imageUrl?:string; createdAt?:string }
export default function Blogs(){
  const [list, setList] = useState<Blog[]>([])
  const [editing, setEditing] = useState<Blog | null>(null)
  const { register, handleSubmit, reset, setValue, watch } = useForm<Blog>({})
  const img = watch('imageUrl')
  const load = ()=> api.get('/blogs').then(r=>setList(r.data)).catch(e=>toast.error(handleError(e)))
  useEffect(()=>{ load() }, [])
  const onSubmit = handleSubmit(async (data)=>{ try{ if (editing) { await api.put(`/blogs/${editing.id}`, data); toast.success('Updated') } else { await api.post('/blogs', data); toast.success('Created') } reset({} as any); setEditing(null); load() }catch(e){ toast.error(handleError(e)) } })
  const del = (id:string)=>{ if(!confirm('Delete this blog?')) return; api.delete(`/blogs/${id}`).then(()=>{toast.success('Deleted'); load()}).catch(e=>toast.error(handleError(e))) }
  return (<div className="space-y-6">
    <Card title={editing? 'Edit Blog' : 'New Blog'} footer={<div className="flex gap-2"><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>Reset</button><button className="btn btn-primary" onClick={onSubmit}>{editing? 'Save Changes':'Create'}</button></div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Title"><input className="input" {...register('title', {required:true})} /></Field>
        <Field label="Slug"><input className="input" {...register('slug', {required:true})} /></Field>
        <Field label="Excerpt"><textarea className="input" rows={3} {...register('excerpt')} /></Field>
        <Field label="Content"><textarea className="input" rows={8} {...register('content', {required:true})} /></Field>
        <Field label="Image"><ImagePicker value={mediaSrc(img)} onChange={(val)=>setValue('imageUrl', val, { shouldDirty:true })} /></Field>
      </div>
    </Card>
    <div className="card"><Toolbar><div className="text-lg font-semibold">Blogs</div><div className="grow" /><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>New</button></Toolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(b=>(<div key={b.id} className="rounded-2xl overflow-hidden border bg-white">
          <img src={mediaSrc(b.imageUrl)} className="w-full h-40 object-cover" />
          <div className="p-4 space-y-1"><div className="font-semibold">{b.title}</div><div className="text-sm text-slate-500">{new Date(b.createdAt||'').toLocaleDateString()}</div>
            <div className="flex gap-2 pt-2"><button className="btn btn-outline" onClick={()=>{ setEditing(b); reset(b) }}>Edit</button><button className="btn btn-outline" onClick={()=>del(b.id)}>Delete</button></div>
          </div></div>))}
      </div></div>
  </div>)
}
