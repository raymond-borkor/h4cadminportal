import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError, mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'
type Testimonial = { id:string; name:string; role?:string; message:string; imageUrl?:string }
export default function Testimonials(){
  const [list, setList] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const { register, handleSubmit, reset, setValue, watch } = useForm<Testimonial>({})
  const img = watch('imageUrl')
  const load = ()=> api.get('/testimonials').then(r=>setList(r.data)).catch(e=>toast.error(handleError(e)))
  useEffect(()=>{ load() }, [])
  const onSubmit = handleSubmit(async (data)=>{ try{ if (editing) { await api.put(`/testimonials/${editing.id}`, data); toast.success('Updated') } else { await api.post('/testimonials', data); toast.success('Created') } reset({} as any); setEditing(null); load() }catch(e){ toast.error(handleError(e)) } })
  const del = (id:string)=>{ if(!confirm('Delete?')) return; api.delete(`/testimonials/${id}`).then(()=>{toast.success('Deleted'); load()}).catch(e=>toast.error(handleError(e))) }
  return (<div className="space-y-6">
    <Card title={editing? 'Edit Testimonial':'New Testimonial'} footer={<div className="flex gap-2"><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>Reset</button><button className="btn btn-primary" onClick={onSubmit}>{editing? 'Save':'Create'}</button></div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name"><input className="input" {...register('name', {required:true})} /></Field>
        <Field label="Role"><input className="input" {...register('role')} /></Field>
        <Field label="Message"><textarea className="input" rows={6} {...register('message', {required:true})} /></Field>
        <Field label="Image"><ImagePicker value={mediaSrc(img)} onChange={(val)=>setValue('imageUrl', val, { shouldDirty:true })} /></Field>
      </div>
    </Card>
    <div className="card"><Toolbar><div className="text-lg font-semibold">Testimonials</div><div className="grow" /><button className="btn btn-outline" onClick={()=>{reset({} as any); setEditing(null)}}>New</button></Toolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(t=>(<div key={t.id} className="rounded-2xl overflow-hidden border bg-white">
          <img src={mediaSrc(t.imageUrl)} className="w-full h-40 object-cover" />
          <div className="p-4 space-y-1">
            <div className="font-semibold">{t.name}</div><div className="text-sm text-slate-500">{t.role}</div>
            <div className="line-clamp-2 text-slate-600">{t.message}</div>
            <div className="flex gap-2 pt-2"><button className="btn btn-outline" onClick={()=>{setEditing(t); reset(t)}}>Edit</button><button className="btn btn-outline" onClick={()=>del(t.id)}>Delete</button></div>
          </div></div>))}
      </div></div>
  </div>)
}
