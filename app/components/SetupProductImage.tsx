'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function SetupProductImage({ src, name }: { src: string | null; name: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (!src || failedSrc === src) {
    return <div className="flex h-full items-center justify-center text-sm text-[#6B6B6B]">No image available</div>
  }
  return (
    <Image src={src} alt={name} fill unoptimized
      sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 768px) 50vw, 280px"
      className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
      onError={() => setFailedSrc(src)} />
  )
}
