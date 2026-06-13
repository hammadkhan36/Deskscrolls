'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Initial empty post structure
const initialPost = {
  title: '',
  author: '',
  authorInfo: '',
  intro: '',
  images: ['', '', '', '', ''],
  workspaceItems: [''],
  tools: [''],
  qa: {
    usefulItem: '',
    inspiration: '',
    biggestChallenge: '',
  },
};

export default function PostEditor() {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Handlers
  const handleChange = (field: string, value: string) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'workspaceItems' | 'tools', index: number, value: string) => {
    const newArray = [...post[field]];
    newArray[index] = value;
    setPost((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayItem = (field: 'workspaceItems' | 'tools') => {
    setPost((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveArrayItem = (field: 'workspaceItems' | 'tools', index: number) => {
    const newArray = post[field].filter((_, i) => i !== index);
    setPost((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleQAChange = (field: keyof typeof post.qa, value: string) => {
    setPost((prev) => ({
      ...prev,
      qa: { ...prev.qa, [field]: value },
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...post.images];
    newImages[index] = value;
    setPost((prev) => ({ ...prev, images: newImages }));
  };

  // Simulate Publish
  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      alert('Post published successfully! (Simulated)');
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isPreviewMode ? 'Preview' : 'Create New Post'}
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              {isPreviewMode ? '✏️ Edit' : '👁️ Preview'}
            </button>
            {!isPreviewMode && (
              <button
                onClick={handlePublish}
                disabled={!post.title || isPublishing}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2ecc71] rounded-md hover:bg-[#27ae60] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>

        {/* === EDIT MODE === */}
        {!isPreviewMode && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g. Ivan Nedyalkov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Info</label>
                <input
                  type="text"
                  value={post.authorInfo}
                  onChange={(e) => handleChange('authorInfo', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g. Indie Developer and designer living in Varna, Bulgaria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intro / Bio</label>
                <textarea
                  rows={4}
                  value={post.intro}
                  onChange={(e) => handleChange('intro', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Write a short introduction about the person..."
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-800">Images (Max 5)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {post.images.map((img, index) => (
                  <div key={index} className="space-y-1">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs focus:border-green-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Workspace Items */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-800 flex items-center justify-between">
                Workspace Items
                <button
                  onClick={() => handleAddArrayItem('workspaceItems')}
                  className="text-xs text-green-600 hover:underline"
                >
                  + Add
                </button>
              </h3>
              {post.workspaceItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('workspaceItems', index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    placeholder="e.g. Mac Mini"
                  />
                  <button
                    onClick={() => handleRemoveArrayItem('workspaceItems', index)}
                    className="text-red-500 text-xs hover:text-red-700 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-800 flex items-center justify-between">
                Tools
                <button
                  onClick={() => handleAddArrayItem('tools')}
                  className="text-xs text-green-600 hover:underline"
                >
                  + Add
                </button>
              </h3>
              {post.tools.map((tool, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tool}
                    onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    placeholder="e.g. Xcode"
                  />
                  <button
                    onClick={() => handleRemoveArrayItem('tools', index)}
                    className="text-red-500 text-xs hover:text-red-700 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Q&A Section */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800">Q&A</h3>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Most useful item?</label>
                <textarea
                  rows={2}
                  value={post.qa.usefulItem}
                  onChange={(e) => handleQAChange('usefulItem', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  placeholder="What is the most useful item in your workspace?"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">How do you spark creativity?</label>
                <textarea
                  rows={2}
                  value={post.qa.inspiration}
                  onChange={(e) => handleQAChange('inspiration', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  placeholder="How do you spark creativity?"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Biggest challenge?</label>
                <textarea
                  rows={2}
                  value={post.qa.biggestChallenge}
                  onChange={(e) => handleQAChange('biggestChallenge', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  placeholder="What has been the biggest challenge so far?"
                />
              </div>
            </div>

          </div>
        )}

        {/* === PREVIEW MODE === */}
        {isPreviewMode && (
          <div className="bg-white border border-green-500 rounded-lg p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {post.title || 'Untitled Post'}
              </h1>
              <p className="text-gray-600">
                {post.authorInfo || 'No author info provided'}
              </p>
            </div>

            {/* Intro */}
            <div className="mb-6 text-gray-800 space-y-2">
              <p>{post.intro || 'No intro provided.'}</p>
            </div>

            {/* Images */}
            {post.images.some(img => img) && (
              <div className="flex flex-col gap-4 mb-6">
                {post.images.filter(img => img).map((img, index) => (
                  <div key={index} className="relative w-full aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={img}
                      alt={`Setup ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Workspace Items */}
            {post.workspaceItems.some(item => item) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Workspace Items</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {post.workspaceItems.filter(item => item).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tools */}
            {post.tools.some(tool => tool) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tools</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {post.tools.filter(tool => tool).map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Q&A */}
            {(post.qa.usefulItem || post.qa.inspiration || post.qa.biggestChallenge) && (
              <div className="space-y-4">
                {post.qa.usefulItem && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Most useful item?</h3>
                    <p className="text-gray-700">{post.qa.usefulItem}</p>
                  </div>
                )}
                {post.qa.inspiration && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">How do you spark creativity?</h3>
                    <p className="text-gray-700">{post.qa.inspiration}</p>
                  </div>
                )}
                {post.qa.biggestChallenge && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Biggest challenge?</h3>
                    <p className="text-gray-700">{post.qa.biggestChallenge}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}