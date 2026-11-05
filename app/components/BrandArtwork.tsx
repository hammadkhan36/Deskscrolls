'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type BrandArtworkProps = {
  name: string
  imageUrl?: string | null
  variant: 'logo' | 'cover'
  className?: string
  sizes?: string
  preload?: boolean
}

const palettes = [
  ['#0F172A', '#334155'],
  ['#312E81', '#6366F1'],
  ['#164E63', '#0891B2'],
  ['#14532D', '#16A34A'],
  ['#7C2D12', '#EA580C'],
  ['#701A75', '#C026D3'],
]

function hashName(name: string) {
  return Array.from(name).reduce(
    (hash, character) =>
      (hash * 31 + character.charCodeAt(0)) >>> 0,
    0
  )
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

  return initials || 'DS'
}

export default function BrandArtwork({
  name,
  imageUrl,
  variant,
  className = '',
  sizes,
  preload = false,
}: BrandArtworkProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  const [startColor, endColor] = useMemo(
    () => palettes[hashName(name) % palettes.length],
    [name]
  )

  const initials = useMemo(
    () => getInitials(name),
    [name]
  )

  const showImage =
    Boolean(imageUrl) && !imageFailed

  const canOptimizeImage = useMemo(() => {
    if (!imageUrl) return false
    if (imageUrl.startsWith('/')) return true

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!supabaseUrl) return false

    try {
      return (
        new URL(imageUrl).hostname ===
        new URL(supabaseUrl).hostname
      )
    } catch {
      return false
    }
  }, [imageUrl])

  if (variant === 'logo') {
    return (
      <div
        className={`relative isolate flex items-center justify-center overflow-hidden bg-white ${className}`}
        aria-label={
          showImage
            ? undefined
            : `${name} logo placeholder`
        }
      >
        {showImage && canOptimizeImage ? (
          <Image
            src={imageUrl as string}
            alt={`${name} logo`}
            fill
            sizes={sizes || '96px'}
            className="object-contain p-[12%]"
            onError={() => setImageFailed(true)}
          />
        ) : showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl as string}
            alt={`${name} logo`}
            className="h-full w-full object-contain p-[12%]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center font-bold tracking-tight text-white"
            style={{
              background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
              fontSize: 'clamp(1rem, 35%, 2rem)',
            }}
          >
            {initials}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
      }}
    >
      {showImage && canOptimizeImage ? (
        <Image
          src={imageUrl as string}
          alt={`${name} cover`}
          fill
          sizes={
            sizes ||
            '(max-width: 768px) 100vw, 33vw'
          }
          quality={75}
          preload={preload}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl as string}
          alt={`${name} cover`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <>
          <div className="absolute -right-[8%] -top-[35%] h-[150%] w-[45%] rotate-12 rounded-full bg-white/10" />

          <div className="absolute -bottom-[70%] left-[8%] h-[130%] w-[45%] rounded-full bg-white/10" />

          <div className="relative flex h-full w-full items-center gap-3 p-[8%] text-white">
            <span className="flex aspect-square h-[55%] max-h-20 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-xl font-bold shadow-sm backdrop-blur-sm sm:text-2xl">
              {initials}
            </span>

            <span className="line-clamp-2 text-lg font-semibold tracking-tight sm:text-xl">
              {name}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
