'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  togglePublish,
  softDeleteBlog,
  restoreBlog,
  hardDeleteBlog,
} from '@/admin/blogs/new/actions'

type Props = {
  id: string
  slug: string
  published: boolean
  deleted: boolean
}

export default function BlogRowActions({ id, slug, published, deleted }: Props) {
  const [pending, startTransition] = useTransition()
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setBusy(true)
    await togglePublish(id, !published)
    setBusy(false)
    startTransition(() => router.refresh())
  }

  async function handleDelete() {
    if (!confirm('Blog ko trash mein bhejna hai? (restore ho sakta hai)')) return
    setBusy(true)
    await softDeleteBlog(id)
    setBusy(false)
    startTransition(() => router.refresh())
  }

  async function handleRestore() {
    setBusy(true)
    await restoreBlog(id)
    setBusy(false)
    startTransition(() => router.refresh())
  }

  async function handleHardDelete() {
    if (!confirm('⚠️ Permanent delete — wapas nahi aayega. Sure?')) return
    setBusy(true)
    await hardDeleteBlog(id)
    setBusy(false)
    startTransition(() => router.refresh())
  }

  const disabled = busy || pending

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Published status */}
      <span
        className={`px-2 py-0.5 rounded-full font-medium ${
          deleted
            ? 'bg-red-100 text-red-700'
            : published
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {deleted ? 'TRASH' : published ? 'LIVE' : 'DRAFT'}
      </span>

      {!deleted && (
        <>
          <Link
            href={`/blogs/${slug}`}
            target="_blank"
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            View
          </Link>

          <Link
            href={`/admin/blogs/${id}/edit`}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            Edit
          </Link>

          <button
            onClick={handleToggle}
            disabled={disabled}
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {published ? 'Unpublish' : 'Publish'}
          </button>

          <button
            onClick={handleDelete}
            disabled={disabled}
            className="px-2 py-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </>
      )}

      {deleted && (
        <>
          <button
            onClick={handleRestore}
            disabled={disabled}
            className="px-2 py-1 rounded text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            Restore
          </button>
          <button
            onClick={handleHardDelete}
            disabled={disabled}
            className="px-2 py-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete Forever
          </button>
        </>
      )}
    </div>
  )
}