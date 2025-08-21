import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError, mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'
type Event = { id:string; title:string; location:string; date:string; description?:string; imageUrl?:string }
export default function Events(){
  const [list, setList] = useState<Event[]>([])
  const [editing, setEditing] = useState<Event | null>(null)
  const { register, handleSubmit, reset, setValue, watch } = useForm<Event>({})
  const img = watch('imageUrl')
  const load = ()=> api.get('/events').then(r=>setList(r.data)).catch(e=>toast.error(handleError(e)))
  useEffect(()=>{ load() }, [])
  const onSubmit = handleSubmit(async (data)=>{ try{ if (editing) { await api.put(`/events/${editing.id}`, data); toast.success('Updated') } else { await api.post('/events', data); toast.success('Created') } reset({} as any); setEditing(null); load() }catch(e){ toast.error(handleError(e)) } })
  const del = (id:string)=>{ if(!confirm('Delete this event?')) return; api.delete(`/events/${id}`).then(()=>{toast.success('Deleted'); load()}).catch(e=>toast.error(handleError(e))) }
  return (<div className="space-y-6">
    <Card title={editing? 'Edit Event':'New Event'} footer={<div className="flex gap-2"><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>Reset</button><button className="btn btn-primary" onClick={onSubmit}>{editing? 'Save':'Create'}</button></div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Title"><input className="input" {...register('title', {required:true})} /></Field>
        <Field label="Location"><input className="input" {...register('location', {required:true})} /></Field>
        <Field label="Date"><input type="datetime-local" className="input" {...register('date', {required:true})} /></Field>
        <Field label="Description"><textarea className="input" rows={5} {...register('description')} /></Field>
        <Field label="Image"><ImagePicker value={mediaSrc(img)} onChange={(val)=>setValue('imageUrl', val, { shouldDirty:true })} /></Field>
      </div>
    </Card>
    <div className="card"><Toolbar><div className="text-lg font-semibold">Events</div><div className="grow" /><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>New</button></Toolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(e=>(<div key={e.id} className="rounded-2xl overflow-hidden border bg-white">
          <img src={mediaSrc(e.imageUrl)} className="w-full h-40 object-cover" />
          <div className="p-4 space-y-1">
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm text-slate-500">{new Date(e.date).toLocaleString()}</div>
            <div className="flex gap-2 pt-2"><button className="btn btn-outline" onClick={()=>{setEditing(e); reset(e)}}>Edit</button><button className="btn btn-outline" onClick={()=>del(e.id)}>Delete</button></div>
          </div></div>))}
      </div></div>
  </div>)
}
