// 'use server'

// import ImageKit from 'imagekit'

// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
// })

// export async function uploadMedia(formData: FormData): Promise<string> {
//   const file = formData.get('file') as File
//   const userName = formData.get('userName') as string

//   if (!file) throw new Error('No file provided')
//   if (!userName) throw new Error('No user name provided')

//   // Create a safe folder name (e.g., "jane-smith")
//   const safeFolderName = userName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

//   const buffer = Buffer.from(await file.arrayBuffer())

//   const result = await imagekit.upload({
//     file: buffer,
//     fileName: file.name,
//     folder: `/submissions/${safeFolderName}`,
//     useUniqueFileName: true,
//   })

//   return result.url
// }






'use server'

import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function uploadMedia(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File
    const userName = formData.get('userName') as string
    const submissionId = formData.get('submissionId') as string

    if (!file) return { success: false, error: 'No file provided.' }
    if (!userName) return { success: false, error: 'No user name provided.' }
    if (!submissionId) return { success: false, error: 'No submission ID provided.' }

    const MAX_SIZE_MB = 5
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return { success: false, error: `File exceeds ${MAX_SIZE_MB} MB limit.` }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = userName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const folder = `/submissions/${safeName}-${submissionId}`  // unique per submission

    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: folder,
      useUniqueFileName: true,
    })

    return { success: true, url: result.url }
  } catch (err: any) {
    console.error('ImageKit upload error:', err)
    return { success: false, error: err.message || 'Upload failed' }
  }
}