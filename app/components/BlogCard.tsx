'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogCardProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  altText?: string
  priority?: boolean      // <-- naya prop
}

export default function BlogCard({
  title = 'Benten Woodring',
  subtitle = 'Lead UI Designer',
  imageUrl,
  altText = 'Workspace setup',
  priority = false,
}: BlogCardProps) {
  const [imgSrc, setImgSrc] = useState(
    imageUrl || 'https://via.placeholder.com/800x600/eeeeee/999999?text=No+Image'
  )
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      {/* Image wrapper with skeleton */}
      <div className="relative aspect-[4/3] w-full bg-gray-200 overflow-hidden">
        {/* Skeleton shimmer */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={altText}
          fill
          className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImgSrc('https://via.placeholder.com/800x600/eeeeee/999999?text=Image+Not+Found')
            setIsLoaded(true)
          }}
        />
      </div>

      <div className="p-4 pt-5">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
        <p className="mt-1 text-base text-gray-500 font-normal">{subtitle}</p>
      </div>
    </div>
  )
}