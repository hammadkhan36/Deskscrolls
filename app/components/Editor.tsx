// components/Editor.tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { useState, useCallback } from 'react'
import { uploadImage } from '@/lib/utils/supabase-uploads'

const Toolbar = ({ editor }: { editor: any }) => {
  const [imageModal, setImageModal] = useState(false)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const addImage = useCallback(async () => {
    if (!imgFile) return
    setUploading(true)
    const url = await uploadImage(imgFile, 'setups', 'content')
    setUploading(false)
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
      setImgFile(null)
      setImageModal(false)
    } else {
      alert('Image upload failed')
    }
  }, [imgFile, editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 border-b pb-2 mb-2 bg-gray-50 p-2 rounded-t-lg overflow-x-auto">
      {/* Text formatting buttons */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-300' : ''}><b>B</b></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-300' : ''}><i>I</i></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-gray-300' : ''}><u>U</u></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}>H3</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>&larr;</button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>&rarr;</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</button>
      <button onClick={() => {
        const url = window.prompt('Enter link URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }}>Link</button>
      <button onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>
      <button onClick={() => setImageModal(true)} className="bg-blue-100 px-2 rounded">🖼️ Image</button>

      {/* Image modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setImageModal(false); setImgFile(null) }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={addImage} disabled={!imgFile || uploading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Insert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TiptapEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight,
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[200px] focus:outline-none" />
    </div>
  )
}