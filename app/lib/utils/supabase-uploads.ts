// // lib/utils/supabase-uploads.ts
// import { createClient } from '@/lib/supabase/client'

// export async function uploadImage(
//   file: File,
//   bucket = 'setups',
//   folder = 'content'
// ): Promise<string> {
//   const supabase = createClient()   // ✅ ANDAR — lazy

//   const fileExt = file.name.split('.').pop()
//   const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .upload(fileName, file, {
//       cacheControl: '3600',
//       upsert: false,
//     })

//   if (error) throw new Error(`Upload failed: ${error.message}`)

//   const {
//     data: { publicUrl },
//   } = supabase.storage.from(bucket).getPublicUrl(data.path)

//   return publicUrl
// }






import { createClient } from '@/lib/supabase/client'

const MAX_INPUT_FILE_SIZE = 25 * 1024 * 1024
const WEBP_QUALITY = 0.8

function getMaximumDimension(folder: string) {
  const normalizedFolder = folder.toLowerCase()

  if (normalizedFolder.includes('gallery')) {
    return 1920
  }

  if (normalizedFolder.includes('cover')) {
    return 1600
  }

  if (
    normalizedFolder.includes('logo') ||
    normalizedFolder.includes('avatar')
  ) {
    return 800
  }

  return 1600
}

function createSafeBaseName(fileName: string) {
  const nameWithoutExtension = fileName.replace(
    /\.[^/.]+$/,
    ''
  )

  const safeName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return safeName || 'image'
}

function createUniqueId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

function loadBrowserImage(
  objectUrl: string
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)

    image.onerror = () => {
      reject(
        new Error(
          'The selected image could not be processed.'
        )
      )
    }

    image.src = objectUrl
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

async function optimizeImage(
  file: File,
  maximumDimension: number
): Promise<File> {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return file
  }

  if (!file.type.startsWith('image/')) {
    throw new Error(
      'Please select a valid image file.'
    )
  }

  // SVG files are already scalable. GIF conversion would
  // remove animation, so both formats stay unchanged.
  if (
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadBrowserImage(objectUrl)

    const originalWidth =
      image.naturalWidth || image.width

    const originalHeight =
      image.naturalHeight || image.height

    if (!originalWidth || !originalHeight) {
      return file
    }

    const largestDimension = Math.max(
      originalWidth,
      originalHeight
    )

    const scale = Math.min(
      1,
      maximumDimension / largestDimension
    )

    const targetWidth = Math.max(
      1,
      Math.round(originalWidth * scale)
    )

    const targetHeight = Math.max(
      1,
      Math.round(originalHeight * scale)
    )

    const canvas =
      document.createElement('canvas')

    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d', {
      alpha: true,
    })

    if (!context) {
      return file
    }

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    context.drawImage(
      image,
      0,
      0,
      targetWidth,
      targetHeight
    )

    const optimizedBlob = await canvasToBlob(
      canvas,
      'image/webp',
      WEBP_QUALITY
    )

    if (!optimizedBlob) {
      return file
    }

    // Keep the original if WebP happens to be larger.
    if (
      optimizedBlob.size >= file.size &&
      largestDimension <= maximumDimension
    ) {
      return file
    }

    const baseName = createSafeBaseName(file.name)

    return new File(
      [optimizedBlob],
      `${baseName}.webp`,
      {
        type: 'image/webp',
        lastModified: Date.now(),
      }
    )
  } catch (error) {
    console.warn(
      'Image optimization failed; uploading original file.',
      error
    )

    return file
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function getFileExtension(file: File) {
  const extensionFromName = file.name
    .split('.')
    .pop()
    ?.toLowerCase()

  if (extensionFromName) {
    return extensionFromName.replace(
      /[^a-z0-9]/g,
      ''
    )
  }

  if (file.type === 'image/webp') {
    return 'webp'
  }

  if (file.type === 'image/png') {
    return 'png'
  }

  return 'jpg'
}

export async function uploadImage(
  file: File,
  bucket = 'setups',
  folder = 'content'
): Promise<string> {
  if (!(file instanceof File)) {
    throw new Error('No image file was selected.')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error(
      'Only image files can be uploaded.'
    )
  }

  if (file.size > MAX_INPUT_FILE_SIZE) {
    throw new Error(
      'Image is too large. Maximum allowed size is 25 MB.'
    )
  }

  const maximumDimension =
    getMaximumDimension(folder)

  const optimizedFile = await optimizeImage(
    file,
    maximumDimension
  )

  const supabase = createClient()
  const extension =
    getFileExtension(optimizedFile)

  const safeFolder = folder
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]/g, '-')

  const safeBaseName = createSafeBaseName(
    optimizedFile.name
  )

  const uniqueId = createUniqueId()

  const fileName =
    `${safeFolder}/${Date.now()}-${uniqueId}-` +
    `${safeBaseName}.${extension}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, optimizedFile, {
      cacheControl: '31536000',
      contentType:
        optimizedFile.type || file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(
      `Upload failed: ${error.message}`
    )
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}
