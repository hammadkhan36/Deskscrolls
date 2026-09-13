'use client'

import { useRef, useState } from 'react'
import { uploadBlogImage } from './uploadImage'

export default function RichEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split')
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    const res = await uploadBlogImage(fd)
    setUploading(false)

    if (res?.error) {
      alert('Upload failed: ' + res.error)
      return
    }

    const imgTag = `<img src="${res.url}" alt="image" class="rounded-xl w-full my-6" />\n`
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue =
        value.substring(0, start) + imgTag + value.substring(end)
      onChange(newValue)
    } else {
      onChange(value + '\n' + imgTag)
    }
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer text-sm px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
            <span>📷</span>
            <span>{uploading ? 'Uploading...' : 'Insert Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <span className="text-xs text-gray-500">
            HTML paste karo ya image upload karo
          </span>
        </div>

        <div className="flex gap-1 bg-white border rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1 rounded ${mode === 'edit' ? 'bg-black text-white' : ''}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1 rounded ${mode === 'split' ? 'bg-black text-white' : ''}`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded ${mode === 'preview' ? 'bg-black text-white' : ''}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className={`grid ${mode === 'split' ? 'md:grid-cols-2 divide-x' : 'grid-cols-1'}`}>
        {mode !== 'preview' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={24}
            placeholder="<h2>Heading</h2>&#10;<p>Yahan HTML paste karo ya image insert karo...</p>"
            className="w-full p-4 font-mono text-sm outline-none resize-none"
          />
        )}

        {mode !== 'edit' && (
          <div
            className="p-6 prose prose-lg max-w-none overflow-y-auto"
            style={{ maxHeight: '600px' }}
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">Preview yahan dikhega...</p>' }}
          />
        )}
      </div>
    </div>
  )
}