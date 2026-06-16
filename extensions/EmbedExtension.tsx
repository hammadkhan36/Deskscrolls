// // extensions/EmbedExtension.tsx
// import { Node } from '@tiptap/core'

// export interface EmbedAttributes {
//   url: string
//   provider: 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'tiktok' | 'spotify' | 'other'
//   caption?: string
// }

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     embed: {
//       setEmbed: (attributes: EmbedAttributes) => ReturnType
//     }
//   }
// }

// export const EmbedExtension = Node.create({
//   name: 'embed',

//   group: 'block',
//   atom: true,

//   addAttributes() {
//     return {
//       url: { default: '' },
//       provider: { default: 'other' },
//       caption: { default: '' },
//     }
//   },

//   parseHTML() {
//     return [{ tag: 'div[data-embed]' }]
//   },

//   renderHTML({ HTMLAttributes }) {
//     const { url, provider, caption } = HTMLAttributes as EmbedAttributes
//     return [
//       'div',
//       {
//         'data-embed': 'true',
//         'data-provider': provider,
//         'data-url': url,
//         'data-caption': caption || '',
//         class: 'embed-placeholder bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 text-center',
//       },
//       ['span', { class: 'text-sm text-gray-500' }, `📌 ${provider} Embed`],
//       caption ? ['p', { class: 'text-xs mt-1' }, caption] : undefined,
//     ]
//   },

//   addCommands() {
//     return {
//       setEmbed:
//         (attributes: EmbedAttributes) =>
//         ({ commands }) => {
//           return commands.insertContent({
//             type: this.name,
//             attrs: attributes,
//           })
//         },
//     }
//   },
// })











// extensions/EmbedExtension.tsx
import { Node } from '@tiptap/core'

export interface EmbedAttributes {
  url: string
  provider: 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'tiktok' | 'spotify' | 'other'
  caption?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attributes: EmbedAttributes) => ReturnType
    }
  }
}

export const EmbedExtension = Node.create({
  name: 'embed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: '' },
      provider: { default: 'other' },
      caption: { default: '' },
    }
  },

//   parseHTML() {
//     return [{ tag: 'div[data-embed]' }]
//   },
  parseHTML() {
  return [
    {
      tag: 'div[data-embed]',
      getAttrs: (dom) => {
        // Type guard for HTMLElement
        if (!(dom instanceof HTMLElement)) return false
        return {
          url: dom.getAttribute('data-url') || '',
          provider: dom.getAttribute('data-provider') || 'other',
          caption: dom.getAttribute('data-caption') || '',
        }
      },
    },
  ]
},

  renderHTML({ HTMLAttributes }) {
    const { url, provider, caption } = HTMLAttributes as EmbedAttributes

    // Build children safely, avoiding undefined entries
    const children: any[] = [
      ['span', { class: 'text-sm text-gray-500' }, `📌 ${provider} Embed`],
    ]
    if (caption) {
      children.push(['p', { class: 'text-xs mt-1' }, caption])
    }

    return [
      'div',
      {
        'data-embed': 'true',
        'data-provider': provider,
        'data-url': url,
        'data-caption': caption || '',
        // class: 'embed-placeholder bg-gray-100 border border-gray-300 rounded-lg  text-center'
      },
      ...children, // spread the safe array
    ]
  },

  addCommands() {
    return {
      setEmbed:
        (attributes: EmbedAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})