import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, handleError } from '../lib/api'
import { Card, Field } from '../components/Field'

type FormValues = {
  email?: string
  phone?: string
  address?: string
  socialLinksText?: string // <- keep as editable JSON text in the UI
}

export default function Contact() {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({})

  useEffect(() => {
    api.get('/contact')
      .then(r => {
        const { email, phone, address, socialLinks } = r.data || {}
        reset({
          email,
          phone,
          address,
          socialLinksText: JSON.stringify(socialLinks || {}, null, 2), // show as pretty JSON
        })
      })
      .catch(e => toast.error(handleError(e)))
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    let socialLinks: Record<string, string> = {}
    try {
      if (data.socialLinksText && data.socialLinksText.trim() !== '') {
        socialLinks = JSON.parse(data.socialLinksText) // must be an object
        if (socialLinks === null || typeof socialLinks !== 'object' || Array.isArray(socialLinks)) {
          throw new Error('Social links must be a JSON object')
        }
      }
    } catch {
      toast.error('Social Links must be valid JSON (an object).')
      return
    }

    // Build payload WITHOUT id
    const payload = {
      email: data.email,
      phone: data.phone,
      address: data.address,
      socialLinks,
    }

    try {
      await api.put('/contact', payload)
      toast.success('Saved')
    } catch (e) {
      toast.error(handleError(e))
    }
  })

  return (
    <div className="space-y-6">
      <Card title="Contact & Socials" footer={<div><button className="btn btn-primary" onClick={onSubmit}>Save</button></div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Email"><input className="input" {...register('email')} /></Field>
          <Field label="Phone"><input className="input" {...register('phone')} /></Field>
          <Field label="Address"><input className="input" {...register('address')} /></Field>

          {/* Controlled textarea so we can parse it */}
          <Field label="Social Links (JSON)" hint='e.g. {"facebook":"...","instagram":"...","linkedin":"..."}'>
            <textarea
              rows={6}
              className="input font-mono text-sm"
              value={watch('socialLinksText') || ''}
              onChange={(e) => setValue('socialLinksText', e.target.value, { shouldDirty: true })}
            />
          </Field>
        </div>
      </Card>
    </div>
  )
}
