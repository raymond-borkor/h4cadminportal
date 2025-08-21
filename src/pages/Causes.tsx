import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError, mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'
type Cause = { id: string; title: string; category: string; description: string; goalAmount: string; raisedAmount: string; imageUrl?: string; status: 'active'|'completed'|'archived' }
export default function Causes(){
  const [list, setList] = useState<Cause[]>([])
  const [editing, setEditing] = useState<Cause | null>(null)
  // const { register, handleSubmit, reset, setValue } = useForm<Cause>({ defaultValues: { status:'active' } as any })
  const { register, handleSubmit, reset, setValue, watch } = useForm<Cause>({ defaultValues: { status:'active' } as any })
  const img = watch('imageUrl')
  const load = ()=> api.get('/causes').then(r=>setList(r.data)).catch(e=>toast.error(handleError(e)))
  useEffect(()=>{ load() }, [])
  const onSubmit = handleSubmit(async (data)=>{ try{ if (editing) { await api.put(`/causes/${editing.id}`, data); toast.success('Updated') } else { await api.post('/causes', data); toast.success('Created') } reset(); setEditing(null); load() }catch(e){ toast.error(handleError(e)) } })
  const startEdit = (c: Cause)=>{ setEditing(c); reset(c) }
  const del = async (id:string)=>{ if(!confirm('Delete this cause?')) return; await api.delete(`/causes/${id}`).then(()=>{toast.success('Deleted'); load()}).catch(e=>toast.error(handleError(e))) }
  return (<div className="space-y-6">
    <Card title={editing? 'Edit Cause' : 'New Cause'} footer={<div className="flex gap-2"><button className="btn btn-outline" type="button" onClick={()=>{reset({} as any); setEditing(null)}}>Reset</button><button className="btn btn-primary" onClick={onSubmit}>{editing? 'Save Changes' : 'Create'}</button></div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Title"><input className="input" {...register('title', {required:true})} /></Field>
        <Field label="Category"><input className="input" {...register('category', {required:true})} /></Field>
        <Field label="Goal Amount"><input className="input" {...register('goalAmount', {required:true})} placeholder="40000.00" /></Field>
        <Field label="Status"><select className="input" {...register('status', {required:true})}><option value="active">active</option><option value="completed">completed</option><option value="archived">archived</option></select></Field>
        <Field label="Description" hint="A brief description for the cause" ><textarea className="input" rows={5} {...register('description', {required:true})} /></Field>
        {/* <Field label="Image"><ImagePicker value={mediaSrc(editing?.imageUrl)} onChange={(val)=>setValue('imageUrl', val)} /></Field> */}
        <Field label="Image"><ImagePicker value={mediaSrc(img)} onChange={(val)=>setValue('imageUrl', val, { shouldDirty:true })} /></Field>
      </div>
    </Card>
    <div className="card"><Toolbar><div className="text-lg font-semibold">Causes</div><div className="grow" /><button className="btn btn-outline" onClick={()=>{reset({status:'active'} as any); setEditing(null)}}>New</button></Toolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(c=>(<div key={c.id} className="rounded-2xl overflow-hidden border bg-white">
          <img src={mediaSrc(c.imageUrl)} className="w-full h-40 object-cover" />
          <div className="p-4 space-y-1">
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-slate-500">{c.category}</div>
            <div className="text-sm text-slate-500">Goal: ${Number(c.goalAmount).toLocaleString()} • Raised: ${Number(c.raisedAmount||0).toLocaleString()}</div>
            <div className="flex gap-2 pt-2"><button className="btn btn-outline" onClick={()=>startEdit(c)}>Edit</button><button className="btn btn-outline" onClick={()=>del(c.id)}>Delete</button></div>
          </div>
        </div>))}
      </div>
    </div>
  </div>)
}
