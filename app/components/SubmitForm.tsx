
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/utils/supabase-uploads'

type SocialProfile = {
  platform: string
  handle: string
}

const platformOptions = [
  'GitHub',
  'Twitter',
  'Instagram',
  'Behance',
  'Dribbble',
  'LinkedIn',
  'YouTube',
  'Personal Website',
  'Other',
]

export default function SubmitForm() {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    photoLink: '',      // optional external link
    description: '',
    equipment: '',
    consent: false,
    newsletter: false,
  })
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
    { platform: '', handle: '' },
  ])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([]) // local previews
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])   // after submit success, not used

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Handle simple inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [id]: val }))
  }

  // Social profiles handlers
  const handleSocialChange = (index: number, field: 'platform' | 'handle', value: string) => {
    const updated = [...socialProfiles]
    updated[index][field] = value
    setSocialProfiles(updated)
  }

  const addSocialRow = () => {
    setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
  }

  const removeSocialRow = (index: number) => {
    if (socialProfiles.length === 1) return // keep at least one
    setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
  }

  // Image upload handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 images total
    const total = imageFiles.length + files.length
    if (total > 5) {
      alert('You can upload a maximum of 5 images.')
      return
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])
    setImageFiles((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    const updatedFiles = [...imageFiles]
    updatedFiles.splice(index, 1)
    setImageFiles(updatedFiles)

    const updatedPreviews = [...imagePreviews]
    URL.revokeObjectURL(updatedPreviews[index]) // clean up memory
    updatedPreviews.splice(index, 1)
    setImagePreviews(updatedPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) {
      setMessage({ type: 'error', text: 'You must agree to be featured.' })
      return
    }
    if (!formData.email || !formData.name) {
      setMessage({ type: 'error', text: 'Email and name are required.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // 1. Upload images (if any) and collect URLs
      let uploadedImageUrls: string[] = []
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) =>
          uploadImage(file, 'submissions', 'user-uploads')
        )
        uploadedImageUrls = await Promise.all(uploadPromises)
      }

      // 2. Build social_profiles JSON (filter out empty handles)
      const validSocialProfiles = socialProfiles.filter(
        (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
      )

      // 3. Insert into submissions table
      const { error } = await supabase.from('submissions').insert({
        email: formData.email,
        name: formData.name,
        photo_link: formData.photoLink || null,
        image_urls: uploadedImageUrls, // jsonb
        social_profiles: validSocialProfiles, // jsonb
        description: formData.description || null,
        equipment: formData.equipment || null,
        consent: formData.consent,
        newsletter: formData.newsletter,
        status: 'pending',
      })

      if (error) throw error

      // Success
      setMessage({ type: 'success', text: 'Submitted successfully! We will review your workspace. 🎉' })

      // Reset form
      setFormData({
        email: '',
        name: '',
        photoLink: '',
        description: '',
        equipment: '',
        consent: false,
        newsletter: false,
      })
      setSocialProfiles([{ platform: '', handle: '' }])
      setImageFiles([])
      setImagePreviews([])
      setUploadedUrls([])
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Show us your workspace for a chance to be featured ✨
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Fill out the form below. You can upload photos directly or link to an external album.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                Email address *
              </label>
              <input id="email" type="email" required value={formData.email} onChange={handleInputChange}
                placeholder="you@example.com" className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm ..." />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5">
                Your name *
              </label>
              <input id="name" type="text" required value={formData.name} onChange={handleInputChange}
                placeholder="John Doe" className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm ..." />
            </div>

            {/* Social Profiles (Dynamic) */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Social profiles (where can we find you?)
              </label>
              {socialProfiles.map((profile, index) => (
                <div key={index} className="flex gap-2 text-gray-800 mb-2 items-start">
                  <select
                    value={profile.platform}
                    onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                    className="w-1/3 rounded-md bg-gray-50 border border-gray-200 px-2 py-3 text-sm"
                  >
                    <option value="">Select</option>
                    {platformOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Handle or URL"
                    value={profile.handle}
                    onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
                    className="flex-1 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm"
                  />
                  <button type="button" onClick={() => removeSocialRow(index)} disabled={socialProfiles.length === 1}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-3 disabled:opacity-30">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSocialRow}
                className="text-green-600 hover:text-green-700 text-sm mt-1 flex items-center gap-1">
                + Add another profile
              </button>
            </div>

            {/* Photo Link (optional external URL) */}
            <div>
              <label htmlFor="photoLink" className="block text-sm font-semibold text-gray-800 mb-1.5">
                External link to photos/video (optional)
              </label>
              <input id="photoLink"  type="url" value={formData.photoLink} onChange={handleInputChange}
                placeholder="Google Drive, Dropbox, etc." className="w-full p-2 rounded-md bg-gray-50 border ..." />
            </div>

            {/* Image Upload (Direct) */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Or upload images (max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover rounded-md border" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-gray-100">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1.5">
                Short description of your workspace
              </label>
              <textarea id="description" rows={3} value={formData.description} onChange={handleInputChange}
                placeholder="Minimal home office for remote work..." className="w-full p-2 rounded-md bg-gray-50 text-gray-800 ..." />
            </div>

            {/* Equipment */}
            <div>
              <label htmlFor="equipment" className="block text-sm font-semibold text-gray-800 mb-1.5">
                Key equipment (optional)
              </label>
              <textarea id="equipment" rows={3} value={formData.equipment} onChange={handleInputChange}
                placeholder="Monitor: Dell U2723QE, Keyboard: Keychron K8..." className="w-full rounded-md bg-gray-50 text-gray-800 p-2 ..." />
            </div>

            {/* Consent */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" id="consent" checked={formData.consent} onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm text-gray-700">
                  I agree that DeskScrolls may feature my workspace and I own the rights to the photos. *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" id="newsletter" checked={formData.newsletter} onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm text-gray-700">
                  Sign me up for the DeskScrolls newsletter.
                </span>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting || !formData.consent}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-md hover:bg-gray-800 ...">
              {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
            </button>

            {message && (
              <div className={`mt-4 text-sm font-medium p-3 rounded-md border ${
                message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}