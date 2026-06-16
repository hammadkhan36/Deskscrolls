// components/EmbedRenderer.tsx
'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element: Element) => void
      }
    }
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

export default function EmbedRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    processEmbeds(containerRef.current)
  }, [content])

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />
}

// function processEmbeds(container: HTMLElement) {
//   // YouTube
//   container.querySelectorAll<HTMLDivElement>('div[data-provider="youtube"]').forEach((div) => {
//     const url = div.dataset.url
//     if (!url) return
//     const videoId = getYouTubeId(url)
//     if (videoId) {
//       div.innerHTML = `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-lg w-full aspect-video"></iframe>`
//     }
//   })

//   // Twitter
//   container.querySelectorAll<HTMLDivElement>('div[data-provider="twitter"]').forEach((div) => {
//     const url = div.dataset.url
//     if (!url) return
//     div.innerHTML = `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`
//     if (window.twttr) window.twttr.widgets.load(div)
//     else {
//       const script = document.createElement('script')
//       script.src = 'https://platform.twitter.com/widgets.js'
//       script.onload = () => window.twttr?.widgets.load(div)
//       document.body.appendChild(script)
//     }
//   })

//   // Instagram
//   container.querySelectorAll<HTMLDivElement>('div[data-provider="instagram"]').forEach((div) => {
//     const url = div.dataset.url
//     if (!url) return
//     div.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${url}"></blockquote>`
    
//     if (window.instgrm) window.instgrm.Embeds.process()
//     else {
//       const script = document.createElement('script')
//       script.src = '//www.instagram.com/embed.js'
//       script.onload = () => window.instgrm?.Embeds.process()
//       document.body.appendChild(script)
//     }
//   })
// }


function processEmbeds(container: HTMLElement) {
  // YouTube
  container.querySelectorAll<HTMLDivElement>('div[data-provider="youtube"]').forEach((div) => {
    const url = div.dataset.url
    if (!url) return
    const videoId = getYouTubeId(url)
    if (videoId) {
      div.innerHTML = `
        <div style="display:flex; justify-content:center; width:100%;">
          <iframe
            width="100%"
            height="450"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allowfullscreen
            style="border-radius: 0.5rem; max-width: 100%;"
          ></iframe>
        </div>
      `
    }
  })

  // Twitter
  container.querySelectorAll<HTMLDivElement>('div[data-provider="twitter"]').forEach((div) => {
    const url = div.dataset.url
    if (!url) return
    div.innerHTML = `
      <div style="display:flex; justify-content:center; width:100%;">
        <blockquote class="twitter-tweet" style="margin:0 auto; max-width:100%;">
          <a href="${url}"></a>
        </blockquote>
      </div>
    `
    if (window.twttr) {
      window.twttr.widgets.load(div)
    } else {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.onload = () => window.twttr?.widgets.load(div)
      document.body.appendChild(script)
    }
  })

  // Instagram
  container.querySelectorAll<HTMLDivElement>('div[data-provider="instagram"]').forEach((div) => {
    const url = div.dataset.url
    if (!url) return
    div.innerHTML = `
      <div style="display:flex; justify-content:center; width:100%;">
        <blockquote
          class="instagram-media"
          data-instgrm-permalink="${url}"
          style="margin:0 auto; max-width:540px; width:100%;"
        ></blockquote>
      </div>
    `
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      const script = document.createElement('script')
      script.src = '//www.instagram.com/embed.js'
      script.onload = () => window.instgrm?.Embeds.process()
      document.body.appendChild(script)
    }
  })
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|watch\?v=|\/embed\/|\/v\/|\/u\/\w\/|watch\?.*&v=)([^#&?]{11})/)
  return match ? match[1] : null
}