// 'use client';

// import { useEffect, useState } from 'react';
// // import { useEditor, EditorContent } from '@tiptap/react';

// // // ✅ Default imports (JSX components)
// // import BubbleMenu from '@tiptap/extension-bubble-menu';
// // import FloatingMenu from '@tiptap/extension-floating-menu';

// import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';

// import StarterKit from '@tiptap/starter-kit';
// import TextAlign from '@tiptap/extension-text-align';
// import Color from '@tiptap/extension-color';
// import { TextStyle } from '@tiptap/extension-text-style';
// import FontFamily from '@tiptap/extension-font-family';
// import Image from '@tiptap/extension-image';
// import { Table } from '@tiptap/extension-table';
// import { TableRow } from '@tiptap/extension-table-row';
// import { TableCell } from '@tiptap/extension-table-cell';
// import { TableHeader } from '@tiptap/extension-table-header';
// import Blockquote from '@tiptap/extension-blockquote';
// import HorizontalRule from '@tiptap/extension-horizontal-rule';
// import Placeholder from '@tiptap/extension-placeholder';
// import CharacterCount from '@tiptap/extension-character-count';
// import Focus from '@tiptap/extension-focus';
// import Typography from '@tiptap/extension-typography';
// import Link from '@tiptap/extension-link';
// import Highlight from '@tiptap/extension-highlight';
// import Youtube from '@tiptap/extension-youtube';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import { common, createLowlight } from 'lowlight';

// // Syntax Highlighting Setup
// const lowlight = createLowlight(common);

// export default function UltimateTipTapEditor({ content = '', onChange }) {
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [wordCount, setWordCount] = useState(0);
//   const [charCount, setCharCount] = useState(0);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         codeBlock: false,
//       }),
//       TextStyle,
//       FontFamily,
//       Color,
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Highlight.configure({
//         multicolor: true,
//       }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           class: 'text-blue-600 underline hover:text-blue-800 transition',
//         },
//       }),
//       Image.configure({
//         HTMLAttributes: {
//           class: 'rounded-lg mx-auto shadow-sm',
//         },
//       }),
//       Table.configure({
//         resizable: true,
//         HTMLAttributes: {
//           class: 'border-collapse w-full',
//         },
//       }),
//       TableRow,
//       TableCell,
//       TableHeader,
//       CodeBlockLowlight.configure({
//         lowlight,
//         HTMLAttributes: {
//           class: 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed',
//         },
//       }),
//       Blockquote.configure({
//         HTMLAttributes: {
//           class: 'border-l-4 border-green-500 pl-4 italic text-gray-700',
//         },
//       }),
//       HorizontalRule.configure({
//         HTMLAttributes: {
//           class: 'my-6 border-gray-300',
//         },
//       }),
//       Placeholder.configure({
//         placeholder: 'Start writing your story... Use / for commands',
//       }),
//       CharacterCount.configure({
//         limit: 20000,
//       }),
//       Focus,
//       Typography,
//       Youtube.configure({
//         width: 100,
//         height: 400,
//         HTMLAttributes: {
//           class: 'rounded-lg shadow-md w-full aspect-video',
//         },
//       }),
//     ],
//     content: content,
//     editorProps: {
//       attributes: {
//         class: 'prose prose-lg max-w-none p-4 min-h-[500px] focus:outline-none',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       const text = editor.getText();
//       const words = text.trim() ? text.trim().split(/\s+/).length : 0;
//       const chars = text.length;
//       setWordCount(words);
//       setCharCount(chars);
//       if (onChange) onChange(html);
//     },
//   });

//   useEffect(() => {
//     if (isFullscreen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isFullscreen]);

//   const handleImageUpload = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = () => {
//       const file = input.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const url = e.target?.result;
//           editor?.chain().focus().setImage({ src: url }).run();
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };

//   if (!editor) {
//     return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
//   }

//   return (
//     <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>

//       {/* Toolbar */}
//       <div className="sticky top-0 z-10 bg-white text-gray-700 border-b border-gray-200 p-1.5 flex flex-wrap items-center gap-1 shadow-sm">

//         {/* Undo/Redo */}
//         <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 hover:bg-gray-100 rounded-md">↩</button>
//         <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 hover:bg-gray-100 rounded-md">↪</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Headings */}
//         <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>H1</button>
//         <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>H2</button>
//         <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>H3</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Formatting */}
//         <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-0.5 font-bold rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>B</button>
//         <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-0.5 italic rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>I</button>
//         <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-0.5 underline rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>U</button>
//         <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-0.5 line-through rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>S</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Alignment */}
//         <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>←</button>
//         <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>↔</button>
//         <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>→</button>
//         <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>☰</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Lists */}
//         <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-0.5 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>•</button>
//         <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-0.5 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>1.</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Insert */}
//         <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-2 py-0.5 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>❝</button>
//         <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`px-2 py-0.5 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>&lt;/&gt;</button>
//         <button onClick={handleImageUpload} className="px-2 py-0.5 rounded hover:bg-gray-100">🖼</button>
//         <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-0.5 rounded hover:bg-gray-100">─</button>
//         <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className="px-2 py-0.5 rounded hover:bg-gray-100">📊</button>

//         {/* YouTube */}
//         <button onClick={() => {
//           const url = window.prompt('Enter YouTube URL:');
//           if (url) {
//             editor.chain().focus().setYoutube({ src: url }).run();
//           }
//         }} className="px-2 py-0.5 rounded hover:bg-gray-100">▶</button>

//         <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`px-2 py-0.5 rounded ${editor.isActive('taskList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>☑</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Colors */}
//         <input 
//           type="color" 
//           onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()} 
//           className="w-6 h-6 cursor-pointer p-0 border-0 rounded"
//         />
//         <button onClick={() => editor.chain().focus().unsetColor().run()} className="px-1.5 py-0.5 text-xs rounded hover:bg-gray-100">✕</button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Font Family */}
//         <select 
//           onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
//           className="text-sm py-0.5 px-2 border border-gray-200 rounded bg-white focus:outline-none"
//         >
//           <option value="">Font</option>
//           <option value="Arial, sans-serif">Arial</option>
//           <option value="Georgia, serif">Georgia</option>
//           <option value="Courier New, monospace">Courier</option>
//         </select>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Links */}
//         <button onClick={() => {
//           const url = window.prompt('Enter URL:');
//           if (url) editor.chain().focus().setLink({ href: url }).run();
//         }} className={`px-2 py-0.5 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>🔗</button>

//         {/* Fullscreen */}
//         <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-2 py-0.5 rounded hover:bg-gray-100 ml-auto">
//           {isFullscreen ? '⛶' : '⛶'}
//         </button>

//         {/* Word Count */}
//         <div className="text-xs text-gray-500 ml-auto hidden sm:block">
//           {wordCount} words
//         </div>
//       </div>

//       {/* === BUBBLE MENU === */}
//       <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
//         <div className="flex gap-1 bg-white shadow-lg rounded-lg p-1.5 border border-gray-200">
//           <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs font-bold">B</button>
//           <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs italic">I</button>
//           <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs underline">U</button>
//           <button onClick={() => {
//             const url = window.prompt('Enter URL:');
//             if (url) editor.chain().focus().setLink({ href: url }).run();
//           }} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs">🔗</button>
//           <button onClick={handleImageUpload} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs">🖼</button>
//         </div>
//       </BubbleMenu>

//       {/* === SLASH COMMAND MENU === */}
//       <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
//         <div className="bg-white shadow-xl rounded-lg p-1 border border-gray-200 w-56 max-h-60 overflow-y-auto">
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Heading 1
//           </button>
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Heading 2
//           </button>
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Heading 3
//           </button>
//           <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Bullet List
//           </button>
//           <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Numbered List
//           </button>
//           <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Quote
//           </button>
//           <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Code Block
//           </button>
//           <button onClick={handleImageUpload} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Image
//           </button>
//           <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded">
//             Table
//           </button>
//         </div>
//       </FloatingMenu>

//       {/* === EDITOR CONTENT === */}
//       <div className={`bg-white ${isFullscreen ? 'h-[calc(100vh-100px)] overflow-y-auto' : 'min-h-[500px]'}`}>
//         <EditorContent editor={editor} />
//       </div>

//     </div>
//   );
// }















// {/* Toolbar */}
//       <div className="sticky top-0 z-10 bg-white text-gray-700 border-b border-gray-200 p-1.5 flex flex-wrap items-center gap-1 shadow-sm">
//         {/* Undo/Redo */}
//         <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 hover:bg-gray-100 rounded-md">
//           ↩
//         </button>
//         <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 hover:bg-gray-100 rounded-md">
//           ↪
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Headings */}
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
//             }`}
//         >
//           H1
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
//             }`}
//         >
//           H2
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
//             }`}
//         >
//           H3
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Formatting */}
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`px-2 py-0.5 font-bold rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           B
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`px-2 py-0.5 italic rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           I
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={`px-2 py-0.5 underline rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           U
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={`px-2 py-0.5 line-through rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           S
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Alignment */}
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('left').run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           ←
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('center').run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           ↔
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('right').run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           →
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('justify').run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           ☰
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Lists */}
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           •
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           1.
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Insert */}
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           ❝
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           &lt;/&gt;
//         </button>
//         {/* UPDATED IMAGE BUTTON */}
//         <button
//           onClick={handleImageUpload}
//           disabled={uploading}
//           className="px-2 py-0.5 rounded hover:bg-gray-100 disabled:opacity-50"
//         >
//           {uploading ? '⏳' : '🖼'}
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setHorizontalRule().run()}
//           className="px-2 py-0.5 rounded hover:bg-gray-100"
//         >
//           ─
//         </button>
//         <button
//           onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
//           className="px-2 py-0.5 rounded hover:bg-gray-100"
//         >
//           📊
//         </button>

//         {/* YouTube */}
//         <button
//           onClick={() => {
//             const url = window.prompt('Enter YouTube URL:')
//             if (url) {
//               editor.chain().focus().insertContent({ type: 'youtube', attrs: { src: url } }).run()
//             }
//           }}
//           className="px-2 py-0.5 rounded hover:bg-gray-100"
//         >
//           ▶
//         </button>


//         {/* YouTube button ke baad yahan add karein */}
// <button
//   type="button" 
//   onClick={() => {
//     const url = window.prompt('Paste Embed URL (Twitter, Instagram, YouTube, Reddit, etc.)')
//     if (!url) return
//     let provider: 'other' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'tiktok' | 'spotify' = 'other'
//     try {
//       const hostname = new URL(url).hostname
//       if (hostname.includes('twitter.com') || hostname.includes('x.com')) provider = 'twitter'
//       else if (hostname.includes('instagram.com')) provider = 'instagram'
//       else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) provider = 'youtube'
//       else if (hostname.includes('reddit.com')) provider = 'reddit'
//       else if (hostname.includes('tiktok.com')) provider = 'tiktok'
//       else if (hostname.includes('open.spotify.com')) provider = 'spotify'
//     } catch {}
//     editor.chain().focus().setEmbed({ url, provider }).run()

// //     editor.chain().focus().insertContent({
// //   type: 'embed',
// //   attrs: { url, provider }
// // }).run()

//      // 👇 Debug line – yahan laga kar browser console dekh sakte hain
//     const chain = editor.chain().focus()
//     console.log('Available commands:', chain)
//   }}
//   className="px-2 py-0.5 rounded hover:bg-gray-100 text-sm"
//   title="Embed Tweet/Post"
// >
//   🧩
// </button>

//         <button
//           onClick={() => editor.chain().focus().toggleTaskList().run()}
//           className={`px-2 py-0.5 rounded ${editor.isActive('taskList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           ☑
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Colors */}
//         <input
//           type="color"
//           onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
//           className="w-6 h-6 cursor-pointer p-0 border-0 rounded"
//         />
//         <button
//           onClick={() => editor.chain().focus().unsetColor().run()}
//           className="px-1.5 py-0.5 text-xs rounded hover:bg-gray-100"
//         >
//           ✕
//         </button>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Font Family */}
//         <select
//           onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
//           className="text-sm py-0.5 px-2 border border-gray-200 rounded bg-white focus:outline-none"
//         >
//           <option value="">Font</option>
//           <option value="Arial, sans-serif">Arial</option>
//           <option value="Georgia, serif">Georgia</option>
//           <option value="Courier New, monospace">Courier</option>
//         </select>
//         <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

//         {/* Links */}
//         <button
//           onClick={() => {
//             const url = window.prompt('Enter URL:')
//             if (url) editor.chain().focus().setLink({ href: url }).run()
//           }}
//           className={`px-2 py-0.5 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         >
//           🔗
//         </button>

//         {/* Fullscreen */}
//         <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-2 py-0.5 rounded hover:bg-gray-100 ml-auto">
//           {isFullscreen ? '⛶' : '⛶'}
//         </button>

//         {/* Word Count */}
//         <div className="text-xs text-gray-500 ml-auto hidden sm:block">{wordCount} words</div>
//       </div>






'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Focus from '@tiptap/extension-focus'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, List, ListOrdered, Quote, Code2, 
  ImageIcon, Minus, Table2,  Link2, Heading1, Heading2, 
  Heading3, Undo2, Redo2, Palette, X, ChevronDown, Type, Maximize2, CheckSquare,
} from 'lucide-react'

import { EmbedExtension } from '@/../extensions/EmbedExtension'  // 👈 add this


import { uploadImage } from '@/lib/utils/supabase-uploads' // <-- Yeh import add karo

const lowlight = createLowlight(common)

export default function UltimateTipTapEditor({
  content = '',
  onChange,
}: {
  content?: string
  onChange?: (html: string) => void
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [uploading, setUploading] = useState(false) // loading state for image upload

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TaskList,
      TaskItem,
      TextStyle,
      FontFamily,
      Color,
      Youtube,// 👈 yeh line add karo   error fix ka lia 
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline hover:text-blue-800 transition' },
      }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg mx-auto shadow-sm' } }),
      Table.configure({ resizable: true, HTMLAttributes: { class: 'border-collapse w-full' } }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: { class: 'border-l-4 border-green-500 pl-4 italic text-gray-700' },
      }),
      HorizontalRule.configure({ HTMLAttributes: { class: 'my-6 border-gray-300' } }),
      Placeholder.configure({ placeholder: 'Start writing your story... Use / for commands' }),
      CharacterCount.configure({ limit: 20000 }),
      Focus,
      Typography,
      EmbedExtension, // 👈 yeh line add karo
      Youtube.configure({
        width: 100,
        height: 400,
        HTMLAttributes: { class: 'rounded-lg shadow-md w-full aspect-video' },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none p-4 min-h-[500px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      const chars = text.length
      setWordCount(words)
      setCharCount(chars)
      if (onChange) onChange(html)
    },
  })

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isFullscreen])

  // ✅ Updated: Supabase image upload instead of base64
  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      setUploading(true)
      try {
        const url = await uploadImage(file, 'setups', 'content') // bucket: 'setups', folder: 'content'
        editor?.chain().focus().setImage({ src: url }).run()
      } catch (error) {
        console.error('Image upload failed:', error)
        alert('Image upload failed. Please try again.')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  if (!editor) {
    return <div className="p-8 text-center text-gray-500">Loading editor...</div>
  }

  return (
    <div
      className={`border border-gray-200 rounded-xl overflow-hidden text-gray-800 bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''
        }`}
    >
      {/* Toolbar */}
      {/* Toolbar */}
<div className="sticky top-0 z-10 bg-white text-gray-700 border-b border-gray-200 p-1.5 flex flex-nowrap items-center gap-0.5 shadow-sm overflow-x-auto">
  {/* History */}
  <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 hover:bg-gray-100 rounded-md" title="Undo">
    <Undo2 size={16} />
  </button>
  <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 hover:bg-gray-100 rounded-md" title="Redo">
    <Redo2 size={16} />
  </button>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Headings dropdown */}
  <select
    onChange={(e) => {
      const val = e.target.value;
      if (val === 'p') editor.chain().focus().setParagraph().run();
      else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
    }}
    value={
      editor.isActive('heading', { level: 1 }) ? '1' :
      editor.isActive('heading', { level: 2 }) ? '2' :
      editor.isActive('heading', { level: 3 }) ? '3' : 'p'
    }
    className="text-sm bg-transparent border border-gray-200 rounded px-2 py-1 focus:outline-none cursor-pointer hover:bg-gray-50"
    title="Heading style"
  >
    <option value="p">¶ Paragraph</option>
    <option value="1">H1</option>
    <option value="2">H2</option>
    <option value="3">H3</option>
  </select>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Formatting */}
  <div className="flex gap-0.5 items-center">
    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`} title="Bold (Ctrl+B)">
      <Bold size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`} title="Italic (Ctrl+I)">
      <Italic size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`} title="Underline (Ctrl+U)">
      <Underline size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`} title="Strikethrough">
      <Strikethrough size={16} />
    </button>
  </div>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Alignment */}
  <div className="flex gap-0.5">
    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'text-gray-600'}`} title="Align left">
      <AlignLeft size={16} />
    </button>
    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'text-gray-600'}`} title="Align center">
      <AlignCenter size={16} />
    </button>
    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'text-gray-600'}`} title="Align right">
      <AlignRight size={16} />
    </button>
    <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : 'text-gray-600'}`} title="Justify">
      <AlignJustify size={16} />
    </button>
  </div>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Lists */}
  <div className="flex gap-0.5">
    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : 'text-gray-600'}`} title="Bullet list">
      <List size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : 'text-gray-600'}`} title="Ordered list">
      <ListOrdered size={16} />
    </button>
  </div>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Insert media / blocks */}
  <div className="flex gap-0.5">
    <button onClick={handleImageUpload} disabled={uploading} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-600" title="Upload image">
      {uploading ? <span className="text-xs">⏳</span> : <ImageIcon size={16} />}
    </button>
    <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Insert table">
      <Table2 size={16} />
    </button>
    <button onClick={() => {
      const url = window.prompt('Enter YouTube URL:');
      if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="YouTube video">
      <Table2 size={16} /> {/* Youtube icon from lucide */}
    </button>
    <button onClick={() => {
      const url = window.prompt('Paste Embed URL (Twitter, Instagram, etc.)');
      if (!url) return;
      let provider: 'other' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'tiktok' | 'spotify' = 'other';
      try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) provider = 'twitter';
        else if (hostname.includes('instagram.com')) provider = 'instagram';
        else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) provider = 'youtube';
        else if (hostname.includes('reddit.com')) provider = 'reddit';
        else if (hostname.includes('tiktok.com')) provider = 'tiktok';
        else if (hostname.includes('open.spotify.com')) provider = 'spotify';
      } catch {}
      editor.chain().focus().setEmbed({ url, provider }).run();
    }} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Embed social post">
      <Code2 size={16} /> {/* temporary embed icon, you can use Puzzle icon */}
    </button>
    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : 'text-gray-600'}`} title="Blockquote">
      <Quote size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'text-gray-600'}`} title="Code block">
      <Code2 size={16} />
    </button>
    <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Horizontal rule">
      <Minus size={16} />
    </button>
    <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('taskList') ? 'bg-gray-200' : 'text-gray-600'}`} title="Task list">
      <CheckSquare size={16} /> {/* You need to import CheckSquare from lucide */}
    </button>
  </div>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Color picker */}
  <div className="flex items-center gap-0.5">
    <label title="Text color" className="cursor-pointer relative p-1.5 rounded hover:bg-gray-100 text-gray-600">
      <Palette size={16} />
      <input
        type="color"
        value={editor.getAttributes('textStyle').color || '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />
    </label>
    <button onClick={() => editor.chain().focus().unsetColor().run()} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Clear color">
      <X size={16} />
    </button>
  </div>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Font family */}
  <select
    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
    className="text-sm bg-transparent border border-gray-200 rounded px-2 py-1 focus:outline-none cursor-pointer hover:bg-gray-50"
    title="Font family"
  >
    <option value="">Font</option>
    <option value="Arial, sans-serif">Arial</option>
    <option value="Georgia, serif">Georgia</option>
    <option value="Courier New, monospace">Courier</option>
  </select>
  <div className="w-px h-5 bg-gray-200 mx-1" />

  {/* Link */}
  <button onClick={() => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }} className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : 'text-gray-600'}`} title="Insert link">
    <Link2 size={16} />
  </button>

  {/* Fullscreen + word count (right side) */}
  <div className="ml-auto flex items-center gap-1">
    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Toggle fullscreen">
      <Maximize2 size={16} /> {/* import Maximize2 from lucide */}
    </button>
    <div className="text-xs text-gray-500 hidden sm:block ml-1">{wordCount} words</div>
  </div>
</div>

      {/* BUBBLE MENU */}
      {/* <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex gap-1 bg-white shadow-lg rounded-lg p-1.5 border border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs font-bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs underline"
          >
            U
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter URL:')
              if (url) editor.chain().focus().setLink({ href: url }).run()
            }}
            className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs"
          >
            🔗
          </button>
          <button onClick={handleImageUpload} className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-xs">
            🖼
          </button>
        </div>
      </BubbleMenu> */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
  <div className="flex gap-0.5 bg-white shadow-lg rounded-lg p-1.5 border border-gray-200">
    <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bold"><Bold size={14} /></button>
    <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Italic"><Italic size={14} /></button>
    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Underline"><Underline size={14} /></button>
    <button onClick={() => {
      const url = window.prompt('Enter URL:');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Link"><Link2 size={14} /></button>
    <button onClick={handleImageUpload} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Upload image"><ImageIcon size={14} /></button>
  </div>
</BubbleMenu>

      {/* SLASH COMMAND MENU */}
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bg-white text-gray-800 shadow-xl rounded-lg p-1 border border-gray-200 w-56 max-h-60 overflow-y-auto">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Heading 1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Heading 2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Heading 3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Numbered List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Quote
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Code Block
          </button>
          <button
            onClick={handleImageUpload}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Image
          </button>
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
          >
            Table
          </button>


          {/* Embed Code Button */}
          {/* <button
  onClick={() => {
    const code = window.prompt('Paste embed code (e.g., <iframe>...</iframe>):')
    if (code) {
      // Extract iframe src for height detection (optional)
      const srcMatch = code.match(/src=["']([^"']*)["']/)
      let wrapperClass = 'embed-responsive'
      if (srcMatch) {
        const src = srcMatch[1].toLowerCase()
        if (src.includes('instagram.com')) {
          wrapperClass += ' ratio-4-5'
        } else if (src.includes('spotify.com') && src.includes('/episode/')) {
          wrapperClass = 'embed-responsive' // 16:9 ok
        }
        // add more platform detection if needed
      }
      const wrapped = `<div class="${wrapperClass}">${code}</div>`
      editor?.chain().focus().insertContent(wrapped).run()
    }
  }}
  className="px-2 py-0.5 rounded hover:bg-gray-100"
  title="Insert Embed Code"
>
  ww📺
</button> */}

        </div>
      </FloatingMenu>

      {/* EDITOR CONTENT */}
      <div className={`bg-white text-gray-800 ${isFullscreen ? 'h-[calc(100vh-100px)] overflow-y-auto' : 'min-h-[500px]'}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}