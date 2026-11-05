'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/utils/supabase-uploads'

type BrandImageUploadFieldProps = {
  name: 'logo_url' | 'cover_image_url'
  label: string
  initialUrl?: string
  kind: 'logo' | 'cover'
}

export default function BrandImageUploadField({
  name,
  label,
  initialUrl = '',
  kind,
}: BrandImageUploadFieldProps) {
  const [url, setUrl] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const uploadedUrl = await uploadImage(
        file,
        'site-media',
        kind === 'logo'
          ? 'brands/logos'
          : 'brands/covers'
      )

      setUrl(uploadedUrl)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Image upload failed.'
      )
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800">
        {label}
      </label>

      <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-100">
        {uploading
          ? 'Optimizing and uploading…'
          : `Choose ${kind === 'logo' ? 'logo' : 'cover image'}`}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={uploading}
          className="sr-only"
        />
      </label>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Or paste an existing image URL
        </label>

        <input
          type="url"
          name={name}
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setError('')
          }}
          placeholder="https://..."
          className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
        />
      </div>

      {url && (
        <div className="overflow-hidden rounded-lg border bg-gray-100">
          {/* Admin preview supports manually pasted external URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`${label} preview`}
            className={
              kind === 'logo'
                ? 'h-40 w-full bg-white object-contain p-6'
                : 'aspect-[16/9] w-full object-cover'
            }
          />

          <div className="flex justify-end border-t bg-white p-2">
            <button
              type="button"
              onClick={() => setUrl('')}
              className="rounded-md border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove image
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="text-xs leading-5 text-gray-500">
        {kind === 'logo'
          ? 'Use a transparent PNG or WebP logo. Recommended canvas: 600 × 300.'
          : 'Use a clean 16:9 image. Recommended size: 1600 × 900.'}
      </p>
    </div>
  )
}
