'use client';

import { useState } from 'react';
import { createBlog } from './actions';

export default function AddBlogPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const res = await createBlog(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            name="title"
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Blog ka title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="khali chhodo to auto banega"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. Setup, Review"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            name="cover_image"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Short description"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">
              Content (HTML paste karo) *
            </label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs px-2 py-1 bg-neutral-200 rounded"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {preview ? (
            <div
              className="border rounded-lg p-4 min-h-[300px] prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <textarea
              name="content"
              required
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              placeholder="<h2>Heading</h2><p>Yahan apna HTML content paste karo...</p>"
            />
          )}
          {preview && <input type="hidden" name="content" value={content} />}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}