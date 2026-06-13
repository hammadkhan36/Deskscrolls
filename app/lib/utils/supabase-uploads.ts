// // lib/utils/supabase-uploads.ts
// import { createClient } from '@/lib/supabase/client'

// const supabase = createClient()

// export async function uploadImage(
//   file: File,
//   bucket: string = 'setups',
//   folder: string = 'covers'  // 'covers' or 'gallery' or 'content'
// ): Promise<string | null> {
//   const fileExt = file.name.split('.').pop()
//   const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .upload(fileName, file, {
//       cacheControl: '3600',
//       upsert: false,
//     })

//   if (error) {
//     console.error('Upload error:', error.message)
//     return null
//   }

//   // Get public URL
//   const { data: publicUrlData } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(data.path)

//   return publicUrlData.publicUrl
// }









// lib/utils/supabase-uploads.ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file - The file to upload
 * @param bucket - Storage bucket name (default: 'setups')
 * @param folder - Folder inside bucket (e.g., 'covers', 'gallery', 'content')
 */
export async function uploadImage(
  file: File,
  bucket = 'setups',
  folder = 'content'
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return publicUrl
}