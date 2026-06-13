// // import Navbar from './../../components/Navbar';
// // import Footer from './../../components/Footer';
// // import PostEditor from './../../components/PostEditor';

// // export default function NewPostPage() {
// //   return (
// //     <>
// //       <Navbar />
// //       <main className="min-h-screen bg-gray-50 pb-16">
// //         <div className="max-w-4xl mx-auto px-4 py-8">
// //           <PostEditor />
// //         </div>
// //       </main>
// //       <Footer />
// //     </>
// //   );
// // }

















// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Navbar from './../../components/Navbar';
// import Footer from './../../components/Footer';
// import RichTextEditor from './../../components/RichTextEditor';

// export default function NewPostPage() {
//   const router = useRouter();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [isPreviewMode, setIsPreviewMode] = useState(false);
//   const [isPublishing, setIsPublishing] = useState(false);

//   const handlePublish = () => {
//     setIsPublishing(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsPublishing(false);
//       alert('Post published successfully! (Simulated)');
//       router.push('/profile');
//     }, 1500);
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
//         <div className="max-w-4xl mx-auto">
          
//           {/* Header Actions */}
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {isPreviewMode ? 'Preview' : 'Create New Post'}
//             </h1>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setIsPreviewMode(!isPreviewMode)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
//               >
//                 {isPreviewMode ? '✏️ Edit' : '👁️ Preview'}
//               </button>
//               {!isPreviewMode && (
//                 <button
//                   onClick={handlePublish}
//                   disabled={!title || !content || isPublishing}
//                   className="px-4 py-2 text-sm font-medium text-white bg-[#2ecc71] rounded-md hover:bg-[#27ae60] transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isPublishing ? 'Publishing...' : 'Publish'}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* === EDIT MODE === */}
//           {!isPreviewMode && (
//             <div className="space-y-4">
//               <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full rounded-md border border-gray-300 px-4 py-3 text-lg font-bold focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
//                   placeholder="Enter post title..."
//                 />
//               </div>

//               <RichTextEditor
//                 content={content}
//                 onChange={(html) => setContent(html)}
//               />
//             </div>
//           )}

//           {/* === PREVIEW MODE === */}
//           {isPreviewMode && (
//             <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                 {title || 'Untitled Post'}
//               </h1>
//               <div 
//                 className="prose prose-lg max-w-none"
//                 dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">No content yet.</p>' }}
//               />
//             </div>
//           )}

//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
















'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './../../components/Navbar';
import Footer from './../../components/Footer';
import AdvancedEditor from '../../components/UltimateTipTapEditor';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      alert('🎉 Post published successfully!');
      router.push('/profile');
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {isPreviewMode ? '📖 Preview' : '✍️ New Post'}
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
                  disabled={!title || !content || isPublishing}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2ecc71] rounded-md hover:bg-[#27ae60] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? '⏳ Publishing...' : '🚀 Publish'}
                </button>
              )}
            </div>
          </div>

          {/* === EDIT MODE === */}
          {!isPreviewMode && (
            <div className="space-y-5">
              {/* Cover Image */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Title */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-2xl font-bold focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your post title here..."
                />
              </div>

              {/* Advanced Editor */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <AdvancedEditor
                  content={content}
                  onChange={(html: string) => setContent(html)}
                />
              </div>

              
            </div>
          )}

          {/* === PREVIEW MODE === */}
          {isPreviewMode && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Cover Image */}
              {coverImage && (
                <div className="relative w-full h-64 md:h-80 bg-gray-100">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title || 'Untitled Post'}
                </h1>
                <div className="prose prose-lg max-w-none">
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <p className="text-gray-400 italic">No content yet. Switch to Edit mode to start writing.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}