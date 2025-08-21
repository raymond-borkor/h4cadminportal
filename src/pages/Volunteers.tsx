import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError, mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'

type Social = { facebook?: string; instagram?: string; twitter?: string; linkedin?: string; website?: string }
type Volunteer = {
  id: string
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  socialLinks?: Social
}

type FormValues = {
  name: string
  role?: string
  bio?: string
  imageUrl?: string
}

export default function Volunteers() {
  const [list, setList] = useState<Volunteer[]>([])
  const [editing, setEditing] = useState<Volunteer | null>(null)
  const [social, setSocial] = useState<Social>({})
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({})
  const img = watch('imageUrl')

  const load = () =>
    api.get('/volunteers')
      .then((r) => setList(r.data))
      .catch((e) => toast.error(handleError(e)))

  useEffect(() => { load() }, [])

  function startEdit(v: Volunteer) {
    setEditing(v)
    reset({
      name: v.name,
      role: v.role,
      bio: v.bio,
      imageUrl: v.imageUrl,
    })
    setSocial({
      facebook: v.socialLinks?.facebook || '',
      instagram: v.socialLinks?.instagram || '',
      twitter: v.socialLinks?.twitter || '',
      linkedin: v.socialLinks?.linkedin || '',
      website: v.socialLinks?.website || '',
    })
  }

  function clearForm() {
    setEditing(null)
    reset({} as any)
    setSocial({})
  }

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      // Only include keys that have values
      socialLinks: Object.fromEntries(
        Object.entries(social).filter(([, v]) => v && String(v).trim() !== '')
      ),
    }

    try {
      if (editing) {
        await api.put(`/volunteers/${editing.id}`, payload)
        toast.success('Volunteer updated')
      } else {
        await api.post('/volunteers', payload)
        toast.success('Volunteer created')
      }
      clearForm()
      load()
    } catch (e) {
      toast.error(handleError(e))
    }
  })

  async function remove(id: string) {
    if (!confirm('Delete this volunteer?')) return
    try { await api.delete(`/volunteers/${id}`); toast.success('Deleted'); load() }
    catch (e) { toast.error(handleError(e)) }
  }

  return (
    <div className="space-y-6">
      <Card
        title={editing ? 'Edit Volunteer' : 'New Volunteer'}
        footer={
          <div className="flex gap-2">
            <button className="btn btn-outline" type="button" onClick={clearForm}>Reset</button>
            <button className="btn btn-primary" onClick={onSubmit}>
              {editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name">
            <input className="input" {...register('name', { required: true })} />
          </Field>
          <Field label="Role" hint="e.g. Coordinator, Volunteer">
            <input className="input" {...register('role')} />
          </Field>
          <Field label="Bio">
            <textarea className="input" rows={5} {...register('bio')} />
          </Field>
          <Field label="Profile Image">
            <ImagePicker value={mediaSrc(img)} onChange={(val) => setValue('imageUrl', val, { shouldDirty:true })} />
          </Field>

          {/* Socials */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Facebook">
              <input className="input" value={social.facebook || ''} onChange={(e) => setSocial((s) => ({ ...s, facebook: e.target.value }))} />
            </Field>
            <Field label="Instagram">
              <input className="input" value={social.instagram || ''} onChange={(e) => setSocial((s) => ({ ...s, instagram: e.target.value }))} />
            </Field>
            <Field label="Twitter / X">
              <input className="input" value={social.twitter || ''} onChange={(e) => setSocial((s) => ({ ...s, twitter: e.target.value }))} />
            </Field>
            <Field label="LinkedIn">
              <input className="input" value={social.linkedin || ''} onChange={(e) => setSocial((s) => ({ ...s, linkedin: e.target.value }))} />
            </Field>
            <Field label="Website">
              <input className="input" value={social.website || ''} onChange={(e) => setSocial((s) => ({ ...s, website: e.target.value }))} />
            </Field>
          </div>
        </div>
      </Card>

      <div className="card">
        <Toolbar>
          <div className="text-lg font-semibold">Volunteers</div>
          <div className="grow" />
          <button className="btn btn-outline" onClick={clearForm}>New</button>
        </Toolbar>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((v) => (
            <div key={v.id} className="rounded-2xl overflow-hidden border bg-white">
              <img src={mediaSrc(v.imageUrl)} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-1">
                <div className="font-semibold">{v.name}</div>
                <div className="text-sm text-slate-500">{v.role || 'Volunteer'}</div>
                {v.bio ? <div className="text-sm text-slate-600 line-clamp-2">{v.bio}</div> : null}
                <div className="flex gap-2 pt-2">
                  <button className="btn btn-outline" onClick={() => startEdit(v)}>Edit</button>
                  <button className="btn btn-outline" onClick={() => remove(v.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
