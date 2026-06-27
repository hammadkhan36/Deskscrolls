
// // // // // // // // // 'use client'

// // // // // // // // // import { use, useState } from 'react'
// // // // // // // // // import { createClient } from '@/lib/supabase/client'
// // // // // // // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // // // // // // type SocialProfile = {
// // // // // // // // //   platform: string
// // // // // // // // //   handle: string
// // // // // // // // // }

// // // // // // // // // const platformOptions = [
// // // // // // // // //   'GitHub',
// // // // // // // // //   'Twitter',
// // // // // // // // //   'Instagram',
// // // // // // // // //   'Behance',
// // // // // // // // //   'Dribbble',
// // // // // // // // //   'LinkedIn',
// // // // // // // // //   'YouTube',
// // // // // // // // //   'Personal Website',
// // // // // // // // //   'Other',
// // // // // // // // // ]

// // // // // // // // // export default function SubmitForm() {
// // // // // // // // //   const supabase = createClient()
// // // // // // // // //   const [formData, setFormData] = useState({
// // // // // // // // //     email: '',
// // // // // // // // //     name: '',
// // // // // // // // //     photoLink: '',      // optional external link
// // // // // // // // //     description: '',
// // // // // // // // //     equipment: '',
// // // // // // // // //     consent: false,
// // // // // // // // //     newsletter: false,
// // // // // // // // //   })
// // // // // // // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // // // // // // //     { platform: '', handle: '' },
// // // // // // // // //   ])
// // // // // // // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // // // // // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([]) // local previews
// // // // // // // // //   const [uploadedUrls, setUploadedUrls] = useState<string[]>([])   // after submit success, not used

// // // // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // // // // // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // // // // // // //   // Handle simple inputs
// // // // // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// // // // // // // // //     const { id, value, type } = e.target
// // // // // // // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // // // // // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // // // // // // //   }

// // // // // // // // //   // Social profiles handlers
// // // // // // // // //   const handleSocialChange = (index: number, field: 'platform' | 'handle', value: string) => {
// // // // // // // // //     const updated = [...socialProfiles]
// // // // // // // // //     updated[index][field] = value
// // // // // // // // //     setSocialProfiles(updated)
// // // // // // // // //   }

// // // // // // // // //   const addSocialRow = () => {
// // // // // // // // //     setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // // // // // // //   }

// // // // // // // // //   const removeSocialRow = (index: number) => {
// // // // // // // // //     if (socialProfiles.length === 1) return // keep at least one
// // // // // // // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // // // // // // //   }

// // // // // // // // //   // Image upload handlers
// // // // // // // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // //     const files = Array.from(e.target.files || [])
// // // // // // // // //     if (files.length === 0) return

// // // // // // // // //     // Limit to 5 images total
// // // // // // // // //     const total = imageFiles.length + files.length
// // // // // // // // //     if (total > 5) {
// // // // // // // // //       alert('You can upload a maximum of 5 images.')
// // // // // // // // //       return
// // // // // // // // //     }

// // // // // // // // //     const newPreviews = files.map((file) => URL.createObjectURL(file))
// // // // // // // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // // // // // // //     setImageFiles((prev) => [...prev, ...files])
// // // // // // // // //   }

// // // // // // // // //   const removeImage = (index: number) => {
// // // // // // // // //     const updatedFiles = [...imageFiles]
// // // // // // // // //     updatedFiles.splice(index, 1)
// // // // // // // // //     setImageFiles(updatedFiles)

// // // // // // // // //     const updatedPreviews = [...imagePreviews]
// // // // // // // // //     URL.revokeObjectURL(updatedPreviews[index]) // clean up memory
// // // // // // // // //     updatedPreviews.splice(index, 1)
// // // // // // // // //     setImagePreviews(updatedPreviews)
// // // // // // // // //   }

// // // // // // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // // // // // //     e.preventDefault()
// // // // // // // // //     if (!formData.consent) {
// // // // // // // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // // // // // // //       return
// // // // // // // // //     }
// // // // // // // // //     if (!formData.email || !formData.name) {
// // // // // // // // //       setMessage({ type: 'error', text: 'Email and name are required.' })
// // // // // // // // //       return
// // // // // // // // //     }

// // // // // // // // //     setIsSubmitting(true)
// // // // // // // // //     setMessage(null)

// // // // // // // // //     try {
// // // // // // // // //       // 1. Upload images (if any) and collect URLs
// // // // // // // // //       let uploadedImageUrls: string[] = []
// // // // // // // // //       if (imageFiles.length > 0) {
// // // // // // // // //         const uploadPromises = imageFiles.map((file) =>
// // // // // // // // //           uploadImage(file, 'submissions', 'user-uploads')
// // // // // // // // //         )
// // // // // // // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // // // // // // //       }

// // // // // // // // //       // 2. Build social_profiles JSON (filter out empty handles)
// // // // // // // // //       const validSocialProfiles = socialProfiles.filter(
// // // // // // // // //         (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // // // // // // // //       )

// // // // // // // // //       // 3. Insert into submissions table
// // // // // // // // //       const { error } = await supabase.from('submissions').insert({
// // // // // // // // //         email: formData.email,
// // // // // // // // //         name: formData.name,
// // // // // // // // //         photo_link: formData.photoLink || null,
// // // // // // // // //         image_urls: uploadedImageUrls, // jsonb
// // // // // // // // //         social_profiles: validSocialProfiles, // jsonb
// // // // // // // // //         description: formData.description || null,
// // // // // // // // //         equipment: formData.equipment || null,
// // // // // // // // //         consent: formData.consent,
// // // // // // // // //         newsletter: formData.newsletter,
// // // // // // // // //         status: 'pending',
// // // // // // // // //       })

// // // // // // // // //       if (error) throw error

// // // // // // // // //       // Success
// // // // // // // // //       setMessage({ type: 'success', text: 'Submitted successfully! We will review your workspace. 🎉' })

// // // // // // // // //       // Reset form
// // // // // // // // //       setFormData({
// // // // // // // // //         email: '',
// // // // // // // // //         name: '',
// // // // // // // // //         photoLink: '',
// // // // // // // // //         description: '',
// // // // // // // // //         equipment: '',
// // // // // // // // //         consent: false,
// // // // // // // // //         newsletter: false,
// // // // // // // // //       })
// // // // // // // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // // // // // // //       setImageFiles([])
// // // // // // // // //       setImagePreviews([])
// // // // // // // // //       setUploadedUrls([])
// // // // // // // // //     } catch (err: any) {
// // // // // // // // //       console.error(err)
// // // // // // // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // // // // // // //     } finally {
// // // // // // // // //       setIsSubmitting(false)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <section className="bg-white px-4 py-16 md:py-24">
// // // // // // // // //       <div className="max-w-3xl mx-auto">
// // // // // // // // //         <div className="text-center mb-10">
// // // // // // // // //           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
// // // // // // // // //             Show us your workspace for a chance to be featured ✨
// // // // // // // // //           </h1>
// // // // // // // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-xl mx-auto">
// // // // // // // // //             Fill out the form below. You can upload photos directly or link to an external album.
// // // // // // // // //           </p>
// // // // // // // // //         </div>

// // // // // // // // //         <div className="border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm bg-white">
// // // // // // // // //           <form onSubmit={handleSubmit} className="space-y-6">
// // // // // // // // //             {/* Email */}
// // // // // // // // //             <div>
// // // // // // // // //               <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 Email address *
// // // // // // // // //               </label>
// // // // // // // // //               <input id="email" type="email" required value={formData.email} onChange={handleInputChange}
// // // // // // // // //                 placeholder="you@example.com" className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm ..." />
// // // // // // // // //             </div>

// // // // // // // // //             {/* Name */}
// // // // // // // // //             <div>
// // // // // // // // //               <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 Your name *
// // // // // // // // //               </label>
// // // // // // // // //               <input id="name" type="text" required value={formData.name} onChange={handleInputChange}
// // // // // // // // //                 placeholder="John Doe" className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm ..." />
// // // // // // // // //             </div>

// // // // // // // // //             {/* Social Profiles (Dynamic) */}
// // // // // // // // //             <div>
// // // // // // // // //               <label className="block text-sm font-semibold text-gray-800 mb-2">
// // // // // // // // //                 Social profiles (where can we find you?)
// // // // // // // // //               </label>
// // // // // // // // //               {socialProfiles.map((profile, index) => (
// // // // // // // // //                 <div key={index} className="flex gap-2 text-gray-800 mb-2 items-start">
// // // // // // // // //                   <select
// // // // // // // // //                     value={profile.platform}
// // // // // // // // //                     onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// // // // // // // // //                     className="w-1/3 rounded-md bg-gray-50 border border-gray-200 px-2 py-3 text-sm"
// // // // // // // // //                   >
// // // // // // // // //                     <option value="">Select</option>
// // // // // // // // //                     {platformOptions.map((opt) => (
// // // // // // // // //                       <option key={opt} value={opt}>{opt}</option>
// // // // // // // // //                     ))}
// // // // // // // // //                   </select>
// // // // // // // // //                   <input
// // // // // // // // //                     type="text"
// // // // // // // // //                     placeholder="Handle or URL"
// // // // // // // // //                     value={profile.handle}
// // // // // // // // //                     onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// // // // // // // // //                     className="flex-1 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm"
// // // // // // // // //                   />
// // // // // // // // //                   <button type="button" onClick={() => removeSocialRow(index)} disabled={socialProfiles.length === 1}
// // // // // // // // //                     className="text-red-500 hover:text-red-700 text-sm px-2 py-3 disabled:opacity-30">
// // // // // // // // //                     ✕
// // // // // // // // //                   </button>
// // // // // // // // //                 </div>
// // // // // // // // //               ))}
// // // // // // // // //               <button type="button" onClick={addSocialRow}
// // // // // // // // //                 className="text-green-600 hover:text-green-700 text-sm mt-1 flex items-center gap-1">
// // // // // // // // //                 + Add another profile
// // // // // // // // //               </button>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Photo Link (optional external URL) */}
// // // // // // // // //             <div>
// // // // // // // // //               <label htmlFor="photoLink" className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 External link to photos/video (optional)
// // // // // // // // //               </label>
// // // // // // // // //               <input id="photoLink"  type="url" value={formData.photoLink} onChange={handleInputChange}
// // // // // // // // //                 placeholder="Google Drive, Dropbox, etc." className="w-full p-2 rounded-md bg-gray-50 border ..." />
// // // // // // // // //             </div>

// // // // // // // // //             {/* Image Upload (Direct) */}
// // // // // // // // //             <div>
// // // // // // // // //               <label className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 Or upload images (max 5)
// // // // // // // // //               </label>
// // // // // // // // //               <input
// // // // // // // // //                 type="file"
// // // // // // // // //                 multiple
// // // // // // // // //                 accept="image/*"
// // // // // // // // //                 onChange={handleImageSelect}
// // // // // // // // //                 className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
// // // // // // // // //               />
// // // // // // // // //               {/* Previews */}
// // // // // // // // //               {imagePreviews.length > 0 && (
// // // // // // // // //                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
// // // // // // // // //                   {imagePreviews.map((preview, idx) => (
// // // // // // // // //                     <div key={idx} className="relative group">
// // // // // // // // //                       <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover rounded-md border" />
// // // // // // // // //                       <button type="button" onClick={() => removeImage(idx)}
// // // // // // // // //                         className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-gray-100">
// // // // // // // // //                         ✕
// // // // // // // // //                       </button>
// // // // // // // // //                     </div>
// // // // // // // // //                   ))}
// // // // // // // // //                 </div>
// // // // // // // // //               )}
// // // // // // // // //             </div>

// // // // // // // // //             {/* Description */}
// // // // // // // // //             <div>
// // // // // // // // //               <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 Short description of your workspace
// // // // // // // // //               </label>
// // // // // // // // //               <textarea id="description" rows={3} value={formData.description} onChange={handleInputChange}
// // // // // // // // //                 placeholder="Minimal home office for remote work..." className="w-full p-2 rounded-md bg-gray-50 text-gray-800 ..." />
// // // // // // // // //             </div>

// // // // // // // // //             {/* Equipment */}
// // // // // // // // //             <div>
// // // // // // // // //               <label htmlFor="equipment" className="block text-sm font-semibold text-gray-800 mb-1.5">
// // // // // // // // //                 Key equipment (optional)
// // // // // // // // //               </label>
// // // // // // // // //               <textarea id="equipment" rows={3} value={formData.equipment} onChange={handleInputChange}
// // // // // // // // //                 placeholder="Monitor: Dell U2723QE, Keyboard: Keychron K8..." className="w-full rounded-md bg-gray-50 text-gray-800 p-2 ..." />
// // // // // // // // //             </div>

// // // // // // // // //             {/* Consent */}
// // // // // // // // //             <div className="space-y-3 pt-2">
// // // // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // // // //                 <input type="checkbox" id="consent" checked={formData.consent} onChange={handleInputChange}
// // // // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
// // // // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // // // //                   I agree that DeskScrolls may feature my workspace and I own the rights to the photos. *
// // // // // // // // //                 </span>
// // // // // // // // //               </label>
// // // // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // // // //                 <input type="checkbox" id="newsletter" checked={formData.newsletter} onChange={handleInputChange}
// // // // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
// // // // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // // // //                   Sign me up for the DeskScrolls newsletter.
// // // // // // // // //                 </span>
// // // // // // // // //               </label>
// // // // // // // // //             </div>

// // // // // // // // //             <button type="submit" disabled={isSubmitting || !formData.consent}
// // // // // // // // //               className="w-full bg-black text-white font-semibold py-3.5 rounded-md hover:bg-gray-800 ...">
// // // // // // // // //               {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // // // // // // //             </button>

// // // // // // // // //             {message && (
// // // // // // // // //               <div className={`mt-4 text-sm font-medium p-3 rounded-md border ${
// // // // // // // // //                 message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
// // // // // // // // //               }`}>
// // // // // // // // //                 {message.text}
// // // // // // // // //               </div>
// // // // // // // // //             )}
// // // // // // // // //           </form>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </section>
// // // // // // // // //   )
// // // // // // // // // }





// // // // // // // // // // complete name
// // // // // // // // // // Short intro 
// // // // // // // // // // What Do You Do?
// // // // // // // // // // Location (City, Country — optional but community feel)

// // // // // // // // // // social handles all dropdown
// // // // // // // // // // Portfolio/Website Link

// // // // // // // // // // images and videos of your desk setups 

// // // // // // // // // // Story behind your desk setup 

// // // // // // // // // // details about your desk setup

// // // // // // // // // // setup budget and space size 

// // // // // // // // // // Setup Specs??
// // // // // // // // // // Accessories & Details
// // // // // // // // // // What items and gear are in your workspace?





// // // // // // // // // // What is the most recent item that you’ve added to your workspace?

// // // // // // // // // // What is one change you’d like to make to your current workspace?

// // // // // // // // // // your favorite item on this desk setup 


// // // // // // // // // // What does your typical day look like?
// // // // // // // // // // Walk us through your morning routine — what’s the first thing you do at your desk?

// // // // // // // // // // What’s one productivity trick that actually works for you?
// // // // // // // // // // any advice or tips??

// // // // // // // // // // How do you spark creativity?


// // // // // // // // // // How have you conquered cable management?

// // // // // // // // // // and what you have done for comfort and ergonomics??


// // // // // // // // // // Where did you set up your home office and why?



// // // // // // // // // // How you keep the work-life balance?



// // // // // // // // // // softwares / tools you use
// // // // // // // // // // What software do you find yourself using on a daily basis?



// // // // // // // // // //  gears names and Affiliate of Gears







// // // // // // // // // // Consents 
// // // // // // // // // //  I agree to be featured on [Brand Name] and its social media.

// // // // // // // // // // ✅ I confirm the photos are mine or I have permission.

// // // // // // // // // // ✅ (Separate checkbox) Send me updates, featured setups, and community news (email list join)





























// // // // // // // // 'use client'

// // // // // // // // import { useState } from 'react'
// // // // // // // // import { createClient } from '@/lib/supabase/client'
// // // // // // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // /*  Types & Constants                                                 */
// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // type SocialProfile = {
// // // // // // // //   platform: string
// // // // // // // //   handle: string
// // // // // // // // }

// // // // // // // // const PLATFORM_OPTIONS = [
// // // // // // // //   'GitHub',
// // // // // // // //   'Twitter / X',
// // // // // // // //   'Instagram',
// // // // // // // //   'LinkedIn',
// // // // // // // //   'YouTube',
// // // // // // // //   'Behance',
// // // // // // // //   'Dribbble',
// // // // // // // //   'Personal Website',
// // // // // // // //   'Other',
// // // // // // // // ]

// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // /*  Expandable Section IDs                                            */
// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // type SectionKey =
// // // // // // // //   | 'story'
// // // // // // // //   | 'specs'
// // // // // // // //   | 'routine'
// // // // // // // //   | 'ergonomics'
// // // // // // // //   | 'software'

// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // /*  Component                                                         */
// // // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // // export default function SubmitForm() {
// // // // // // // //   const supabase = createClient()

// // // // // // // //   /* --- Form state -------------------------------------------------- */
// // // // // // // //   const [formData, setFormData] = useState({
// // // // // // // //     email: '',
// // // // // // // //     name: '',
// // // // // // // //     intro: '',                 // short intro / tagline
// // // // // // // //     occupation: '',            // what do you do?
// // // // // // // //     city: '',
// // // // // // // //     country: '',
// // // // // // // //     portfolioUrl: '',
// // // // // // // //     description: '',           // story behind the desk setup
// // // // // // // //     budget: '',
// // // // // // // //     spaceSize: '',
// // // // // // // //     specsAccessories: '',      // key items & gear
// // // // // // // //     recentAddition: '',
// // // // // // // //     desiredChange: '',
// // // // // // // //     favoriteItem: '',
// // // // // // // //     typicalDay: '',
// // // // // // // //     productivityTrick: '',
// // // // // // // //     creativitySpark: '',
// // // // // // // //     cableManagement: '',
// // // // // // // //     comfortErgonomics: '',
// // // // // // // //     homeOfficeWhy: '',
// // // // // // // //     workLifeBalance: '',
// // // // // // // //     softwareTools: '',
// // // // // // // //     gearAffiliates: '',        // gear names & affiliate links
// // // // // // // //     videoLink: '',             // optional video URL
// // // // // // // //     consent: false,
// // // // // // // //     newsletter: false,
// // // // // // // //   })

// // // // // // // //   /* --- Dynamic social profiles ------------------------------------ */
// // // // // // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // // // // // //     { platform: '', handle: '' },
// // // // // // // //   ])

// // // // // // // //   /* --- Image uploads ---------------------------------------------- */
// // // // // // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // // // // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // // // // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // // // // // //   /* --- Expandable sections --------------------------------------- */
// // // // // // // //   const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
// // // // // // // //     story: false,
// // // // // // // //     specs: false,
// // // // // // // //     routine: false,
// // // // // // // //     ergonomics: false,
// // // // // // // //     software: false,
// // // // // // // //   })

// // // // // // // //   const toggleSection = (key: SectionKey) => {
// // // // // // // //     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
// // // // // // // //   }

// // // // // // // //   /* ---------- Handlers -------------------------------------------- */
// // // // // // // //   const handleInputChange = (
// // // // // // // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // // // // // // //   ) => {
// // // // // // // //     const { id, value, type } = e.target
// // // // // // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // // // // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // // // // // //   }

// // // // // // // //   /* Social profiles */
// // // // // // // //   const handleSocialChange = (
// // // // // // // //     index: number,
// // // // // // // //     field: 'platform' | 'handle',
// // // // // // // //     value: string,
// // // // // // // //   ) => {
// // // // // // // //     const updated = [...socialProfiles]
// // // // // // // //     updated[index][field] = value
// // // // // // // //     setSocialProfiles(updated)
// // // // // // // //   }

// // // // // // // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // // // // // //   const removeSocialRow = (index: number) => {
// // // // // // // //     if (socialProfiles.length === 1) return
// // // // // // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // // // // // //   }

// // // // // // // //   /* Image upload */
// // // // // // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // //     const files = Array.from(e.target.files || [])
// // // // // // // //     if (!files.length) return
// // // // // // // //     const total = imageFiles.length + files.length
// // // // // // // //     if (total > 5) {
// // // // // // // //       alert('Maximum 5 images allowed.')
// // // // // // // //       return
// // // // // // // //     }
// // // // // // // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // // // // // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // // // // // //     setImageFiles((prev) => [...prev, ...files])
// // // // // // // //   }

// // // // // // // //   const removeImage = (index: number) => {
// // // // // // // //     const updatedFiles = [...imageFiles]
// // // // // // // //     updatedFiles.splice(index, 1)
// // // // // // // //     setImageFiles(updatedFiles)
// // // // // // // //     const updatedPreviews = [...imagePreviews]
// // // // // // // //     URL.revokeObjectURL(updatedPreviews[index])
// // // // // // // //     updatedPreviews.splice(index, 1)
// // // // // // // //     setImagePreviews(updatedPreviews)
// // // // // // // //   }

// // // // // // // //   /* ---------- Submit ---------------------------------------------- */
// // // // // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // // // // //     e.preventDefault()
// // // // // // // //     if (!formData.consent) {
// // // // // // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // // // // // //       return
// // // // // // // //     }
// // // // // // // //     if (!formData.email || !formData.name) {
// // // // // // // //       setMessage({ type: 'error', text: 'Email and name are required.' })
// // // // // // // //       return
// // // // // // // //     }

// // // // // // // //     setIsSubmitting(true)
// // // // // // // //     setMessage(null)

// // // // // // // //     try {
// // // // // // // //       // 1. Upload images
// // // // // // // //       let uploadedImageUrls: string[] = []
// // // // // // // //       if (imageFiles.length > 0) {
// // // // // // // //         const uploadPromises = imageFiles.map((file) =>
// // // // // // // //           uploadImage(file, 'submissions', 'user-uploads'),
// // // // // // // //         )
// // // // // // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // // // // // //       }

// // // // // // // //       // 2. Filter social profiles
// // // // // // // //       const validSocialProfiles = socialProfiles.filter(
// // // // // // // //         (s) => s.platform.trim() !== '' && s.handle.trim() !== '',
// // // // // // // //       )

// // // // // // // //       // 3. Insert into submissions table (adjust columns to match your actual schema)
// // // // // // // //       const { error } = await supabase.from('submissions').insert({
// // // // // // // //         email: formData.email,
// // // // // // // //         name: formData.name,
// // // // // // // //         intro: formData.intro || null,
// // // // // // // //         occupation: formData.occupation || null,
// // // // // // // //         city: formData.city || null,
// // // // // // // //         country: formData.country || null,
// // // // // // // //         portfolio_url: formData.portfolioUrl || null,
// // // // // // // //         social_profiles: validSocialProfiles,
// // // // // // // //         image_urls: uploadedImageUrls,
// // // // // // // //         video_link: formData.videoLink || null,
// // // // // // // //         description: formData.description || null,
// // // // // // // //         budget: formData.budget || null,
// // // // // // // //         space_size: formData.spaceSize || null,
// // // // // // // //         specs_accessories: formData.specsAccessories || null,
// // // // // // // //         recent_addition: formData.recentAddition || null,
// // // // // // // //         desired_change: formData.desiredChange || null,
// // // // // // // //         favorite_item: formData.favoriteItem || null,
// // // // // // // //         typical_day: formData.typicalDay || null,
// // // // // // // //         productivity_trick: formData.productivityTrick || null,
// // // // // // // //         creativity_spark: formData.creativitySpark || null,
// // // // // // // //         cable_management: formData.cableManagement || null,
// // // // // // // //         comfort_ergonomics: formData.comfortErgonomics || null,
// // // // // // // //         home_office_why: formData.homeOfficeWhy || null,
// // // // // // // //         work_life_balance: formData.workLifeBalance || null,
// // // // // // // //         software_tools: formData.softwareTools || null,
// // // // // // // //         gear_affiliates: formData.gearAffiliates || null,
// // // // // // // //         consent: formData.consent,
// // // // // // // //         newsletter: formData.newsletter,
// // // // // // // //         status: 'pending',
// // // // // // // //       })

// // // // // // // //       if (error) throw error

// // // // // // // //       setMessage({
// // // // // // // //         type: 'success',
// // // // // // // //         text: 'Submitted! We’ll review your workspace. ✨',
// // // // // // // //       })

// // // // // // // //       // Reset form
// // // // // // // //       setFormData({
// // // // // // // //         email: '',
// // // // // // // //         name: '',
// // // // // // // //         intro: '',
// // // // // // // //         occupation: '',
// // // // // // // //         city: '',
// // // // // // // //         country: '',
// // // // // // // //         portfolioUrl: '',
// // // // // // // //         description: '',
// // // // // // // //         budget: '',
// // // // // // // //         spaceSize: '',
// // // // // // // //         specsAccessories: '',
// // // // // // // //         recentAddition: '',
// // // // // // // //         desiredChange: '',
// // // // // // // //         favoriteItem: '',
// // // // // // // //         typicalDay: '',
// // // // // // // //         productivityTrick: '',
// // // // // // // //         creativitySpark: '',
// // // // // // // //         cableManagement: '',
// // // // // // // //         comfortErgonomics: '',
// // // // // // // //         homeOfficeWhy: '',
// // // // // // // //         workLifeBalance: '',
// // // // // // // //         softwareTools: '',
// // // // // // // //         gearAffiliates: '',
// // // // // // // //         videoLink: '',
// // // // // // // //         consent: false,
// // // // // // // //         newsletter: false,
// // // // // // // //       })
// // // // // // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // // // // // //       setImageFiles([])
// // // // // // // //       setImagePreviews([])
// // // // // // // //       setOpenSections({
// // // // // // // //         story: false,
// // // // // // // //         specs: false,
// // // // // // // //         routine: false,
// // // // // // // //         ergonomics: false,
// // // // // // // //         software: false,
// // // // // // // //       })
// // // // // // // //     } catch (err: any) {
// // // // // // // //       console.error(err)
// // // // // // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // // // // // //     } finally {
// // // // // // // //       setIsSubmitting(false)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   /* ---------- Reusable UI helpers --------------------------------- */
// // // // // // // //   const inputClass =
// // // // // // // //     'w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition'
// // // // // // // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// // // // // // // //   const SectionToggle = ({
// // // // // // // //     title,
// // // // // // // //     section,
// // // // // // // //   }: {
// // // // // // // //     title: string
// // // // // // // //     section: SectionKey
// // // // // // // //   }) => (
// // // // // // // //     <button
// // // // // // // //       type="button"
// // // // // // // //       onClick={() => toggleSection(section)}
// // // // // // // //       className="w-full flex items-center justify-between py-3 px-1 border-b border-gray-200 text-left"
// // // // // // // //     >
// // // // // // // //       <span className="text-sm font-semibold text-gray-700">{title}</span>
// // // // // // // //       <span className="text-gray-400 text-lg">
// // // // // // // //         {openSections[section] ? '−' : '+'}
// // // // // // // //       </span>
// // // // // // // //     </button>
// // // // // // // //   )

// // // // // // // //   /* ---------- Render ---------------------------------------------- */
// // // // // // // //   return (
// // // // // // // //     <section className="bg-white px-4 py-16 md:py-24">
// // // // // // // //       <div className="max-w-4xl mx-auto">
// // // // // // // //         <div className="text-center mb-12">
// // // // // // // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // // // // // // //             Show us your desk setup ✨
// // // // // // // //           </h1>
// // // // // // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // // // // // // //             Fill out the form below for a chance to be featured on DeskScrolls. The more
// // // // // // // //             you share, the better — but only the essentials are required.
// // // // // // // //           </p>
// // // // // // // //         </div>

// // // // // // // //         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
// // // // // // // //           <form onSubmit={handleSubmit} className="space-y-8">
// // // // // // // //             {/* ============================================= */}
// // // // // // // //             {/* 1. ABOUT YOU (always visible)                 */}
// // // // // // // //             {/* ============================================= */}
// // // // // // // //             <div>
// // // // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5">1. About You</h2>
// // // // // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // // // // // // //                 {/* Email */}
// // // // // // // //                 <div>
// // // // // // // //                   <label htmlFor="email" className={labelClass}>
// // // // // // // //                     Email address *
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="email"
// // // // // // // //                     type="email"
// // // // // // // //                     required
// // // // // // // //                     value={formData.email}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="you@example.com"
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //                 {/* Full Name */}
// // // // // // // //                 <div>
// // // // // // // //                   <label htmlFor="name" className={labelClass}>
// // // // // // // //                     Full name *
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="name"
// // // // // // // //                     type="text"
// // // // // // // //                     required
// // // // // // // //                     value={formData.name}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="Jane Smith"
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //                 {/* Short Intro */}
// // // // // // // //                 <div className="md:col-span-2">
// // // // // // // //                   <label htmlFor="intro" className={labelClass}>
// // // // // // // //                     Short intro (one sentence about yourself)
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="intro"
// // // // // // // //                     type="text"
// // // // // // // //                     value={formData.intro}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="Designer & coffee addict"
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //                 {/* What do you do? */}
// // // // // // // //                 <div>
// // // // // // // //                   <label htmlFor="occupation" className={labelClass}>
// // // // // // // //                     What do you do? *
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="occupation"
// // // // // // // //                     type="text"
// // // // // // // //                     value={formData.occupation}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="Product Designer at Acme"
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //                 {/* Location */}
// // // // // // // //                 <div>
// // // // // // // //                   <label className={labelClass}>Location (optional)</label>
// // // // // // // //                   <div className="flex gap-2">
// // // // // // // //                     <input
// // // // // // // //                       id="city"
// // // // // // // //                       type="text"
// // // // // // // //                       value={formData.city}
// // // // // // // //                       onChange={handleInputChange}
// // // // // // // //                       placeholder="City"
// // // // // // // //                       className={`${inputClass} flex-1`}
// // // // // // // //                     />
// // // // // // // //                     <input
// // // // // // // //                       id="country"
// // // // // // // //                       type="text"
// // // // // // // //                       value={formData.country}
// // // // // // // //                       onChange={handleInputChange}
// // // // // // // //                       placeholder="Country"
// // // // // // // //                       className={`${inputClass} flex-1`}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //                 {/* Portfolio / Website */}
// // // // // // // //                 <div>
// // // // // // // //                   <label htmlFor="portfolioUrl" className={labelClass}>
// // // // // // // //                     Portfolio / Website link
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="portfolioUrl"
// // // // // // // //                     type="url"
// // // // // // // //                     value={formData.portfolioUrl}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="https://yourportfolio.com"
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //               </div>

// // // // // // // //               {/* Social profiles */}
// // // // // // // //               <div className="mt-5">
// // // // // // // //                 <label className={labelClass}>
// // // // // // // //                   Social handles (where can we find you?)
// // // // // // // //                 </label>
// // // // // // // //                 {socialProfiles.map((profile, index) => (
// // // // // // // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // // // // // // //                     <select
// // // // // // // //                       value={profile.platform}
// // // // // // // //                       onChange={(e) =>
// // // // // // // //                         handleSocialChange(index, 'platform', e.target.value)
// // // // // // // //                       }
// // // // // // // //                       className="w-1/3 rounded-md bg-gray-50 border border-gray-200 px-2 py-3 text-sm text-gray-900"
// // // // // // // //                     >
// // // // // // // //                       <option value="">Select</option>
// // // // // // // //                       {PLATFORM_OPTIONS.map((opt) => (
// // // // // // // //                         <option key={opt} value={opt}>
// // // // // // // //                           {opt}
// // // // // // // //                         </option>
// // // // // // // //                       ))}
// // // // // // // //                     </select>
// // // // // // // //                     <input
// // // // // // // //                       type="text"
// // // // // // // //                       placeholder="Handle or URL"
// // // // // // // //                       value={profile.handle}
// // // // // // // //                       onChange={(e) =>
// // // // // // // //                         handleSocialChange(index, 'handle', e.target.value)
// // // // // // // //                       }
// // // // // // // //                       className={`${inputClass} flex-1`}
// // // // // // // //                     />
// // // // // // // //                     <button
// // // // // // // //                       type="button"
// // // // // // // //                       onClick={() => removeSocialRow(index)}
// // // // // // // //                       disabled={socialProfiles.length === 1}
// // // // // // // //                       className="text-red-500 hover:text-red-700 text-sm px-2 py-3 disabled:opacity-30"
// // // // // // // //                     >
// // // // // // // //                       ✕
// // // // // // // //                     </button>
// // // // // // // //                   </div>
// // // // // // // //                 ))}
// // // // // // // //                 <button
// // // // // // // //                   type="button"
// // // // // // // //                   onClick={addSocialRow}
// // // // // // // //                   className="text-green-600 hover:text-green-700 text-sm mt-1 flex items-center gap-1"
// // // // // // // //                 >
// // // // // // // //                   + Add another profile
// // // // // // // //                 </button>
// // // // // // // //               </div>
// // // // // // // //             </div>

// // // // // // // //             {/* ============================================= */}
// // // // // // // //             {/* 2. YOUR WORKSPACE (always visible core)       */}
// // // // // // // //             {/* ============================================= */}
// // // // // // // //             <div>
// // // // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5">2. Your Workspace</h2>
// // // // // // // //               {/* Story behind the setup */}
// // // // // // // //               <div>
// // // // // // // //                 <label htmlFor="description" className={labelClass}>
// // // // // // // //                   Story behind your desk setup
// // // // // // // //                 </label>
// // // // // // // //                 <textarea
// // // // // // // //                   id="description"
// // // // // // // //                   rows={3}
// // // // // // // //                   value={formData.description}
// // // // // // // //                   onChange={handleInputChange}
// // // // // // // //                   placeholder="What inspired your current setup? Any theme or philosophy?"
// // // // // // // //                   className={inputClass}
// // // // // // // //                 />
// // // // // // // //               </div>

// // // // // // // //               {/* Images / Video */}
// // // // // // // //               <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
// // // // // // // //                 <div>
// // // // // // // //                   <label className={labelClass}>Upload images (max 5)</label>
// // // // // // // //                   <input
// // // // // // // //                     type="file"
// // // // // // // //                     multiple
// // // // // // // //                     accept="image/*"
// // // // // // // //                     onChange={handleImageSelect}
// // // // // // // //                     className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
// // // // // // // //                   />
// // // // // // // //                   {imagePreviews.length > 0 && (
// // // // // // // //                     <div className="grid grid-cols-3 gap-2 mt-3">
// // // // // // // //                       {imagePreviews.map((preview, idx) => (
// // // // // // // //                         <div key={idx} className="relative group">
// // // // // // // //                           <img
// // // // // // // //                             src={preview}
// // // // // // // //                             alt={`Preview ${idx + 1}`}
// // // // // // // //                             className="h-20 w-full object-cover rounded-md border"
// // // // // // // //                           />
// // // // // // // //                           <button
// // // // // // // //                             type="button"
// // // // // // // //                             onClick={() => removeImage(idx)}
// // // // // // // //                             className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-gray-100"
// // // // // // // //                           >
// // // // // // // //                             ✕
// // // // // // // //                           </button>
// // // // // // // //                         </div>
// // // // // // // //                       ))}
// // // // // // // //                     </div>
// // // // // // // //                   )}
// // // // // // // //                 </div>
// // // // // // // //                 {/* Video link */}
// // // // // // // //                 <div>
// // // // // // // //                   <label htmlFor="videoLink" className={labelClass}>
// // // // // // // //                     Video link (optional)
// // // // // // // //                   </label>
// // // // // // // //                   <input
// // // // // // // //                     id="videoLink"
// // // // // // // //                     type="url"
// // // // // // // //                     value={formData.videoLink}
// // // // // // // //                     onChange={handleInputChange}
// // // // // // // //                     placeholder="YouTube, Vimeo, etc."
// // // // // // // //                     className={inputClass}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //               </div>
// // // // // // // //             </div>

// // // // // // // //             {/* ============================================= */}
// // // // // // // //             {/* 3. EXPANDABLE DETAILS                          */}
// // // // // // // //             {/* ============================================= */}
// // // // // // // //             <div className="border-t border-gray-100 pt-6 space-y-1">
// // // // // // // //               {/* 3a. Setup story & details */}
// // // // // // // //               <SectionToggle title="Setup story & details (budget, space, favorite item...)" section="story" />
// // // // // // // //               {openSections.story && (
// // // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // // //                     <div>
// // // // // // // //                       <label htmlFor="budget" className={labelClass}>Approximate setup budget</label>
// // // // // // // //                       <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g. $2,500" className={inputClass} />
// // // // // // // //                     </div>
// // // // // // // //                     <div>
// // // // // // // //                       <label htmlFor="spaceSize" className={labelClass}>Space size (sq ft / m²)</label>
// // // // // // // //                       <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="e.g. 120 sq ft" className={inputClass} />
// // // // // // // //                     </div>
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="favoriteItem" className={labelClass}>Your favorite item on this desk</label>
// // // // // // // //                     <input id="favoriteItem" value={formData.favoriteItem} onChange={handleInputChange} placeholder="The standing desk, a custom keyboard..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="recentAddition" className={labelClass}>Most recent addition to your workspace</label>
// // // // // // // //                     <input id="recentAddition" value={formData.recentAddition} onChange={handleInputChange} placeholder="A new monitor light" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="desiredChange" className={labelClass}>One change you’d like to make</label>
// // // // // // // //                     <input id="desiredChange" value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )}

// // // // // // // //               {/* 3b. Specs & gear */}
// // // // // // // //               <SectionToggle title="Setup specs & gear list" section="specs" />
// // // // // // // //               {openSections.specs && (
// // // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="specsAccessories" className={labelClass}>Key items & accessories</label>
// // // // // // // //                     <textarea id="specsAccessories" rows={4} value={formData.specsAccessories} onChange={handleInputChange} placeholder="Monitor: Dell U2723QE, Keyboard: Keychron K8, Chair: Herman Miller Aeron..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )}

// // // // // // // //               {/* 3c. Routine & tips */}
// // // // // // // //               <SectionToggle title="Your routine & productivity tips" section="routine" />
// // // // // // // //               {openSections.routine && (
// // // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="typicalDay" className={labelClass}>What does a typical day look like?</label>
// // // // // // // //                     <textarea id="typicalDay" rows={2} value={formData.typicalDay} onChange={handleInputChange} placeholder="Morning coffee, deep work from 9-12..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="productivityTrick" className={labelClass}>One productivity trick that actually works</label>
// // // // // // // //                     <input id="productivityTrick" value={formData.productivityTrick} onChange={handleInputChange} placeholder="Time-blocking with a physical timer" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="creativitySpark" className={labelClass}>How do you spark creativity?</label>
// // // // // // // //                     <input id="creativitySpark" value={formData.creativitySpark} onChange={handleInputChange} placeholder="A walk without my phone" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )}

// // // // // // // //               {/* 3d. Ergonomics & comfort */}
// // // // // // // //               <SectionToggle title="Comfort, ergonomics & cable management" section="ergonomics" />
// // // // // // // //               {openSections.ergonomics && (
// // // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="cableManagement" className={labelClass}>How have you conquered cable management?</label>
// // // // // // // //                     <input id="cableManagement" value={formData.cableManagement} onChange={handleInputChange} placeholder="Under-desk trays, velcro straps..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="comfortErgonomics" className={labelClass}>What have you done for comfort and ergonomics?</label>
// // // // // // // //                     <input id="comfortErgonomics" value={formData.comfortErgonomics} onChange={handleInputChange} placeholder="Adjustable standing desk, ergonomic mouse" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="homeOfficeWhy" className={labelClass}>Where did you set up your home office and why?</label>
// // // // // // // //                     <input id="homeOfficeWhy" value={formData.homeOfficeWhy} onChange={handleInputChange} placeholder="Spare bedroom for natural light" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="workLifeBalance" className={labelClass}>How do you keep work-life balance?</label>
// // // // // // // //                     <input id="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} placeholder="Shutdown ritual at 6pm" className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )}

// // // // // // // //               {/* 3e. Software & affiliates */}
// // // // // // // //               <SectionToggle title="Software & gear affiliates" section="software" />
// // // // // // // //               {openSections.software && (
// // // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="softwareTools" className={labelClass}>Software / tools you use daily</label>
// // // // // // // //                     <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                   <div>
// // // // // // // //                     <label htmlFor="gearAffiliates" className={labelClass}>Gear names & affiliate links (if any)</label>
// // // // // // // //                     <textarea id="gearAffiliates" rows={3} value={formData.gearAffiliates} onChange={handleInputChange} placeholder="Monitor arm: https://amzn.to/..." className={inputClass} />
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )}
// // // // // // // //             </div>

// // // // // // // //             {/* ============================================= */}
// // // // // // // //             {/* 4. CONSENT & SUBMIT                            */}
// // // // // // // //             {/* ============================================= */}
// // // // // // // //             <div className="border-t border-gray-100 pt-6 space-y-3">
// // // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // // //                 <input
// // // // // // // //                   type="checkbox"
// // // // // // // //                   id="consent"
// // // // // // // //                   checked={formData.consent}
// // // // // // // //                   onChange={handleInputChange}
// // // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // // // //                 />
// // // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // // //                   I agree to be featured on DeskScrolls and its social media. I confirm
// // // // // // // //                   the photos are mine or I have permission. *
// // // // // // // //                 </span>
// // // // // // // //               </label>
// // // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // // //                 <input
// // // // // // // //                   type="checkbox"
// // // // // // // //                   id="newsletter"
// // // // // // // //                   checked={formData.newsletter}
// // // // // // // //                   onChange={handleInputChange}
// // // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // // // //                 />
// // // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // // //                   Send me updates, featured setups, and community news.
// // // // // // // //                 </span>
// // // // // // // //               </label>
// // // // // // // //             </div>

// // // // // // // //             <button
// // // // // // // //               type="submit"
// // // // // // // //               disabled={isSubmitting || !formData.consent}
// // // // // // // //               className="w-full bg-black text-white font-semibold py-3.5 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
// // // // // // // //             >
// // // // // // // //               {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // // // // // //             </button>

// // // // // // // //             {message && (
// // // // // // // //               <div
// // // // // // // //                 className={`mt-4 text-sm font-medium p-3 rounded-md border ${
// // // // // // // //                   message.type === 'success'
// // // // // // // //                     ? 'bg-green-50 border-green-200 text-green-700'
// // // // // // // //                     : 'bg-red-50 border-red-200 text-red-700'
// // // // // // // //                 }`}
// // // // // // // //               >
// // // // // // // //                 {message.text}
// // // // // // // //               </div>
// // // // // // // //             )}
// // // // // // // //           </form>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     </section>
// // // // // // // //   )
// // // // // // // // }













// // // // // // // 'use client'

// // // // // // // import { useState } from 'react'
// // // // // // // import { createClient } from '@/lib/supabase/client'
// // // // // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /*  Types & Constants                                                 */
// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // type SocialProfile = {
// // // // // // //   platform: string
// // // // // // //   handle: string
// // // // // // // }

// // // // // // // type GearItem = {
// // // // // // //   name: string
// // // // // // //   link: string
// // // // // // //   showLink: boolean
// // // // // // // }

// // // // // // // const PLATFORM_OPTIONS = [
// // // // // // //   'GitHub',
// // // // // // //   'Twitter / X',
// // // // // // //   'Instagram',
// // // // // // //   'LinkedIn',
// // // // // // //   'YouTube',
// // // // // // //   'Behance',
// // // // // // //   'Dribbble',
// // // // // // //   'Personal Website',
// // // // // // //   'Other',
// // // // // // // ]

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /*  Expandable section IDs                                            */
// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // type SectionKey = 'story' | 'routine' | 'ergonomics' | 'software'

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /*  Component                                                         */
// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // export default function SubmitForm() {
// // // // // // //   const supabase = createClient()

// // // // // // //   /* --- Form state -------------------------------------------------- */
// // // // // // //   const [formData, setFormData] = useState({
// // // // // // //     email: '',
// // // // // // //     name: '',
// // // // // // //     intro: '',                 // detailed intro (occupation included)
// // // // // // //     state: '',                 // state/region (optional)
// // // // // // //     country: '',               // country (required)
// // // // // // //     portfolioUrl: '',
// // // // // // //     description: '',           // story behind desk setup (required)
// // // // // // //     budget: '',
// // // // // // //     spaceSize: '',
// // // // // // //     recentAddition: '',
// // // // // // //     desiredChange: '',
// // // // // // //     favoriteItem: '',
// // // // // // //     typicalDay: '',
// // // // // // //     productivityTrick: '',
// // // // // // //     creativitySpark: '',
// // // // // // //     cableManagement: '',
// // // // // // //     comfortErgonomics: '',
// // // // // // //     homeOfficeWhy: '',
// // // // // // //     workLifeBalance: '',
// // // // // // //     softwareTools: '',
// // // // // // //     videoLink: '',             // optional video URL
// // // // // // //     consent: false,
// // // // // // //     newsletter: false,
// // // // // // //   })

// // // // // // //   /* --- Dynamic social profiles ------------------------------------ */
// // // // // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // // // // //     { platform: '', handle: '' },
// // // // // // //   ])

// // // // // // //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// // // // // // //   // Start with 7 empty rows so the user immediately sees the requirement
// // // // // // //   const [gearItems, setGearItems] = useState<GearItem[]>(
// // // // // // //     Array(7).fill({ name: '', link: '', showLink: false })
// // // // // // //   )

// // // // // // //   /* --- Image uploads ---------------------------------------------- */
// // // // // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // // // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // // // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // // // // //   /* --- Expandable sections --------------------------------------- */
// // // // // // //   const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
// // // // // // //     story: false,
// // // // // // //     routine: false,
// // // // // // //     ergonomics: false,
// // // // // // //     software: false,
// // // // // // //   })

// // // // // // //   const toggleSection = (key: SectionKey) => {
// // // // // // //     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
// // // // // // //   }

// // // // // // //   /* ---------- Handlers -------------------------------------------- */
// // // // // // //   const handleInputChange = (
// // // // // // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // // // // // //   ) => {
// // // // // // //     const { id, value, type } = e.target
// // // // // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // // // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // // // // //   }

// // // // // // //   /* Social profiles */
// // // // // // //   const handleSocialChange = (
// // // // // // //     index: number,
// // // // // // //     field: 'platform' | 'handle',
// // // // // // //     value: string,
// // // // // // //   ) => {
// // // // // // //     const updated = [...socialProfiles]
// // // // // // //     updated[index][field] = value
// // // // // // //     setSocialProfiles(updated)
// // // // // // //   }

// // // // // // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // // // // //   const removeSocialRow = (index: number) => {
// // // // // // //     if (socialProfiles.length === 1) return
// // // // // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // // // // //   }

// // // // // // //   /* Gear list */
// // // // // // //   const handleGearNameChange = (index: number, name: string) => {
// // // // // // //     const updated = [...gearItems]
// // // // // // //     updated[index] = { ...updated[index], name }
// // // // // // //     setGearItems(updated)
// // // // // // //   }

// // // // // // //   const handleGearLinkChange = (index: number, link: string) => {
// // // // // // //     const updated = [...gearItems]
// // // // // // //     updated[index] = { ...updated[index], link }
// // // // // // //     setGearItems(updated)
// // // // // // //   }

// // // // // // //   const toggleGearLinkInput = (index: number) => {
// // // // // // //     const updated = [...gearItems]
// // // // // // //     updated[index] = { ...updated[index], showLink: !updated[index].showLink }
// // // // // // //     setGearItems(updated)
// // // // // // //   }

// // // // // // //   const addGearRow = () => {
// // // // // // //     setGearItems([...gearItems, { name: '', link: '', showLink: false }])
// // // // // // //   }

// // // // // // //   const removeGearRow = (index: number) => {
// // // // // // //     if (gearItems.length <= 7) return // never go below 7
// // // // // // //     setGearItems(gearItems.filter((_, i) => i !== index))
// // // // // // //   }

// // // // // // //   /* Image upload */
// // // // // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // //     const files = Array.from(e.target.files || [])
// // // // // // //     if (!files.length) return
// // // // // // //     const total = imageFiles.length + files.length
// // // // // // //     if (total > 10) {
// // // // // // //       // soft cap – user can still upload more, but we warn
// // // // // // //       alert('You can upload a maximum of 10 images. Only the first 10 will be kept.')
// // // // // // //       return
// // // // // // //     }
// // // // // // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // // // // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // // // // //     setImageFiles((prev) => [...prev, ...files])
// // // // // // //   }

// // // // // // //   const removeImage = (index: number) => {
// // // // // // //     const updatedFiles = [...imageFiles]
// // // // // // //     updatedFiles.splice(index, 1)
// // // // // // //     setImageFiles(updatedFiles)
// // // // // // //     const updatedPreviews = [...imagePreviews]
// // // // // // //     URL.revokeObjectURL(updatedPreviews[index])
// // // // // // //     updatedPreviews.splice(index, 1)
// // // // // // //     setImagePreviews(updatedPreviews)
// // // // // // //   }

// // // // // // //   /* ---------- Submit ---------------------------------------------- */
// // // // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // // // //     e.preventDefault()

// // // // // // //     // --- Validation ---
// // // // // // //     if (!formData.email || !formData.name) {
// // // // // // //       setMessage({ type: 'error', text: 'Email and name are required.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     if (!formData.country) {
// // // // // // //       setMessage({ type: 'error', text: 'Country is required.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     // at least one valid social profile
// // // // // // //     const validSocialProfiles = socialProfiles.filter(
// // // // // // //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // // // // // //     )
// // // // // // //     if (validSocialProfiles.length === 0) {
// // // // // // //       setMessage({ type: 'error', text: 'At least one social handle is required.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     if (!formData.description.trim()) {
// // // // // // //       setMessage({ type: 'error', text: 'Please describe your desk setup.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     if (imageFiles.length < 5) {
// // // // // // //       setMessage({ type: 'error', text: 'Please upload at least 5 images of your workspace.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     // gear items: count items with non‑empty name
// // // // // // //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// // // // // // //     if (validGearItems.length < 7) {
// // // // // // //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// // // // // // //       return
// // // // // // //     }
// // // // // // //     if (!formData.consent) {
// // // // // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // // // // //       return
// // // // // // //     }

// // // // // // //     setIsSubmitting(true)
// // // // // // //     setMessage(null)

// // // // // // //     try {
// // // // // // //       // 1. Upload images
// // // // // // //       let uploadedImageUrls: string[] = []
// // // // // // //       if (imageFiles.length > 0) {
// // // // // // //         const uploadPromises = imageFiles.map((file) =>
// // // // // // //           uploadImage(file, 'submissions', 'user-uploads'),
// // // // // // //         )
// // // // // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // // // // //       }

// // // // // // //       // 2. Prepare gear data (only name + link, no showLink)
// // // // // // //       const gearData = validGearItems.map(({ name, link }) => ({
// // // // // // //         name,
// // // // // // //         link: link.trim() || null,
// // // // // // //       }))

// // // // // // //       // 3. Insert into submissions
// // // // // // //       const { error } = await supabase.from('submissions').insert({
// // // // // // //         email: formData.email,
// // // // // // //         name: formData.name,
// // // // // // //         intro: formData.intro || null,
// // // // // // //         state: formData.state || null,
// // // // // // //         country: formData.country,
// // // // // // //         portfolio_url: formData.portfolioUrl || null,
// // // // // // //         social_profiles: validSocialProfiles,
// // // // // // //         image_urls: uploadedImageUrls,
// // // // // // //         video_link: formData.videoLink || null,
// // // // // // //         description: formData.description, // required
// // // // // // //         budget: formData.budget || null,
// // // // // // //         space_size: formData.spaceSize || null,
// // // // // // //         recent_addition: formData.recentAddition || null,
// // // // // // //         desired_change: formData.desiredChange || null,
// // // // // // //         favorite_item: formData.favoriteItem || null,
// // // // // // //         typical_day: formData.typicalDay || null,
// // // // // // //         productivity_trick: formData.productivityTrick || null,
// // // // // // //         creativity_spark: formData.creativitySpark || null,
// // // // // // //         cable_management: formData.cableManagement || null,
// // // // // // //         comfort_ergonomics: formData.comfortErgonomics || null,
// // // // // // //         home_office_why: formData.homeOfficeWhy || null,
// // // // // // //         work_life_balance: formData.workLifeBalance || null,
// // // // // // //         software_tools: formData.softwareTools || null,
// // // // // // //         gear_list: gearData,               // jsonb array
// // // // // // //         consent: formData.consent,
// // // // // // //         newsletter: formData.newsletter,
// // // // // // //         status: 'pending',
// // // // // // //       })

// // // // // // //       if (error) throw error

// // // // // // //       setMessage({
// // // // // // //         type: 'success',
// // // // // // //         text: 'Submitted! We’ll review your workspace. ✨',
// // // // // // //       })

// // // // // // //       // Reset form
// // // // // // //       setFormData({
// // // // // // //         email: '',
// // // // // // //         name: '',
// // // // // // //         intro: '',
// // // // // // //         state: '',
// // // // // // //         country: '',
// // // // // // //         portfolioUrl: '',
// // // // // // //         description: '',
// // // // // // //         budget: '',
// // // // // // //         spaceSize: '',
// // // // // // //         recentAddition: '',
// // // // // // //         desiredChange: '',
// // // // // // //         favoriteItem: '',
// // // // // // //         typicalDay: '',
// // // // // // //         productivityTrick: '',
// // // // // // //         creativitySpark: '',
// // // // // // //         cableManagement: '',
// // // // // // //         comfortErgonomics: '',
// // // // // // //         homeOfficeWhy: '',
// // // // // // //         workLifeBalance: '',
// // // // // // //         softwareTools: '',
// // // // // // //         videoLink: '',
// // // // // // //         consent: false,
// // // // // // //         newsletter: false,
// // // // // // //       })
// // // // // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // // // // //       setGearItems(Array(7).fill({ name: '', link: '', showLink: false }))
// // // // // // //       setImageFiles([])
// // // // // // //       setImagePreviews([])
// // // // // // //       setOpenSections({
// // // // // // //         story: false,
// // // // // // //         routine: false,
// // // // // // //         ergonomics: false,
// // // // // // //         software: false,
// // // // // // //       })
// // // // // // //     } catch (err: any) {
// // // // // // //       console.error(err)
// // // // // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // // // // //     } finally {
// // // // // // //       setIsSubmitting(false)
// // // // // // //     }
// // // // // // //   }

// // // // // // //   /* ---------- Reusable UI helpers --------------------------------- */
// // // // // // //   const inputClass =
// // // // // // //     'w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition'
// // // // // // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// // // // // // //   const SectionToggle = ({
// // // // // // //     title,
// // // // // // //     section,
// // // // // // //   }: {
// // // // // // //     title: string
// // // // // // //     section: SectionKey
// // // // // // //   }) => (
// // // // // // //     <button
// // // // // // //       type="button"
// // // // // // //       onClick={() => toggleSection(section)}
// // // // // // //       className="w-full flex items-center justify-between py-3 px-1 border-b border-gray-200 text-left"
// // // // // // //     >
// // // // // // //       <span className="text-sm font-semibold text-gray-700">{title}</span>
// // // // // // //       <span className="text-gray-400 text-lg">
// // // // // // //         {openSections[section] ? '−' : '+'}
// // // // // // //       </span>
// // // // // // //     </button>
// // // // // // //   )

// // // // // // //   /* ---------- Render ---------------------------------------------- */
// // // // // // //   return (
// // // // // // //     <section className="bg-white px-4 py-16 md:py-24">
// // // // // // //       <div className="max-w-4xl mx-auto">
// // // // // // //         <div className="text-center mb-12">
// // // // // // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // // // // // //             Show us your desk setup ✨
// // // // // // //           </h1>
// // // // // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // // // // // //             Fill out the form below for a chance to be featured. Fields marked with * are required.
// // // // // // //           </p>
// // // // // // //         </div>

// // // // // // //         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
// // // // // // //           <form onSubmit={handleSubmit} className="space-y-8">
// // // // // // //             {/* ============================================= */}
// // // // // // //             {/* 1. ABOUT YOU                                  */}
// // // // // // //             {/* ============================================= */}
// // // // // // //             <div>
// // // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5">1. About You</h2>
// // // // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // // // // // //                 {/* Email */}
// // // // // // //                 <div>
// // // // // // //                   <label htmlFor="email" className={labelClass}>
// // // // // // //                     Email address *
// // // // // // //                   </label>
// // // // // // //                   <input
// // // // // // //                     id="email"
// // // // // // //                     type="email"
// // // // // // //                     required
// // // // // // //                     value={formData.email}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="you@example.com"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 {/* Full Name */}
// // // // // // //                 <div>
// // // // // // //                   <label htmlFor="name" className={labelClass}>
// // // // // // //                     Full name *
// // // // // // //                   </label>
// // // // // // //                   <input
// // // // // // //                     id="name"
// // // // // // //                     type="text"
// // // // // // //                     required
// // // // // // //                     value={formData.name}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="Jane Smith"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 {/* Location: State (optional) + Country (required) */}
// // // // // // //                 <div>
// // // // // // //                   <label htmlFor="state" className={labelClass}>
// // // // // // //                     State / Region
// // // // // // //                   </label>
// // // // // // //                   <input
// // // // // // //                     id="state"
// // // // // // //                     type="text"
// // // // // // //                     value={formData.state}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="California"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 <div>
// // // // // // //                   <label htmlFor="country" className={labelClass}>
// // // // // // //                     Country *
// // // // // // //                   </label>
// // // // // // //                   <input
// // // // // // //                     id="country"
// // // // // // //                     type="text"
// // // // // // //                     required
// // // // // // //                     value={formData.country}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="United States"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 {/* Intro (detailed) */}
// // // // // // //                 <div className="md:col-span-2">
// // // // // // //                   <label htmlFor="intro" className={labelClass}>
// // // // // // //                     Tell us about yourself and what you do
// // // // // // //                   </label>
// // // // // // //                   <textarea
// // // // // // //                     id="intro"
// // // // // // //                     rows={4}
// // // // // // //                     value={formData.intro}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="Write a couple of paragraphs – your background, your work, your passions…"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 {/* Portfolio / Website */}
// // // // // // //                 <div>
// // // // // // //                   <label htmlFor="portfolioUrl" className={labelClass}>
// // // // // // //                     Portfolio / Website link
// // // // // // //                   </label>
// // // // // // //                   <input
// // // // // // //                     id="portfolioUrl"
// // // // // // //                     type="url"
// // // // // // //                     value={formData.portfolioUrl}
// // // // // // //                     onChange={handleInputChange}
// // // // // // //                     placeholder="https://yourportfolio.com"
// // // // // // //                     className={inputClass}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>

// // // // // // //               {/* Social profiles (at least one required) */}
// // // // // // //               <div className="mt-5">
// // // // // // //                 <label className={labelClass}>
// // // // // // //                   Social handles (at least one required) *
// // // // // // //                 </label>
// // // // // // //                 {socialProfiles.map((profile, index) => (
// // // // // // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // // // // // //                     <select
// // // // // // //                       value={profile.platform}
// // // // // // //                       onChange={(e) =>
// // // // // // //                         handleSocialChange(index, 'platform', e.target.value)
// // // // // // //                       }
// // // // // // //                       className="w-1/3 rounded-md bg-gray-50 border border-gray-200 px-2 py-3 text-sm text-gray-900"
// // // // // // //                     >
// // // // // // //                       <option value="">Select</option>
// // // // // // //                       {PLATFORM_OPTIONS.map((opt) => (
// // // // // // //                         <option key={opt} value={opt}>
// // // // // // //                           {opt}
// // // // // // //                         </option>
// // // // // // //                       ))}
// // // // // // //                     </select>
// // // // // // //                     <input
// // // // // // //                       type="text"
// // // // // // //                       placeholder="Handle or URL"
// // // // // // //                       value={profile.handle}
// // // // // // //                       onChange={(e) =>
// // // // // // //                         handleSocialChange(index, 'handle', e.target.value)
// // // // // // //                       }
// // // // // // //                       className={`${inputClass} flex-1`}
// // // // // // //                     />
// // // // // // //                     <button
// // // // // // //                       type="button"
// // // // // // //                       onClick={() => removeSocialRow(index)}
// // // // // // //                       disabled={socialProfiles.length === 1}
// // // // // // //                       className="text-red-500 hover:text-red-700 text-sm px-2 py-3 disabled:opacity-30"
// // // // // // //                     >
// // // // // // //                       ✕
// // // // // // //                     </button>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //                 <button
// // // // // // //                   type="button"
// // // // // // //                   onClick={addSocialRow}
// // // // // // //                   className="text-green-600 hover:text-green-700 text-sm mt-1 flex items-center gap-1"
// // // // // // //                 >
// // // // // // //                   + Add another profile
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>

// // // // // // //             {/* ============================================= */}
// // // // // // //             {/* 2. YOUR WORKSPACE (required sections)         */}
// // // // // // //             {/* ============================================= */}
// // // // // // //             <div>
// // // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5">2. Your Workspace</h2>

// // // // // // //               {/* Story behind the setup (required) */}
// // // // // // //               <div>
// // // // // // //                 <label htmlFor="description" className={labelClass}>
// // // // // // //                   Story behind your desk setup *
// // // // // // //                 </label>
// // // // // // //                 <textarea
// // // // // // //                   id="description"
// // // // // // //                   rows={4}
// // // // // // //                   required
// // // // // // //                   value={formData.description}
// // // // // // //                   onChange={handleInputChange}
// // // // // // //                   placeholder="What inspired your setup? Any theme or philosophy? How did you build it?"
// // // // // // //                   className={inputClass}
// // // // // // //                 />
// // // // // // //               </div>

// // // // // // //               {/* Images (min 5 required) */}
// // // // // // //               <div className="mt-5">
// // // // // // //                 <label className={labelClass}>
// // // // // // //                   Upload images (at least 5) *
// // // // // // //                 </label>
// // // // // // //                 <input
// // // // // // //                   type="file"
// // // // // // //                   multiple
// // // // // // //                   accept="image/*"
// // // // // // //                   onChange={handleImageSelect}
// // // // // // //                   className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
// // // // // // //                 />
// // // // // // //                 {imagePreviews.length > 0 && (
// // // // // // //                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
// // // // // // //                     {imagePreviews.map((preview, idx) => (
// // // // // // //                       <div key={idx} className="relative group">
// // // // // // //                         <img
// // // // // // //                           src={preview}
// // // // // // //                           alt={`Preview ${idx + 1}`}
// // // // // // //                           className="h-24 w-full object-cover rounded-md border"
// // // // // // //                         />
// // // // // // //                         <button
// // // // // // //                           type="button"
// // // // // // //                           onClick={() => removeImage(idx)}
// // // // // // //                           className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-gray-100"
// // // // // // //                         >
// // // // // // //                           ✕
// // // // // // //                         </button>
// // // // // // //                       </div>
// // // // // // //                     ))}
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //                 <p className="text-xs text-gray-500 mt-2">
// // // // // // //                   {imageFiles.length} file{imageFiles.length !== 1 ? 's' : ''} selected
// // // // // // //                   {imageFiles.length < 5 ? ' (minimum 5 required)' : ''}
// // // // // // //                 </p>
// // // // // // //               </div>

// // // // // // //               {/* Video link (optional) */}
// // // // // // //               <div className="mt-5">
// // // // // // //                 <label htmlFor="videoLink" className={labelClass}>
// // // // // // //                   Video link (optional)
// // // // // // //                 </label>
// // // // // // //                 <input
// // // // // // //                   id="videoLink"
// // // // // // //                   type="url"
// // // // // // //                   value={formData.videoLink}
// // // // // // //                   onChange={handleInputChange}
// // // // // // //                   placeholder="YouTube, Vimeo, etc."
// // // // // // //                   className={inputClass}
// // // // // // //                 />
// // // // // // //               </div>

// // // // // // //               {/* ===== Gear List (min 7 items, required) ===== */}
// // // // // // //               <div className="mt-6">
// // // // // // //                 <label className={labelClass}>
// // // // // // //                   Workspace items / gear (at least 7 items) *
// // // // // // //                 </label>
// // // // // // //                 <p className="text-xs text-gray-500 mb-3">
// // // // // // //                   For each item, enter its name. You can optionally add an affiliate link by clicking the “+ link” button.
// // // // // // //                 </p>
// // // // // // //                 <div className="space-y-3">
// // // // // // //                   {gearItems.map((item, index) => (
// // // // // // //                     <div
// // // // // // //                       key={index}
// // // // // // //                       className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
// // // // // // //                     >
// // // // // // //                       <div className="flex-1 w-full">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           placeholder={`Item ${index + 1} name`}
// // // // // // //                           value={item.name}
// // // // // // //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// // // // // // //                           className={inputClass}
// // // // // // //                         />
// // // // // // //                         {item.showLink && (
// // // // // // //                           <input
// // // // // // //                             type="url"
// // // // // // //                             placeholder="Affiliate link (optional)"
// // // // // // //                             value={item.link}
// // // // // // //                             onChange={(e) => handleGearLinkChange(index, e.target.value)}
// // // // // // //                             className={`${inputClass} mt-2`}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                       </div>
// // // // // // //                       <div className="flex gap-2 items-center mt-2 sm:mt-0">
// // // // // // //                         <button
// // // // // // //                           type="button"
// // // // // // //                           onClick={() => toggleGearLinkInput(index)}
// // // // // // //                           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
// // // // // // //                         >
// // // // // // //                           {item.showLink ? '− link' : '+ link'}
// // // // // // //                         </button>
// // // // // // //                         <button
// // // // // // //                           type="button"
// // // // // // //                           onClick={() => removeGearRow(index)}
// // // // // // //                           disabled={gearItems.length <= 7}
// // // // // // //                           className="text-red-500 hover:text-red-700 text-sm disabled:opacity-30"
// // // // // // //                         >
// // // // // // //                           ✕
// // // // // // //                         </button>
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                   ))}
// // // // // // //                 </div>
// // // // // // //                 <button
// // // // // // //                   type="button"
// // // // // // //                   onClick={addGearRow}
// // // // // // //                   className="text-green-600 hover:text-green-700 text-sm mt-3 flex items-center gap-1"
// // // // // // //                 >
// // // // // // //                   + Add another item
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>

// // // // // // //             {/* ============================================= */}
// // // // // // //             {/* 3. OPTIONAL DETAILS (expandable)              */}
// // // // // // //             {/* ============================================= */}
// // // // // // //             <div className="border-t border-gray-100 pt-6 space-y-1">
// // // // // // //               {/* Setup story details */}
// // // // // // //               <SectionToggle title="Setup story & details (budget, space, favorites…)" section="story" />
// // // // // // //               {openSections.story && (
// // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // //                     <div>
// // // // // // //                       <label htmlFor="budget" className={labelClass}>Approximate setup budget</label>
// // // // // // //                       <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g. $2,500" className={inputClass} />
// // // // // // //                     </div>
// // // // // // //                     <div>
// // // // // // //                       <label htmlFor="spaceSize" className={labelClass}>Space size (sq ft / m²)</label>
// // // // // // //                       <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="e.g. 120 sq ft" className={inputClass} />
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="favoriteItem" className={labelClass}>Your favorite item on this desk</label>
// // // // // // //                     <input id="favoriteItem" value={formData.favoriteItem} onChange={handleInputChange} placeholder="The standing desk, a custom keyboard..." className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="recentAddition" className={labelClass}>Most recent addition</label>
// // // // // // //                     <input id="recentAddition" value={formData.recentAddition} onChange={handleInputChange} placeholder="A new monitor light" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="desiredChange" className={labelClass}>One change you’d like to make</label>
// // // // // // //                     <input id="desiredChange" value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               )}

// // // // // // //               {/* Routine & productivity */}
// // // // // // //               <SectionToggle title="Your routine & productivity tips" section="routine" />
// // // // // // //               {openSections.routine && (
// // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="typicalDay" className={labelClass}>What does a typical day look like?</label>
// // // // // // //                     <textarea id="typicalDay" rows={2} value={formData.typicalDay} onChange={handleInputChange} placeholder="Morning coffee, deep work from 9-12..." className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="productivityTrick" className={labelClass}>One productivity trick that works</label>
// // // // // // //                     <input id="productivityTrick" value={formData.productivityTrick} onChange={handleInputChange} placeholder="Time-blocking with a physical timer" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="creativitySpark" className={labelClass}>How do you spark creativity?</label>
// // // // // // //                     <input id="creativitySpark" value={formData.creativitySpark} onChange={handleInputChange} placeholder="A walk without my phone" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               )}

// // // // // // //               {/* Comfort & ergonomics */}
// // // // // // //               <SectionToggle title="Comfort, ergonomics & cable management" section="ergonomics" />
// // // // // // //               {openSections.ergonomics && (
// // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="cableManagement" className={labelClass}>How have you conquered cable management?</label>
// // // // // // //                     <input id="cableManagement" value={formData.cableManagement} onChange={handleInputChange} placeholder="Under-desk trays, velcro straps..." className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="comfortErgonomics" className={labelClass}>What have you done for comfort and ergonomics?</label>
// // // // // // //                     <input id="comfortErgonomics" value={formData.comfortErgonomics} onChange={handleInputChange} placeholder="Adjustable standing desk, ergonomic mouse" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="homeOfficeWhy" className={labelClass}>Where did you set up your home office and why?</label>
// // // // // // //                     <input id="homeOfficeWhy" value={formData.homeOfficeWhy} onChange={handleInputChange} placeholder="Spare bedroom for natural light" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="workLifeBalance" className={labelClass}>How do you keep work-life balance?</label>
// // // // // // //                     <input id="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} placeholder="Shutdown ritual at 6pm" className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               )}

// // // // // // //               {/* Software & tools */}
// // // // // // //               <SectionToggle title="Software & tools" section="software" />
// // // // // // //               {openSections.software && (
// // // // // // //                 <div className="pt-4 space-y-4 pl-1">
// // // // // // //                   <div>
// // // // // // //                     <label htmlFor="softwareTools" className={labelClass}>Software / tools you use daily</label>
// // // // // // //                     <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify..." className={inputClass} />
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //             </div>

// // // // // // //             {/* ============================================= */}
// // // // // // //             {/* 4. CONSENT & SUBMIT                            */}
// // // // // // //             {/* ============================================= */}
// // // // // // //             <div className="border-t border-gray-100 pt-6 space-y-3">
// // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // //                 <input
// // // // // // //                   type="checkbox"
// // // // // // //                   id="consent"
// // // // // // //                   checked={formData.consent}
// // // // // // //                   onChange={handleInputChange}
// // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // // //                 />
// // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // //                   I agree to be featured on DeskScrolls and its social media. I confirm
// // // // // // //                   the photos are mine or I have permission. *
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //               <label className="flex items-start gap-3 cursor-pointer">
// // // // // // //                 <input
// // // // // // //                   type="checkbox"
// // // // // // //                   id="newsletter"
// // // // // // //                   checked={formData.newsletter}
// // // // // // //                   onChange={handleInputChange}
// // // // // // //                   className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // // //                 />
// // // // // // //                 <span className="text-sm text-gray-700">
// // // // // // //                   Send me updates, featured setups, and community news.
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //             </div>

// // // // // // //             <button
// // // // // // //               type="submit"
// // // // // // //               disabled={isSubmitting}
// // // // // // //               className="w-full bg-black text-white font-semibold py-3.5 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
// // // // // // //             >
// // // // // // //               {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // // // // //             </button>

// // // // // // //             {message && (
// // // // // // //               <div
// // // // // // //                 className={`mt-4 text-sm font-medium p-3 rounded-md border ${
// // // // // // //                   message.type === 'success'
// // // // // // //                     ? 'bg-green-50 border-green-200 text-green-700'
// // // // // // //                     : 'bg-red-50 border-red-200 text-red-700'
// // // // // // //                 }`}
// // // // // // //               >
// // // // // // //                 {message.text}
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </form>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </section>
// // // // // // //   )
// // // // // // // }






























// // // // // // 'use client'

// // // // // // import { useState } from 'react'
// // // // // // import { createClient } from '@/lib/supabase/client'
// // // // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // // // /* ------------------------------------------------------------------ */
// // // // // // /*  Types & Constants                                                 */
// // // // // // /* ------------------------------------------------------------------ */
// // // // // // type SocialProfile = {
// // // // // //   platform: string
// // // // // //   handle: string
// // // // // // }

// // // // // // type GearItem = {
// // // // // //   name: string
// // // // // //   link: string
// // // // // // }

// // // // // // const PLATFORM_OPTIONS = [
// // // // // //   'GitHub',
// // // // // //   'Twitter / X',
// // // // // //   'Instagram',
// // // // // //   'LinkedIn',
// // // // // //   'YouTube',
// // // // // //   'Behance',
// // // // // //   'Dribbble',
// // // // // //   'Personal Website',
// // // // // //   'Other',
// // // // // // ]

// // // // // // type SectionKey = 'story' | 'routine' | 'ergonomics' | 'software'

// // // // // // /* ------------------------------------------------------------------ */
// // // // // // /*  Component                                                         */
// // // // // // /* ------------------------------------------------------------------ */
// // // // // // export default function SubmitForm() {
// // // // // //   const supabase = createClient()

// // // // // //   /* --- Form state -------------------------------------------------- */
// // // // // //   const [formData, setFormData] = useState({
// // // // // //     email: '',
// // // // // //     name: '',
// // // // // //     intro: '',                 // detailed intro (occupation included)
// // // // // //     location: '',              // City, State, Country
// // // // // //     description: '',           // story behind desk setup (required)
// // // // // //     budget: '',
// // // // // //     spaceSize: '',
// // // // // //     recentAddition: '',
// // // // // //     desiredChange: '',
// // // // // //     favoriteItem: '',
// // // // // //     typicalDay: '',
// // // // // //     productivityTrick: '',
// // // // // //     creativitySpark: '',
// // // // // //     cableManagement: '',
// // // // // //     comfortErgonomics: '',
// // // // // //     homeOfficeWhy: '',
// // // // // //     workLifeBalance: '',
// // // // // //     softwareTools: '',
// // // // // //     videoLink: '',
// // // // // //     consent: false,
// // // // // //     newsletter: false,
// // // // // //   })

// // // // // //   /* --- Dynamic social profiles ------------------------------------ */
// // // // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // // // //     { platform: '', handle: '' },
// // // // // //   ])

// // // // // //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// // // // // //   const [gearItems, setGearItems] = useState<GearItem[]>(
// // // // // //     Array(7).fill({ name: '', link: '' })
// // // // // //   )

// // // // // //   /* --- Image uploads ---------------------------------------------- */
// // // // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // // // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // // // //   /* --- Expandable sections --------------------------------------- */
// // // // // //   const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
// // // // // //     story: false,
// // // // // //     routine: false,
// // // // // //     ergonomics: false,
// // // // // //     software: false,
// // // // // //   })

// // // // // //   const toggleSection = (key: SectionKey) => {
// // // // // //     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
// // // // // //   }

// // // // // //   /* ---------- Handlers -------------------------------------------- */
// // // // // //   const handleInputChange = (
// // // // // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // // // // //   ) => {
// // // // // //     const { id, value, type } = e.target
// // // // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // // // //   }

// // // // // //   /* Social profiles */
// // // // // //   const handleSocialChange = (
// // // // // //     index: number,
// // // // // //     field: 'platform' | 'handle',
// // // // // //     value: string,
// // // // // //   ) => {
// // // // // //     const updated = [...socialProfiles]
// // // // // //     updated[index][field] = value
// // // // // //     setSocialProfiles(updated)
// // // // // //   }

// // // // // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // // // //   const removeSocialRow = (index: number) => {
// // // // // //     if (socialProfiles.length === 1) return
// // // // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // // // //   }

// // // // // //   /* Gear list */
// // // // // //   const handleGearNameChange = (index: number, name: string) => {
// // // // // //     const updated = [...gearItems]
// // // // // //     updated[index] = { ...updated[index], name }
// // // // // //     setGearItems(updated)
// // // // // //   }

// // // // // //   const handleGearLinkChange = (index: number, link: string) => {
// // // // // //     const updated = [...gearItems]
// // // // // //     updated[index] = { ...updated[index], link }
// // // // // //     setGearItems(updated)
// // // // // //   }

// // // // // //   const addGearRow = () => {
// // // // // //     setGearItems([...gearItems, { name: '', link: '' }])
// // // // // //   }

// // // // // //   const removeGearRow = (index: number) => {
// // // // // //     if (gearItems.length <= 7) return
// // // // // //     setGearItems(gearItems.filter((_, i) => i !== index))
// // // // // //   }

// // // // // //   /* Image upload */
// // // // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // //     const files = Array.from(e.target.files || [])
// // // // // //     if (!files.length) return
// // // // // //     const total = imageFiles.length + files.length
// // // // // //     if (total > 10) {
// // // // // //       alert('Maximum 10 images allowed.')
// // // // // //       return
// // // // // //     }
// // // // // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // // // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // // // //     setImageFiles((prev) => [...prev, ...files])
// // // // // //   }

// // // // // //   const removeImage = (index: number) => {
// // // // // //     const updatedFiles = [...imageFiles]
// // // // // //     updatedFiles.splice(index, 1)
// // // // // //     setImageFiles(updatedFiles)
// // // // // //     const updatedPreviews = [...imagePreviews]
// // // // // //     URL.revokeObjectURL(updatedPreviews[index])
// // // // // //     updatedPreviews.splice(index, 1)
// // // // // //     setImagePreviews(updatedPreviews)
// // // // // //   }

// // // // // //   /* ---------- Submit ---------------------------------------------- */
// // // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // // //     e.preventDefault()

// // // // // //     // --- Validation ---
// // // // // //     // At least one of email or social handle required
// // // // // //     const validSocialProfiles = socialProfiles.filter(
// // // // // //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // // // // //     )

// // // // // //     if (!formData.email && validSocialProfiles.length === 0) {
// // // // // //       setMessage({
// // // // // //         type: 'error',
// // // // // //         text: 'Please provide either an email address or at least one social profile/website.',
// // // // // //       })
// // // // // //       return
// // // // // //     }

// // // // // //     if (!formData.name) {
// // // // // //       setMessage({ type: 'error', text: 'Your name is required.' })
// // // // // //       return
// // // // // //     }
// // // // // //     if (!formData.location.trim()) {
// // // // // //       setMessage({ type: 'error', text: 'Location is required (at least country).' })
// // // // // //       return
// // // // // //     }
// // // // // //     if (!formData.description.trim()) {
// // // // // //       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
// // // // // //       return
// // // // // //     }
// // // // // //     if (imageFiles.length < 5) {
// // // // // //       setMessage({ type: 'error', text: 'Please upload at least 5 images of your workspace.' })
// // // // // //       return
// // // // // //     }
// // // // // //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// // // // // //     if (validGearItems.length < 7) {
// // // // // //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// // // // // //       return
// // // // // //     }
// // // // // //     if (!formData.consent) {
// // // // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // // // //       return
// // // // // //     }

// // // // // //     setIsSubmitting(true)
// // // // // //     setMessage(null)

// // // // // //     try {
// // // // // //       // Upload images
// // // // // //       let uploadedImageUrls: string[] = []
// // // // // //       if (imageFiles.length > 0) {
// // // // // //         const uploadPromises = imageFiles.map((file) =>
// // // // // //           uploadImage(file, 'submissions', 'user-uploads'),
// // // // // //         )
// // // // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // // // //       }

// // // // // //       // Gear data (only name + link)
// // // // // //       const gearData = validGearItems.map(({ name, link }) => ({
// // // // // //         name,
// // // // // //         link: link.trim() || null,
// // // // // //       }))

// // // // // //       // Insert into submissions
// // // // // //       const { error } = await supabase.from('submissions').insert({
// // // // // //         email: formData.email || null,
// // // // // //         name: formData.name,
// // // // // //         intro: formData.intro || null,
// // // // // //         location: formData.location,
// // // // // //         social_profiles: validSocialProfiles,
// // // // // //         image_urls: uploadedImageUrls,
// // // // // //         video_link: formData.videoLink || null,
// // // // // //         description: formData.description,
// // // // // //         budget: formData.budget || null,
// // // // // //         space_size: formData.spaceSize || null,
// // // // // //         recent_addition: formData.recentAddition || null,
// // // // // //         desired_change: formData.desiredChange || null,
// // // // // //         favorite_item: formData.favoriteItem || null,
// // // // // //         typical_day: formData.typicalDay || null,
// // // // // //         productivity_trick: formData.productivityTrick || null,
// // // // // //         creativity_spark: formData.creativitySpark || null,
// // // // // //         cable_management: formData.cableManagement || null,
// // // // // //         comfort_ergonomics: formData.comfortErgonomics || null,
// // // // // //         home_office_why: formData.homeOfficeWhy || null,
// // // // // //         work_life_balance: formData.workLifeBalance || null,
// // // // // //         software_tools: formData.softwareTools || null,
// // // // // //         gear_list: gearData,
// // // // // //         consent: formData.consent,
// // // // // //         newsletter: formData.newsletter,
// // // // // //         status: 'pending',
// // // // // //       })

// // // // // //       if (error) throw error

// // // // // //       setMessage({
// // // // // //         type: 'success',
// // // // // //         text: 'Submitted! We’ll review your workspace. ✨',
// // // // // //       })

// // // // // //       // Reset form
// // // // // //       setFormData({
// // // // // //         email: '',
// // // // // //         name: '',
// // // // // //         intro: '',
// // // // // //         location: '',
// // // // // //         description: '',
// // // // // //         budget: '',
// // // // // //         spaceSize: '',
// // // // // //         recentAddition: '',
// // // // // //         desiredChange: '',
// // // // // //         favoriteItem: '',
// // // // // //         typicalDay: '',
// // // // // //         productivityTrick: '',
// // // // // //         creativitySpark: '',
// // // // // //         cableManagement: '',
// // // // // //         comfortErgonomics: '',
// // // // // //         homeOfficeWhy: '',
// // // // // //         workLifeBalance: '',
// // // // // //         softwareTools: '',
// // // // // //         videoLink: '',
// // // // // //         consent: false,
// // // // // //         newsletter: false,
// // // // // //       })
// // // // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // // // //       setGearItems(Array(7).fill({ name: '', link: '' }))
// // // // // //       setImageFiles([])
// // // // // //       setImagePreviews([])
// // // // // //       setOpenSections({ story: false, routine: false, ergonomics: false, software: false })
// // // // // //     } catch (err: any) {
// // // // // //       console.error(err)
// // // // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // // // //     } finally {
// // // // // //       setIsSubmitting(false)
// // // // // //     }
// // // // // //   }

// // // // // //   /* ---------- Reusable UI helpers --------------------------------- */
// // // // // //   const inputClass =
// // // // // //     'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors'
// // // // // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// // // // // //   const SectionToggle = ({ title, description, section }: { title: string; description?: string; section: SectionKey }) => (
// // // // // //     <button
// // // // // //       type="button"
// // // // // //       onClick={() => toggleSection(section)}
// // // // // //       className="w-full flex items-center justify-between py-3 px-1 border-b border-gray-100 text-left hover:bg-gray-50/50 rounded-md transition-colors"
// // // // // //     >
// // // // // //       <div>
// // // // // //         <span className="text-sm font-semibold text-gray-800">{title}</span>
// // // // // //         {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
// // // // // //       </div>
// // // // // //       <span className="text-gray-400 text-lg leading-none ml-3">
// // // // // //         {openSections[section] ? '−' : '+'}
// // // // // //       </span>
// // // // // //     </button>
// // // // // //   )

// // // // // //   /* ---------- Render ---------------------------------------------- */
// // // // // //   return (
// // // // // //     <section className="bg-white px-4 py-16 md:py-24">
// // // // // //       <div className="max-w-4xl mx-auto">
// // // // // //         {/* Header */}
// // // // // //         <div className="text-center mb-12">
// // // // // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // // // // //             Show us your desk setup ✨
// // // // // //           </h1>
// // // // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // // // // //             Fill out the form below for a chance to be featured. Required fields are marked with an asterisk (*).
// // // // // //           </p>
// // // // // //         </div>

// // // // // //         {/* Form Card */}
// // // // // //         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
// // // // // //           <form onSubmit={handleSubmit} className="space-y-10">

// // // // // //             {/* ============================================= */}
// // // // // //             {/* 1. ABOUT YOU                                  */}
// // // // // //             {/* ============================================= */}
// // // // // //             <section>
// // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
// // // // // //                 <span className="w-1.5 h-6 bg-gray-900 rounded-full inline-block"></span>
// // // // // //                 1. About You
// // // // // //               </h2>
// // // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // // // // //                 {/* Name */}
// // // // // //                 <div>
// // // // // //                   <label htmlFor="name" className={labelClass}>Full name *</label>
// // // // // //                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
// // // // // //                 </div>
// // // // // //                 {/* Email (optional if social provided) */}
// // // // // //                 <div>
// // // // // //                   <label htmlFor="email" className={labelClass}>Email address</label>
// // // // // //                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
// // // // // //                   <p className="text-xs text-gray-400 mt-1">Required only if no social profiles below</p>
// // // // // //                 </div>
// // // // // //                 {/* Location */}
// // // // // //                 <div>
// // // // // //                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
// // // // // //                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
// // // // // //                 </div>
// // // // // //                 {/* Intro (detailed) */}
// // // // // //                 <div className="md:col-span-2">
// // // // // //                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
// // // // // //                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               {/* Social profiles / websites */}
// // // // // //               <div className="mt-5">
// // // // // //                 <label className={labelClass}>
// // // // // //                   Online profiles / websites (handle or URL)
// // // // // //                 </label>
// // // // // //                 <p className="text-xs text-gray-400 mb-3">
// // // // // //                   Add at least one if you don't provide an email above.
// // // // // //                 </p>
// // // // // //                 {socialProfiles.map((profile, index) => (
// // // // // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // // // // //                     <select
// // // // // //                       value={profile.platform}
// // // // // //                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// // // // // //                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900"
// // // // // //                     >
// // // // // //                       <option value="">Select</option>
// // // // // //                       {PLATFORM_OPTIONS.map((opt) => (
// // // // // //                         <option key={opt} value={opt}>{opt}</option>
// // // // // //                       ))}
// // // // // //                     </select>
// // // // // //                     <input
// // // // // //                       type="text"
// // // // // //                       placeholder="Handle or URL"
// // // // // //                       value={profile.handle}
// // // // // //                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// // // // // //                       className={`${inputClass} flex-1`}
// // // // // //                     />
// // // // // //                     <button
// // // // // //                       type="button"
// // // // // //                       onClick={() => removeSocialRow(index)}
// // // // // //                       disabled={socialProfiles.length === 1}
// // // // // //                       className="text-gray-400 hover:text-red-500 text-sm p-3 disabled:opacity-20 transition-colors"
// // // // // //                       title="Remove"
// // // // // //                     >
// // // // // //                       ✕
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
// // // // // //                   + Add another profile
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </section>

// // // // // //             {/* ============================================= */}
// // // // // //             {/* 2. YOUR WORKSPACE (required core)             */}
// // // // // //             {/* ============================================= */}
// // // // // //             <section>
// // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
// // // // // //                 <span className="w-1.5 h-6 bg-gray-900 rounded-full inline-block"></span>
// // // // // //                 2. Your Workspace *
// // // // // //               </h2>

// // // // // //               {/* Story behind the setup (required) */}
// // // // // //               <div>
// // // // // //                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
// // // // // //                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
// // // // // //               </div>

// // // // // //               {/* Images (min 5 required) */}
// // // // // //               <div className="mt-6">
// // // // // //                 <label className={labelClass}>Upload images (at least 5) *</label>
// // // // // //                 <div className="flex items-center gap-4 flex-wrap">
// // // // // //                   <input
// // // // // //                     type="file"
// // // // // //                     multiple
// // // // // //                     accept="image/*"
// // // // // //                     onChange={handleImageSelect}
// // // // // //                     className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
// // // // // //                   />
// // // // // //                   <span className="text-xs text-gray-400">
// // // // // //                     {imageFiles.length}/5 minimum
// // // // // //                   </span>
// // // // // //                 </div>
// // // // // //                 {imagePreviews.length > 0 && (
// // // // // //                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
// // // // // //                     {imagePreviews.map((preview, idx) => (
// // // // // //                       <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
// // // // // //                         <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
// // // // // //                         <button
// // // // // //                           type="button"
// // // // // //                           onClick={() => removeImage(idx)}
// // // // // //                           className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
// // // // // //                         >
// // // // // //                           ✕
// // // // // //                         </button>
// // // // // //                       </div>
// // // // // //                     ))}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>

// // // // // //               {/* Video link (optional) */}
// // // // // //               <div className="mt-5">
// // // // // //                 <label htmlFor="videoLink" className={labelClass}>Video link (optional)</label>
// // // // // //                 <input id="videoLink" type="url" value={formData.videoLink} onChange={handleInputChange} placeholder="YouTube, Vimeo, etc." className={inputClass} />
// // // // // //               </div>

// // // // // //               {/* ===== Gear List (min 7 items, required) ===== */}
// // // // // //               <div className="mt-6">
// // // // // //                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
// // // // // //                 <p className="text-xs text-gray-400 mb-4">
// // // // // //                   List every major item in your setup. You can optionally add an affiliate or product link for each.
// // // // // //                 </p>
// // // // // //                 <div className="space-y-3">
// // // // // //                   {gearItems.map((item, index) => (
// // // // // //                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// // // // // //                       <div className="flex-1 w-full">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
// // // // // //                           value={item.name}
// // // // // //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// // // // // //                           className={inputClass}
// // // // // //                         />
// // // // // //                       </div>
// // // // // //                       <div className="flex-1 sm:flex-[0.4] w-full">
// // // // // //                         <input
// // // // // //                           type="url"
// // // // // //                           placeholder="Link (optional)"
// // // // // //                           value={item.link}
// // // // // //                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
// // // // // //                           className={`${inputClass} text-xs`}
// // // // // //                         />
// // // // // //                       </div>
// // // // // //                       <button
// // // // // //                         type="button"
// // // // // //                         onClick={() => removeGearRow(index)}
// // // // // //                         disabled={gearItems.length <= 7}
// // // // // //                         className="text-gray-400 hover:text-red-500 text-sm p-3 disabled:opacity-20 transition-colors"
// // // // // //                         title="Remove"
// // // // // //                       >
// // // // // //                         ✕
// // // // // //                       </button>
// // // // // //                     </div>
// // // // // //                   ))}
// // // // // //                 </div>
// // // // // //                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
// // // // // //                   + Add another item
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </section>

// // // // // //             {/* ============================================= */}
// // // // // //             {/* 3. OPTIONAL DETAILS (expandable)              */}
// // // // // //             {/* ============================================= */}
// // // // // //             <section>
// // // // // //               <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
// // // // // //                 <span className="w-1.5 h-6 bg-gray-900 rounded-full inline-block"></span>
// // // // // //                 3. Optional Details
// // // // // //               </h2>
// // // // // //               <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
// // // // // //                 <SectionToggle title="Setup story & details" description="Budget, space, favorite item, recent addition..." section="story" />
// // // // // //                 {openSections.story && (
// // // // // //                   <div className="p-5 space-y-4 bg-gray-50/30 rounded-b-xl">
// // // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // //                       <div>
// // // // // //                         <label htmlFor="budget" className={labelClass}>Approximate setup budget</label>
// // // // // //                         <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
// // // // // //                       </div>
// // // // // //                       <div>
// // // // // //                         <label htmlFor="spaceSize" className={labelClass}>Space size</label>
// // // // // //                         <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="favoriteItem" className={labelClass}>Your favorite item</label>
// // // // // //                       <input id="favoriteItem" value={formData.favoriteItem} onChange={handleInputChange} placeholder="My mechanical keyboard" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="recentAddition" className={labelClass}>Most recent addition</label>
// // // // // //                       <input id="recentAddition" value={formData.recentAddition} onChange={handleInputChange} placeholder="New monitor light bar" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="desiredChange" className={labelClass}>One change you’d like to make</label>
// // // // // //                       <input id="desiredChange" value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management" className={inputClass} />
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 )}

// // // // // //                 <SectionToggle title="Your routine & productivity tips" description="Typical day, tricks, creativity..." section="routine" />
// // // // // //                 {openSections.routine && (
// // // // // //                   <div className="p-5 space-y-4 bg-gray-50/30 rounded-b-xl">
// // // // // //                     <div>
// // // // // //                       <label htmlFor="typicalDay" className={labelClass}>What does a typical day look like?</label>
// // // // // //                       <textarea id="typicalDay" rows={3} value={formData.typicalDay} onChange={handleInputChange} placeholder="Morning coffee, deep work, evening wrap-up…" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="productivityTrick" className={labelClass}>A productivity trick that works for you</label>
// // // // // //                       <input id="productivityTrick" value={formData.productivityTrick} onChange={handleInputChange} placeholder="Time blocking with a physical timer" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="creativitySpark" className={labelClass}>How do you spark creativity?</label>
// // // // // //                       <input id="creativitySpark" value={formData.creativitySpark} onChange={handleInputChange} placeholder="A walk without my phone" className={inputClass} />
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 )}

// // // // // //                 <SectionToggle title="Comfort, ergonomics & cable management" description="Home office location, balance, cables..." section="ergonomics" />
// // // // // //                 {openSections.ergonomics && (
// // // // // //                   <div className="p-5 space-y-4 bg-gray-50/30 rounded-b-xl">
// // // // // //                     <div>
// // // // // //                       <label htmlFor="cableManagement" className={labelClass}>How have you conquered cable management?</label>
// // // // // //                       <input id="cableManagement" value={formData.cableManagement} onChange={handleInputChange} placeholder="Under-desk trays and velcro straps" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="comfortErgonomics" className={labelClass}>What have you done for comfort and ergonomics?</label>
// // // // // //                       <input id="comfortErgonomics" value={formData.comfortErgonomics} onChange={handleInputChange} placeholder="Standing desk, ergonomic chair" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="homeOfficeWhy" className={labelClass}>Where did you set up your home office and why?</label>
// // // // // //                       <input id="homeOfficeWhy" value={formData.homeOfficeWhy} onChange={handleInputChange} placeholder="Spare bedroom for natural light" className={inputClass} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <label htmlFor="workLifeBalance" className={labelClass}>How do you keep work-life balance?</label>
// // // // // //                       <input id="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} placeholder="Shutdown ritual at 6pm" className={inputClass} />
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 )}

// // // // // //                 <SectionToggle title="Software & tools" description="Apps and programs you use daily" section="software" />
// // // // // //                 {openSections.software && (
// // // // // //                   <div className="p-5 space-y-4 bg-gray-50/30 rounded-b-xl">
// // // // // //                     <div>
// // // // // //                       <label htmlFor="softwareTools" className={labelClass}>Software / tools you use daily</label>
// // // // // //                       <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify..." className={inputClass} />
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             </section>

// // // // // //             {/* ============================================= */}
// // // // // //             {/* 4. CONSENT & SUBMIT                            */}
// // // // // //             {/* ============================================= */}
// // // // // //             <section className="border-t border-gray-100 pt-6">
// // // // // //               <div className="space-y-4">
// // // // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // // // //                   <input
// // // // // //                     type="checkbox"
// // // // // //                     id="consent"
// // // // // //                     checked={formData.consent}
// // // // // //                     onChange={handleInputChange}
// // // // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // //                   />
// // // // // //                   <span className="text-sm text-gray-700">
// // // // // //                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
// // // // // //                   </span>
// // // // // //                 </label>
// // // // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // // // //                   <input
// // // // // //                     type="checkbox"
// // // // // //                     id="newsletter"
// // // // // //                     checked={formData.newsletter}
// // // // // //                     onChange={handleInputChange}
// // // // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // // //                   />
// // // // // //                   <span className="text-sm text-gray-700">
// // // // // //                     Send me updates, featured setups, and community news.
// // // // // //                   </span>
// // // // // //                 </label>
// // // // // //               </div>

// // // // // //               <button
// // // // // //                 type="submit"
// // // // // //                 disabled={isSubmitting}
// // // // // //                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
// // // // // //               >
// // // // // //                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // // // //               </button>

// // // // // //               {message && (
// // // // // //                 <div
// // // // // //                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
// // // // // //                     message.type === 'success'
// // // // // //                       ? 'bg-green-50 border-green-200 text-green-700'
// // // // // //                       : 'bg-red-50 border-red-200 text-red-700'
// // // // // //                   }`}
// // // // // //                 >
// // // // // //                   {message.text}
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </section>
// // // // // //           </form>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </section>
// // // // // //   )
// // // // // // }




































// // // // // 'use client'

// // // // // import { useState } from 'react'
// // // // // import { createClient } from '@/lib/supabase/client'
// // // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // // /* ------------------------------------------------------------------ */
// // // // // /*  Types & Constants                                                 */
// // // // // /* ------------------------------------------------------------------ */
// // // // // type SocialProfile = {
// // // // //   platform: string
// // // // //   handle: string
// // // // // }

// // // // // type GearItem = {
// // // // //   name: string
// // // // //   link: string
// // // // // }

// // // // // const PLATFORM_OPTIONS = [
// // // // //   'GitHub',
// // // // //   'Twitter / X',
// // // // //   'Instagram',
// // // // //   'LinkedIn',
// // // // //   'YouTube',
// // // // //   'Behance',
// // // // //   'Dribbble',
// // // // //   'Personal Website',
// // // // //   'Other',
// // // // // ]

// // // // // /* ------------------------------------------------------------------ */
// // // // // /*  Component                                                         */
// // // // // /* ------------------------------------------------------------------ */
// // // // // export default function SubmitForm() {
// // // // //   const supabase = createClient()

// // // // //   /* --- Form state -------------------------------------------------- */
// // // // //   const [formData, setFormData] = useState({
// // // // //     email: '',
// // // // //     name: '',
// // // // //     intro: '',                 // detailed intro (occupation included)
// // // // //     location: '',              // City, State, Country
// // // // //     description: '',           // story behind desk setup (required)
// // // // //     budget: '',
// // // // //     spaceSize: '',
// // // // //     recentAddition: '',
// // // // //     desiredChange: '',
// // // // //     favoriteItem: '',
// // // // //     typicalDay: '',
// // // // //     productivityTrick: '',
// // // // //     creativitySpark: '',
// // // // //     cableManagement: '',
// // // // //     comfortErgonomics: '',
// // // // //     homeOfficeWhy: '',
// // // // //     workLifeBalance: '',
// // // // //     softwareTools: '',
// // // // //     videoLink: '',
// // // // //     consent: false,
// // // // //     newsletter: false,
// // // // //   })

// // // // //   /* --- Dynamic social profiles ------------------------------------ */
// // // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // // //     { platform: '', handle: '' },
// // // // //   ])

// // // // //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// // // // //   const [gearItems, setGearItems] = useState<GearItem[]>(
// // // // //     Array(7).fill({ name: '', link: '' })
// // // // //   )

// // // // //   /* --- Image uploads ---------------------------------------------- */
// // // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // // //   /* --- Optional details visibility -------------------------------- */
// // // // //   const [showOptional, setShowOptional] = useState(false)

// // // // //   /* ---------- Handlers -------------------------------------------- */
// // // // //   const handleInputChange = (
// // // // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // // // //   ) => {
// // // // //     const { id, value, type } = e.target
// // // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // // //   }

// // // // //   /* Social profiles */
// // // // //   const handleSocialChange = (
// // // // //     index: number,
// // // // //     field: 'platform' | 'handle',
// // // // //     value: string,
// // // // //   ) => {
// // // // //     const updated = [...socialProfiles]
// // // // //     updated[index][field] = value
// // // // //     setSocialProfiles(updated)
// // // // //   }

// // // // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // // //   const removeSocialRow = (index: number) => {
// // // // //     if (socialProfiles.length === 1) return
// // // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // // //   }

// // // // //   /* Gear list */
// // // // //   const handleGearNameChange = (index: number, name: string) => {
// // // // //     const updated = [...gearItems]
// // // // //     updated[index] = { ...updated[index], name }
// // // // //     setGearItems(updated)
// // // // //   }

// // // // //   const handleGearLinkChange = (index: number, link: string) => {
// // // // //     const updated = [...gearItems]
// // // // //     updated[index] = { ...updated[index], link }
// // // // //     setGearItems(updated)
// // // // //   }

// // // // //   const addGearRow = () => {
// // // // //     setGearItems([...gearItems, { name: '', link: '' }])
// // // // //   }

// // // // //   const removeGearRow = (index: number) => {
// // // // //     if (gearItems.length <= 7) return
// // // // //     setGearItems(gearItems.filter((_, i) => i !== index))
// // // // //   }

// // // // //   /* Image upload */
// // // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // //     const files = Array.from(e.target.files || [])
// // // // //     if (!files.length) return
// // // // //     const total = imageFiles.length + files.length
// // // // //     if (total > 10) {
// // // // //       alert('Maximum 10 images allowed.')
// // // // //       return
// // // // //     }
// // // // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // // //     setImageFiles((prev) => [...prev, ...files])
// // // // //   }

// // // // //   const removeImage = (index: number) => {
// // // // //     const updatedFiles = [...imageFiles]
// // // // //     updatedFiles.splice(index, 1)
// // // // //     setImageFiles(updatedFiles)
// // // // //     const updatedPreviews = [...imagePreviews]
// // // // //     URL.revokeObjectURL(updatedPreviews[index])
// // // // //     updatedPreviews.splice(index, 1)
// // // // //     setImagePreviews(updatedPreviews)
// // // // //   }

// // // // //   /* ---------- Submit ---------------------------------------------- */
// // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // //     e.preventDefault()

// // // // //     // --- Validation ---
// // // // //     const validSocialProfiles = socialProfiles.filter(
// // // // //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // // // //     )

// // // // //     if (!formData.email && validSocialProfiles.length === 0) {
// // // // //       setMessage({
// // // // //         type: 'error',
// // // // //         text: 'Please provide either an email address or at least one social profile/website.',
// // // // //       })
// // // // //       return
// // // // //     }

// // // // //     if (!formData.name) {
// // // // //       setMessage({ type: 'error', text: 'Your name is required.' })
// // // // //       return
// // // // //     }
// // // // //     if (!formData.location.trim()) {
// // // // //       setMessage({ type: 'error', text: 'Location is required (at least country).' })
// // // // //       return
// // // // //     }
// // // // //     if (!formData.description.trim()) {
// // // // //       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
// // // // //       return
// // // // //     }
// // // // //     if (imageFiles.length < 5) {
// // // // //       setMessage({ type: 'error', text: 'Please upload at least 5 images of your workspace.' })
// // // // //       return
// // // // //     }
// // // // //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// // // // //     if (validGearItems.length < 7) {
// // // // //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// // // // //       return
// // // // //     }
// // // // //     if (!formData.consent) {
// // // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // // //       return
// // // // //     }

// // // // //     setIsSubmitting(true)
// // // // //     setMessage(null)

// // // // //     try {
// // // // //       // Upload images
// // // // //       let uploadedImageUrls: string[] = []
// // // // //       if (imageFiles.length > 0) {
// // // // //         const uploadPromises = imageFiles.map((file) =>
// // // // //           uploadImage(file, 'submissions', 'user-uploads'),
// // // // //         )
// // // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // // //       }

// // // // //       // Gear data
// // // // //       const gearData = validGearItems.map(({ name, link }) => ({
// // // // //         name,
// // // // //         link: link.trim() || null,
// // // // //       }))

// // // // //       // Insert
// // // // //       const { error } = await supabase.from('submissions').insert({
// // // // //         email: formData.email || null,
// // // // //         name: formData.name,
// // // // //         intro: formData.intro || null,
// // // // //         location: formData.location,
// // // // //         social_profiles: validSocialProfiles,
// // // // //         image_urls: uploadedImageUrls,
// // // // //         video_link: formData.videoLink || null,
// // // // //         description: formData.description,
// // // // //         budget: formData.budget || null,
// // // // //         space_size: formData.spaceSize || null,
// // // // //         recent_addition: formData.recentAddition || null,
// // // // //         desired_change: formData.desiredChange || null,
// // // // //         favorite_item: formData.favoriteItem || null,
// // // // //         typical_day: formData.typicalDay || null,
// // // // //         productivity_trick: formData.productivityTrick || null,
// // // // //         creativity_spark: formData.creativitySpark || null,
// // // // //         cable_management: formData.cableManagement || null,
// // // // //         comfort_ergonomics: formData.comfortErgonomics || null,
// // // // //         home_office_why: formData.homeOfficeWhy || null,
// // // // //         work_life_balance: formData.workLifeBalance || null,
// // // // //         software_tools: formData.softwareTools || null,
// // // // //         gear_list: gearData,
// // // // //         consent: formData.consent,
// // // // //         newsletter: formData.newsletter,
// // // // //         status: 'pending',
// // // // //       })

// // // // //       if (error) throw error

// // // // //       setMessage({
// // // // //         type: 'success',
// // // // //         text: 'Submitted! We’ll review your workspace. ✨',
// // // // //       })

// // // // //       // Reset form
// // // // //       setFormData({
// // // // //         email: '',
// // // // //         name: '',
// // // // //         intro: '',
// // // // //         location: '',
// // // // //         description: '',
// // // // //         budget: '',
// // // // //         spaceSize: '',
// // // // //         recentAddition: '',
// // // // //         desiredChange: '',
// // // // //         favoriteItem: '',
// // // // //         typicalDay: '',
// // // // //         productivityTrick: '',
// // // // //         creativitySpark: '',
// // // // //         cableManagement: '',
// // // // //         comfortErgonomics: '',
// // // // //         homeOfficeWhy: '',
// // // // //         workLifeBalance: '',
// // // // //         softwareTools: '',
// // // // //         videoLink: '',
// // // // //         consent: false,
// // // // //         newsletter: false,
// // // // //       })
// // // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // // //       setGearItems(Array(7).fill({ name: '', link: '' }))
// // // // //       setImageFiles([])
// // // // //       setImagePreviews([])
// // // // //       setShowOptional(false)
// // // // //     } catch (err: any) {
// // // // //       console.error(err)
// // // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // // //     } finally {
// // // // //       setIsSubmitting(false)
// // // // //     }
// // // // //   }

// // // // //   /* ---------- Reusable UI helpers --------------------------------- */
// // // // //   const inputClass =
// // // // //     'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow'
// // // // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// // // // //   /* ---------- Render ---------------------------------------------- */
// // // // //   return (
// // // // //     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
// // // // //       <div className="max-w-4xl mx-auto">
// // // // //         {/* Header */}
// // // // //         <div className="text-center mb-12">
// // // // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // // // //             Show us your desk setup ✨
// // // // //           </h1>
// // // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // // // //             Fill out the form below for a chance to be featured. Required fields are marked with an asterisk (*).
// // // // //           </p>
// // // // //         </div>

// // // // //         {/* Form Card */}
// // // // //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
// // // // //           <form onSubmit={handleSubmit} className="space-y-10">

// // // // //             {/* ============================================= */}
// // // // //             {/* 1. ABOUT YOU                                  */}
// // // // //             {/* ============================================= */}
// // // // //             <section>
// // // // //               <div className="flex items-center gap-3 mb-6">
// // // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
// // // // //                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
// // // // //               </div>

// // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // // // //                 <div>
// // // // //                   <label htmlFor="name" className={labelClass}>Full name *</label>
// // // // //                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label htmlFor="email" className={labelClass}>Email address</label>
// // // // //                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
// // // // //                   <p className="text-xs text-gray-400 mt-1">Required only if no social profiles below</p>
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
// // // // //                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
// // // // //                 </div>
// // // // //                 <div className="md:col-span-2">
// // // // //                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
// // // // //                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
// // // // //                 </div>
// // // // //               </div>

// // // // //               {/* Social profiles / websites */}
// // // // //               <div className="mt-6">
// // // // //                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
// // // // //                 <p className="text-xs text-gray-400 mb-3">Add at least one if you don't provide an email above.</p>
// // // // //                 {socialProfiles.map((profile, index) => (
// // // // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // // // //                     <select
// // // // //                       value={profile.platform}
// // // // //                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// // // // //                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
// // // // //                     >
// // // // //                       <option value="">Select</option>
// // // // //                       {PLATFORM_OPTIONS.map((opt) => (
// // // // //                         <option key={opt} value={opt}>{opt}</option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     <input
// // // // //                       type="text"
// // // // //                       placeholder="Handle or URL"
// // // // //                       value={profile.handle}
// // // // //                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// // // // //                       className={`${inputClass} flex-1`}
// // // // //                     />
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={() => removeSocialRow(index)}
// // // // //                       disabled={socialProfiles.length === 1}
// // // // //                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // // // //                       title="Remove"
// // // // //                     >
// // // // //                       ✕
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 ))}
// // // // //                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
// // // // //                   + Add another profile
// // // // //                 </button>
// // // // //               </div>
// // // // //             </section>

// // // // //             {/* ============================================= */}
// // // // //             {/* 2. YOUR WORKSPACE (required)                   */}
// // // // //             {/* ============================================= */}
// // // // //             <section>
// // // // //               <div className="flex items-center gap-3 mb-6">
// // // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
// // // // //                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
// // // // //                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
// // // // //               </div>

// // // // //               <div className="mt-6">
// // // // //                 <label className={labelClass}>Upload images (at least 5) *</label>
// // // // //                 <div className="flex items-center gap-4 flex-wrap">
// // // // //                   <input
// // // // //                     type="file"
// // // // //                     multiple
// // // // //                     accept="image/*"
// // // // //                     onChange={handleImageSelect}
// // // // //                     className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
// // // // //                   />
// // // // //                   <span className="text-xs text-gray-400">
// // // // //                     {imageFiles.length}/5 minimum
// // // // //                   </span>
// // // // //                 </div>
// // // // //                 {imagePreviews.length > 0 && (
// // // // //                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
// // // // //                     {imagePreviews.map((preview, idx) => (
// // // // //                       <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
// // // // //                         <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
// // // // //                         <button
// // // // //                           type="button"
// // // // //                           onClick={() => removeImage(idx)}
// // // // //                           className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
// // // // //                         >
// // // // //                           ✕
// // // // //                         </button>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div className="mt-5">
// // // // //                 <label htmlFor="videoLink" className={labelClass}>Video link (optional)</label>
// // // // //                 <input id="videoLink" type="url" value={formData.videoLink} onChange={handleInputChange} placeholder="YouTube, Vimeo, etc." className={inputClass} />
// // // // //               </div>

// // // // //               {/* Gear list */}
// // // // //               <div className="mt-6">
// // // // //                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
// // // // //                 <p className="text-xs text-gray-400 mb-4">List every major item. You can add an affiliate or product link (optional).</p>
// // // // //                 <div className="space-y-3">
// // // // //                   {gearItems.map((item, index) => (
// // // // //                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// // // // //                       <div className="flex-1 w-full">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
// // // // //                           value={item.name}
// // // // //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// // // // //                           className={inputClass}
// // // // //                         />
// // // // //                       </div>
// // // // //                       <div className="flex-1 sm:flex-[0.4] w-full">
// // // // //                         <input
// // // // //                           type="url"
// // // // //                           placeholder="Link (optional)"
// // // // //                           value={item.link}
// // // // //                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
// // // // //                           className={`${inputClass} text-xs`}
// // // // //                         />
// // // // //                       </div>
// // // // //                       <button
// // // // //                         type="button"
// // // // //                         onClick={() => removeGearRow(index)}
// // // // //                         disabled={gearItems.length <= 7}
// // // // //                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // // // //                         title="Remove"
// // // // //                       >
// // // // //                         ✕
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   ))}
// // // // //                 </div>
// // // // //                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
// // // // //                   + Add another item
// // // // //                 </button>
// // // // //               </div>
// // // // //             </section>

// // // // //             {/* ============================================= */}
// // // // //             {/* 3. OPTIONAL DETAILS – now a single expandable block */}
// // // // //             {/* ============================================= */}
// // // // //             <section>
// // // // //               <div className="flex items-center gap-3 mb-6">
// // // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
// // // // //                 <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
// // // // //                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
// // // // //               </div>

// // // // //               {!showOptional ? (
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={() => setShowOptional(true)}
// // // // //                   className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
// // // // //                 >
// // // // //                   <div>
// // // // //                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
// // // // //                     <p className="text-xs text-gray-500 mt-0.5">Routine, gear story, ergonomics, software…</p>
// // // // //                   </div>
// // // // //                   <span className="text-gray-400 text-lg">+</span>
// // // // //                 </button>
// // // // //               ) : (
// // // // //                 <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
// // // // //                   {/* Setup story & details */}
// // // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Setup Story & Details</h3>
// // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //                       <div>
// // // // //                         <label htmlFor="budget" className={labelClass}>Approximate budget</label>
// // // // //                         <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="spaceSize" className={labelClass}>Space size</label>
// // // // //                         <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// // // // //                       <div>
// // // // //                         <label htmlFor="favoriteItem" className={labelClass}>Favorite item</label>
// // // // //                         <input id="favoriteItem" value={formData.favoriteItem} onChange={handleInputChange} placeholder="My mechanical keyboard" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="recentAddition" className={labelClass}>Most recent addition</label>
// // // // //                         <input id="recentAddition" value={formData.recentAddition} onChange={handleInputChange} placeholder="New monitor light bar" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="desiredChange" className={labelClass}>One change you’d like to make</label>
// // // // //                         <input id="desiredChange" value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management" className={inputClass} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>

// // // // //                   {/* Routine & productivity */}
// // // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Routine & Productivity</h3>
// // // // //                     <div className="space-y-4">
// // // // //                       <div>
// // // // //                         <label htmlFor="typicalDay" className={labelClass}>Typical day</label>
// // // // //                         <textarea id="typicalDay" rows={3} value={formData.typicalDay} onChange={handleInputChange} placeholder="Morning coffee, deep work, evening wrap-up…" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="productivityTrick" className={labelClass}>Productivity trick that works</label>
// // // // //                         <input id="productivityTrick" value={formData.productivityTrick} onChange={handleInputChange} placeholder="Time blocking with a physical timer" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="creativitySpark" className={labelClass}>How do you spark creativity?</label>
// // // // //                         <input id="creativitySpark" value={formData.creativitySpark} onChange={handleInputChange} placeholder="A walk without my phone" className={inputClass} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>

// // // // //                   {/* Comfort & Ergonomics */}
// // // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Comfort, Ergonomics & Balance</h3>
// // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //                       <div>
// // // // //                         <label htmlFor="cableManagement" className={labelClass}>Cable management</label>
// // // // //                         <input id="cableManagement" value={formData.cableManagement} onChange={handleInputChange} placeholder="Under-desk trays and velcro straps" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="comfortErgonomics" className={labelClass}>Comfort & ergonomics</label>
// // // // //                         <input id="comfortErgonomics" value={formData.comfortErgonomics} onChange={handleInputChange} placeholder="Standing desk, ergonomic chair" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="homeOfficeWhy" className={labelClass}>Why this room?</label>
// // // // //                         <input id="homeOfficeWhy" value={formData.homeOfficeWhy} onChange={handleInputChange} placeholder="Spare bedroom for natural light" className={inputClass} />
// // // // //                       </div>
// // // // //                       <div>
// // // // //                         <label htmlFor="workLifeBalance" className={labelClass}>Work-life balance</label>
// // // // //                         <input id="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} placeholder="Shutdown ritual at 6pm" className={inputClass} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>

// // // // //                   {/* Software & tools */}
// // // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Software & Tools</h3>
// // // // //                     <div>
// // // // //                       <label htmlFor="softwareTools" className={labelClass}>Software / tools you use daily</label>
// // // // //                       <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify..." className={inputClass} />
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               )}
// // // // //             </section>

// // // // //             {/* ============================================= */}
// // // // //             {/* 4. CONSENT & SUBMIT                            */}
// // // // //             {/* ============================================= */}
// // // // //             <section className="border-t border-gray-200 pt-6">
// // // // //               <div className="space-y-4">
// // // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // // //                   <input
// // // // //                     type="checkbox"
// // // // //                     id="consent"
// // // // //                     checked={formData.consent}
// // // // //                     onChange={handleInputChange}
// // // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // //                   />
// // // // //                   <span className="text-sm text-gray-700">
// // // // //                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
// // // // //                   </span>
// // // // //                 </label>
// // // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // // //                   <input
// // // // //                     type="checkbox"
// // // // //                     id="newsletter"
// // // // //                     checked={formData.newsletter}
// // // // //                     onChange={handleInputChange}
// // // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // // //                   />
// // // // //                   <span className="text-sm text-gray-700">
// // // // //                     Send me updates, featured setups, and community news.
// // // // //                   </span>
// // // // //                 </label>
// // // // //               </div>

// // // // //               <button
// // // // //                 type="submit"
// // // // //                 disabled={isSubmitting}
// // // // //                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
// // // // //               >
// // // // //                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // // //               </button>

// // // // //               {message && (
// // // // //                 <div
// // // // //                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
// // // // //                     message.type === 'success'
// // // // //                       ? 'bg-green-50 border-green-200 text-green-700'
// // // // //                       : 'bg-red-50 border-red-200 text-red-700'
// // // // //                   }`}
// // // // //                 >
// // // // //                   {message.text}
// // // // //                 </div>
// // // // //               )}
// // // // //             </section>
// // // // //           </form>
// // // // //         </div>
// // // // //       </div>
// // // // //     </section>
// // // // //   )
// // // // // }






































// // // // 'use client'

// // // // import { useState, useRef } from 'react'
// // // // import { createClient } from '@/lib/supabase/client'
// // // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // // /* ------------------------------------------------------------------ */
// // // // /*  Types & Constants                                                 */
// // // // /* ------------------------------------------------------------------ */
// // // // type SocialProfile = {
// // // //   platform: string
// // // //   handle: string
// // // // }

// // // // type GearItem = {
// // // //   name: string
// // // //   link: string
// // // // }

// // // // const PLATFORM_OPTIONS = [
// // // //   'GitHub',
// // // //   'Twitter / X',
// // // //   'Instagram',
// // // //   'LinkedIn',
// // // //   'YouTube',
// // // //   'Behance',
// // // //   'Dribbble',
// // // //   'Personal Website',
// // // //   'Other',
// // // // ]

// // // // /* ------------------------------------------------------------------ */
// // // // /*  Component                                                         */
// // // // /* ------------------------------------------------------------------ */
// // // // export default function SubmitForm() {
// // // //   const supabase = createClient()
// // // //   const optionalRef = useRef<HTMLDivElement>(null)

// // // //   /* --- Form state -------------------------------------------------- */
// // // //   const [formData, setFormData] = useState({
// // // //     email: '',
// // // //     name: '',
// // // //     intro: '',
// // // //     location: '',              // City, State, Country
// // // //     description: '',           // story behind desk setup (required)
// // // //     budget: '',
// // // //     spaceSize: '',
// // // //     recentAddition: '',
// // // //     desiredChange: '',
// // // //     favoriteItem: '',
// // // //     typicalDay: '',
// // // //     productivityTrick: '',
// // // //     creativitySpark: '',
// // // //     cableManagement: '',
// // // //     comfortErgonomics: '',
// // // //     homeOfficeWhy: '',
// // // //     workLifeBalance: '',
// // // //     softwareTools: '',
// // // //     videoLink: '',
// // // //     consent: false,
// // // //     newsletter: false,
// // // //   })

// // // //   /* --- Dynamic social profiles ------------------------------------ */
// // // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // // //     { platform: '', handle: '' },
// // // //   ])

// // // //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// // // //   const [gearItems, setGearItems] = useState<GearItem[]>(
// // // //     Array(7).fill({ name: '', link: '' })
// // // //   )

// // // //   /* --- Image uploads ---------------------------------------------- */
// // // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // // //   /* --- Optional details visibility -------------------------------- */
// // // //   const [showOptional, setShowOptional] = useState(false)

// // // //   /* ---------- Handlers -------------------------------------------- */
// // // //   const handleInputChange = (
// // // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // // //   ) => {
// // // //     const { id, value, type } = e.target
// // // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // // //   }

// // // //   /* Social profiles */
// // // //   const handleSocialChange = (
// // // //     index: number,
// // // //     field: 'platform' | 'handle',
// // // //     value: string,
// // // //   ) => {
// // // //     const updated = [...socialProfiles]
// // // //     updated[index][field] = value
// // // //     setSocialProfiles(updated)
// // // //   }

// // // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // // //   const removeSocialRow = (index: number) => {
// // // //     if (socialProfiles.length === 1) return
// // // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // // //   }

// // // //   /* Gear list */
// // // //   const handleGearNameChange = (index: number, name: string) => {
// // // //     const updated = [...gearItems]
// // // //     updated[index] = { ...updated[index], name }
// // // //     setGearItems(updated)
// // // //   }

// // // //   const handleGearLinkChange = (index: number, link: string) => {
// // // //     const updated = [...gearItems]
// // // //     updated[index] = { ...updated[index], link }
// // // //     setGearItems(updated)
// // // //   }

// // // //   const addGearRow = () => {
// // // //     setGearItems([...gearItems, { name: '', link: '' }])
// // // //   }

// // // //   const removeGearRow = (index: number) => {
// // // //     if (gearItems.length <= 7) return
// // // //     setGearItems(gearItems.filter((_, i) => i !== index))
// // // //   }

// // // //   /* Image upload */
// // // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const files = Array.from(e.target.files || [])
// // // //     if (!files.length) return
// // // //     const total = imageFiles.length + files.length
// // // //     if (total > 10) {
// // // //       alert('Maximum 10 images allowed.')
// // // //       return
// // // //     }
// // // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // // //     setImageFiles((prev) => [...prev, ...files])
// // // //   }

// // // //   const removeImage = (index: number) => {
// // // //     const updatedFiles = [...imageFiles]
// // // //     updatedFiles.splice(index, 1)
// // // //     setImageFiles(updatedFiles)
// // // //     const updatedPreviews = [...imagePreviews]
// // // //     URL.revokeObjectURL(updatedPreviews[index])
// // // //     updatedPreviews.splice(index, 1)
// // // //     setImagePreviews(updatedPreviews)
// // // //   }

// // // //   /* ---------- Submit ---------------------------------------------- */
// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault()

// // // //     // If optional section is hidden, open it and scroll there
// // // //     if (!showOptional) {
// // // //       setShowOptional(true)
// // // //       setTimeout(() => {
// // // //         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
// // // //       }, 100)
// // // //       return
// // // //     }

// // // //     // --- Validation ---
// // // //     const validSocialProfiles = socialProfiles.filter(
// // // //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // // //     )

// // // //     if (!formData.email && validSocialProfiles.length === 0) {
// // // //       setMessage({
// // // //         type: 'error',
// // // //         text: 'Please provide either an email address or at least one social profile/website.',
// // // //       })
// // // //       return
// // // //     }

// // // //     if (!formData.name) {
// // // //       setMessage({ type: 'error', text: 'Your name is required.' })
// // // //       return
// // // //     }
// // // //     if (!formData.location.trim()) {
// // // //       setMessage({ type: 'error', text: 'Location is required (at least country).' })
// // // //       return
// // // //     }
// // // //     if (!formData.description.trim()) {
// // // //       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
// // // //       return
// // // //     }
// // // //     if (imageFiles.length < 5) {
// // // //       setMessage({ type: 'error', text: 'Please upload at least 5 images of your workspace.' })
// // // //       return
// // // //     }
// // // //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// // // //     if (validGearItems.length < 7) {
// // // //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// // // //       return
// // // //     }
// // // //     if (!formData.consent) {
// // // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // // //       return
// // // //     }

// // // //     setIsSubmitting(true)
// // // //     setMessage(null)

// // // //     try {
// // // //       // Upload images
// // // //       let uploadedImageUrls: string[] = []
// // // //       if (imageFiles.length > 0) {
// // // //         const uploadPromises = imageFiles.map((file) =>
// // // //           uploadImage(file, 'submissions', 'user-uploads'),
// // // //         )
// // // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // // //       }

// // // //       // Gear data
// // // //       const gearData = validGearItems.map(({ name, link }) => ({
// // // //         name,
// // // //         link: link.trim() || null,
// // // //       }))

// // // //       // Insert
// // // //       const { error } = await supabase.from('submissions').insert({
// // // //         email: formData.email || null,
// // // //         name: formData.name,
// // // //         intro: formData.intro || null,
// // // //         location: formData.location,
// // // //         social_profiles: validSocialProfiles,
// // // //         image_urls: uploadedImageUrls,
// // // //         video_link: formData.videoLink || null,
// // // //         description: formData.description,
// // // //         budget: formData.budget || null,
// // // //         space_size: formData.spaceSize || null,
// // // //         recent_addition: formData.recentAddition || null,
// // // //         desired_change: formData.desiredChange || null,
// // // //         favorite_item: formData.favoriteItem || null,
// // // //         typical_day: formData.typicalDay || null,
// // // //         productivity_trick: formData.productivityTrick || null,
// // // //         creativity_spark: formData.creativitySpark || null,
// // // //         cable_management: formData.cableManagement || null,
// // // //         comfort_ergonomics: formData.comfortErgonomics || null,
// // // //         home_office_why: formData.homeOfficeWhy || null,
// // // //         work_life_balance: formData.workLifeBalance || null,
// // // //         software_tools: formData.softwareTools || null,
// // // //         gear_list: gearData,
// // // //         consent: formData.consent,
// // // //         newsletter: formData.newsletter,
// // // //         status: 'pending',
// // // //       })

// // // //       if (error) throw error

// // // //       setMessage({
// // // //         type: 'success',
// // // //         text: 'Submitted! We’ll review your workspace. ✨',
// // // //       })

// // // //       // Reset form
// // // //       setFormData({
// // // //         email: '',
// // // //         name: '',
// // // //         intro: '',
// // // //         location: '',
// // // //         description: '',
// // // //         budget: '',
// // // //         spaceSize: '',
// // // //         recentAddition: '',
// // // //         desiredChange: '',
// // // //         favoriteItem: '',
// // // //         typicalDay: '',
// // // //         productivityTrick: '',
// // // //         creativitySpark: '',
// // // //         cableManagement: '',
// // // //         comfortErgonomics: '',
// // // //         homeOfficeWhy: '',
// // // //         workLifeBalance: '',
// // // //         softwareTools: '',
// // // //         videoLink: '',
// // // //         consent: false,
// // // //         newsletter: false,
// // // //       })
// // // //       setSocialProfiles([{ platform: '', handle: '' }])
// // // //       setGearItems(Array(7).fill({ name: '', link: '' }))
// // // //       setImageFiles([])
// // // //       setImagePreviews([])
// // // //       setShowOptional(false)
// // // //     } catch (err: any) {
// // // //       console.error(err)
// // // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // // //     } finally {
// // // //       setIsSubmitting(false)
// // // //     }
// // // //   }

// // // //   /* ---------- Reusable UI helpers --------------------------------- */
// // // //   const inputClass =
// // // //     'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow'
// // // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// // // //   /* ---------- Render ---------------------------------------------- */
// // // //   return (
// // // //     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
// // // //       <div className="max-w-4xl mx-auto">
// // // //         {/* Header */}
// // // //         <div className="text-center mb-12">
// // // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // // //             Show us your desk setup ✨
// // // //           </h1>
// // // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // // //             Fill out the form below for a chance to be featured. Required fields are marked with an asterisk (*).
// // // //           </p>
// // // //         </div>

// // // //         {/* Form Card */}
// // // //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
// // // //           <form onSubmit={handleSubmit} className="space-y-10">
// // // //             {/* ============================================= */}
// // // //             {/* 1. ABOUT YOU                                  */}
// // // //             {/* ============================================= */}
// // // //             <section>
// // // //               <div className="flex items-center gap-3 mb-6">
// // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
// // // //                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
// // // //               </div>

// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // // //                 <div>
// // // //                   <label htmlFor="name" className={labelClass}>Full name *</label>
// // // //                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label htmlFor="email" className={labelClass}>Email address</label>
// // // //                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
// // // //                   <p className="text-xs text-gray-400 mt-1">Required only if no social profiles below</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
// // // //                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
// // // //                 </div>
// // // //                 <div className="md:col-span-2">
// // // //                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
// // // //                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
// // // //                 </div>
// // // //               </div>

// // // //               {/* Social profiles / websites */}
// // // //               <div className="mt-6">
// // // //                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
// // // //                 <p className="text-xs text-gray-400 mb-3">Add at least one if you don't provide an email above.</p>
// // // //                 {socialProfiles.map((profile, index) => (
// // // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // // //                     <select
// // // //                       value={profile.platform}
// // // //                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// // // //                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
// // // //                     >
// // // //                       <option value="">Select</option>
// // // //                       {PLATFORM_OPTIONS.map((opt) => (
// // // //                         <option key={opt} value={opt}>{opt}</option>
// // // //                       ))}
// // // //                     </select>
// // // //                     <input
// // // //                       type="text"
// // // //                       placeholder="Handle or URL"
// // // //                       value={profile.handle}
// // // //                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// // // //                       className={`${inputClass} flex-1`}
// // // //                     />
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => removeSocialRow(index)}
// // // //                       disabled={socialProfiles.length === 1}
// // // //                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // // //                       title="Remove"
// // // //                     >
// // // //                       ✕
// // // //                     </button>
// // // //                   </div>
// // // //                 ))}
// // // //                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
// // // //                   + Add another profile
// // // //                 </button>
// // // //               </div>
// // // //             </section>

// // // //             {/* ============================================= */}
// // // //             {/* 2. YOUR WORKSPACE (required)                   */}
// // // //             {/* ============================================= */}
// // // //             <section>
// // // //               <div className="flex items-center gap-3 mb-6">
// // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
// // // //                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
// // // //               </div>

// // // //               <div>
// // // //                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
// // // //                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
// // // //               </div>

// // // //               <div className="mt-6">
// // // //                 <label className={labelClass}>Upload images (at least 5) *</label>
// // // //                 <div className="flex items-center gap-4 flex-wrap">
// // // //                   <input
// // // //                     type="file"
// // // //                     multiple
// // // //                     accept="image/*"
// // // //                     onChange={handleImageSelect}
// // // //                     className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
// // // //                   />
// // // //                   <span className="text-xs text-gray-400">
// // // //                     {imageFiles.length}/5 minimum
// // // //                   </span>
// // // //                 </div>
// // // //                 {imagePreviews.length > 0 && (
// // // //                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
// // // //                     {imagePreviews.map((preview, idx) => (
// // // //                       <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
// // // //                         <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => removeImage(idx)}
// // // //                           className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
// // // //                         >
// // // //                           ✕
// // // //                         </button>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               <div className="mt-5">
// // // //                 <label htmlFor="videoLink" className={labelClass}>Video link (optional)</label>
// // // //                 <input id="videoLink" type="url" value={formData.videoLink} onChange={handleInputChange} placeholder="YouTube, Vimeo, etc." className={inputClass} />
// // // //               </div>

// // // //               {/* Gear list */}
// // // //               <div className="mt-6">
// // // //                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
// // // //                 <p className="text-xs text-gray-400 mb-4">List every major item. You can add an affiliate or product link (optional).</p>
// // // //                 <div className="space-y-3">
// // // //                   {gearItems.map((item, index) => (
// // // //                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// // // //                       <div className="flex-1 w-full">
// // // //                         <input
// // // //                           type="text"
// // // //                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
// // // //                           value={item.name}
// // // //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// // // //                           className={inputClass}
// // // //                         />
// // // //                       </div>
// // // //                       <div className="flex-1 sm:flex-[0.4] w-full">
// // // //                         <input
// // // //                           type="url"
// // // //                           placeholder="Link (optional)"
// // // //                           value={item.link}
// // // //                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
// // // //                           className={`${inputClass} text-xs`}
// // // //                         />
// // // //                       </div>
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={() => removeGearRow(index)}
// // // //                         disabled={gearItems.length <= 7}
// // // //                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // // //                         title="Remove"
// // // //                       >
// // // //                         ✕
// // // //                       </button>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
// // // //                   + Add another item
// // // //                 </button>
// // // //               </div>
// // // //             </section>

// // // //             {/* ============================================= */}
// // // //             {/* 3. MORE ABOUT YOUR SETUP (optional)           */}
// // // //             {/* ============================================= */}
// // // //             <section ref={optionalRef}>
// // // //               <div className="flex items-center gap-3 mb-6">
// // // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
// // // //                 <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
// // // //                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
// // // //               </div>

// // // //               {!showOptional ? (
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setShowOptional(true)}
// // // //                   className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
// // // //                 >
// // // //                   <div>
// // // //                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
// // // //                     <p className="text-xs text-gray-500 mt-0.5">Routine, gear story, ergonomics, software…</p>
// // // //                   </div>
// // // //                   <span className="text-gray-400 text-lg">+</span>
// // // //                 </button>
// // // //               ) : (
// // // //                 <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
// // // //                   {/* Setup story & details */}
// // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Setup Story & Details</h3>
// // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                       <div>
// // // //                         <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
// // // //                         <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
// // // //                         <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// // // //                       <div>
// // // //                         <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
// // // //                         <textarea id="favoriteItem" rows={2} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
// // // //                         <textarea id="recentAddition" rows={2} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
// // // //                         <textarea id="desiredChange" rows={2} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>

// // // //                   {/* Routine & productivity */}
// // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Routine & Productivity</h3>
// // // //                     <div className="space-y-4">
// // // //                       <div>
// // // //                         <label htmlFor="typicalDay" className={labelClass}>What does a typical day at your desk look like?</label>
// // // //                         <textarea id="typicalDay" rows={3} value={formData.typicalDay} onChange={handleInputChange} placeholder="Walk us through your morning routine…" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="productivityTrick" className={labelClass}>What’s one productivity trick that actually works for you?</label>
// // // //                         <textarea id="productivityTrick" rows={2} value={formData.productivityTrick} onChange={handleInputChange} placeholder="Time blocking, Pomodoro, etc." className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="creativitySpark" className={labelClass}>How do you spark creativity when you feel stuck?</label>
// // // //                         <textarea id="creativitySpark" rows={2} value={formData.creativitySpark} onChange={handleInputChange} placeholder="A walk, music, changing lighting…" className={inputClass} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>

// // // //                   {/* Comfort & Ergonomics */}
// // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Comfort, Ergonomics & Balance</h3>
// // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                       <div>
// // // //                         <label htmlFor="cableManagement" className={labelClass}>How have you conquered cable management?</label>
// // // //                         <textarea id="cableManagement" rows={2} value={formData.cableManagement} onChange={handleInputChange} placeholder="Under-desk trays, velcro…" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="comfortErgonomics" className={labelClass}>What have you done for comfort and ergonomics?</label>
// // // //                         <textarea id="comfortErgonomics" rows={2} value={formData.comfortErgonomics} onChange={handleInputChange} placeholder="Standing desk, ergo chair…" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="homeOfficeWhy" className={labelClass}>Where is your home office and why did you choose that spot?</label>
// // // //                         <textarea id="homeOfficeWhy" rows={2} value={formData.homeOfficeWhy} onChange={handleInputChange} placeholder="Spare bedroom for natural light…" className={inputClass} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label htmlFor="workLifeBalance" className={labelClass}>How do you keep your work-life balance in check?</label>
// // // //                         <textarea id="workLifeBalance" rows={2} value={formData.workLifeBalance} onChange={handleInputChange} placeholder="Shutdown ritual at 6pm…" className={inputClass} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>

// // // //                   {/* Software & tools */}
// // // //                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
// // // //                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Software & Tools</h3>
// // // //                     <div>
// // // //                       <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
// // // //                       <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass} />
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </section>

// // // //             {/* ============================================= */}
// // // //             {/* 4. CONSENT & SUBMIT                            */}
// // // //             {/* ============================================= */}
// // // //             <section className="border-t border-gray-200 pt-6">
// // // //               <div className="space-y-4">
// // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     id="consent"
// // // //                     checked={formData.consent}
// // // //                     onChange={handleInputChange}
// // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // //                   />
// // // //                   <span className="text-sm text-gray-700">
// // // //                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
// // // //                   </span>
// // // //                 </label>
// // // //                 <label className="flex items-start gap-3 cursor-pointer">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     id="newsletter"
// // // //                     checked={formData.newsletter}
// // // //                     onChange={handleInputChange}
// // // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // // //                   />
// // // //                   <span className="text-sm text-gray-700">
// // // //                     Send me updates, featured setups, and community news.
// // // //                   </span>
// // // //                 </label>
// // // //               </div>

// // // //               <button
// // // //                 type="submit"
// // // //                 disabled={isSubmitting}
// // // //                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
// // // //               >
// // // //                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // // //               </button>

// // // //               {message && (
// // // //                 <div
// // // //                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
// // // //                     message.type === 'success'
// // // //                       ? 'bg-green-50 border-green-200 text-green-700'
// // // //                       : 'bg-red-50 border-red-200 text-red-700'
// // // //                   }`}
// // // //                 >
// // // //                   {message.text}
// // // //                 </div>
// // // //               )}
// // // //             </section>
// // // //           </form>
// // // //         </div>
// // // //       </div>
// // // //     </section>
// // // //   )
// // // // }
































// // // 'use client'

// // // import { useState, useRef } from 'react'
// // // import { createClient } from '@/lib/supabase/client'
// // // import { uploadImage } from '@/lib/utils/supabase-uploads'

// // // /* ------------------------------------------------------------------ */
// // // /*  Types & Constants                                                 */
// // // /* ------------------------------------------------------------------ */
// // // type SocialProfile = {
// // //   platform: string
// // //   handle: string
// // // }

// // // type GearItem = {
// // //   name: string
// // //   link: string
// // // }

// // // const PLATFORM_OPTIONS = [
// // //   'GitHub',
// // //   'Twitter / X',
// // //   'Instagram',
// // //   'LinkedIn',
// // //   'YouTube',
// // //   'Behance',
// // //   'Dribbble',
// // //   'Personal Website',
// // //   'Other',
// // // ]

// // // /* ------------------------------------------------------------------ */
// // // /*  Component                                                         */
// // // /* ------------------------------------------------------------------ */
// // // export default function SubmitForm() {
// // //   const supabase = createClient()
// // //   const optionalRef = useRef<HTMLDivElement>(null)

// // //   /* --- Form state (trimmed optional fields) ----------------------- */
// // //   const [formData, setFormData] = useState({
// // //     email: '',
// // //     name: '',
// // //     intro: '',
// // //     location: '',              // City, State, Country
// // //     description: '',           // story behind desk setup (required)
// // //     budget: '',
// // //     spaceSize: '',
// // //     favoriteItem: '',
// // //     recentAddition: '',
// // //     desiredChange: '',
// // //     comfortCable: '',
// // //     decorativeTouches: '',
// // //     softwareTools: '',
// // //     videoLink: '',
// // //     consent: false,
// // //     newsletter: false,
// // //   })

// // //   /* --- Dynamic social profiles ------------------------------------ */
// // //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// // //     { platform: '', handle: '' },
// // //   ])

// // //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// // //   const [gearItems, setGearItems] = useState<GearItem[]>(
// // //     Array(7).fill({ name: '', link: '' })
// // //   )

// // //   /* --- Image uploads ---------------------------------------------- */
// // //   const [imageFiles, setImageFiles] = useState<File[]>([])
// // //   const [imagePreviews, setImagePreviews] = useState<string[]>([])
// // //   const [isSubmitting, setIsSubmitting] = useState(false)
// // //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// // //   /* --- Optional details visibility -------------------------------- */
// // //   const [showOptional, setShowOptional] = useState(false)

// // //   /* ---------- Handlers -------------------------------------------- */
// // //   const handleInputChange = (
// // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// // //   ) => {
// // //     const { id, value, type } = e.target
// // //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// // //     setFormData((prev) => ({ ...prev, [id]: val }))
// // //   }

// // //   /* Social profiles */
// // //   const handleSocialChange = (
// // //     index: number,
// // //     field: 'platform' | 'handle',
// // //     value: string,
// // //   ) => {
// // //     const updated = [...socialProfiles]
// // //     updated[index][field] = value
// // //     setSocialProfiles(updated)
// // //   }

// // //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// // //   const removeSocialRow = (index: number) => {
// // //     if (socialProfiles.length === 1) return
// // //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// // //   }

// // //   /* Gear list */
// // //   const handleGearNameChange = (index: number, name: string) => {
// // //     const updated = [...gearItems]
// // //     updated[index] = { ...updated[index], name }
// // //     setGearItems(updated)
// // //   }

// // //   const handleGearLinkChange = (index: number, link: string) => {
// // //     const updated = [...gearItems]
// // //     updated[index] = { ...updated[index], link }
// // //     setGearItems(updated)
// // //   }

// // //   const addGearRow = () => {
// // //     setGearItems([...gearItems, { name: '', link: '' }])
// // //   }

// // //   const removeGearRow = (index: number) => {
// // //     if (gearItems.length <= 7) return
// // //     setGearItems(gearItems.filter((_, i) => i !== index))
// // //   }

// // //   /* Image upload */
// // //   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const files = Array.from(e.target.files || [])
// // //     if (!files.length) return
// // //     const total = imageFiles.length + files.length
// // //     if (total > 10) {
// // //       alert('Maximum 10 images allowed.')
// // //       return
// // //     }
// // //     const newPreviews = files.map((f) => URL.createObjectURL(f))
// // //     setImagePreviews((prev) => [...prev, ...newPreviews])
// // //     setImageFiles((prev) => [...prev, ...files])
// // //   }

// // //   const removeImage = (index: number) => {
// // //     const updatedFiles = [...imageFiles]
// // //     updatedFiles.splice(index, 1)
// // //     setImageFiles(updatedFiles)
// // //     const updatedPreviews = [...imagePreviews]
// // //     URL.revokeObjectURL(updatedPreviews[index])
// // //     updatedPreviews.splice(index, 1)
// // //     setImagePreviews(updatedPreviews)
// // //   }

// // //   /* ---------- Submit ---------------------------------------------- */
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()

// // //     // If optional section is hidden, open it and scroll
// // //     if (!showOptional) {
// // //       setShowOptional(true)
// // //       setTimeout(() => {
// // //         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
// // //       }, 100)
// // //       return
// // //     }

// // //     // --- Validation ---
// // //     const validSocialProfiles = socialProfiles.filter(
// // //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// // //     )

// // //     if (!formData.email && validSocialProfiles.length === 0) {
// // //       setMessage({
// // //         type: 'error',
// // //         text: 'Please provide either an email address or at least one social profile/website.',
// // //       })
// // //       return
// // //     }

// // //     if (!formData.name) {
// // //       setMessage({ type: 'error', text: 'Your name is required.' })
// // //       return
// // //     }
// // //     if (!formData.location.trim()) {
// // //       setMessage({ type: 'error', text: 'Location is required (at least country).' })
// // //       return
// // //     }
// // //     if (!formData.description.trim()) {
// // //       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
// // //       return
// // //     }
// // //     if (imageFiles.length < 5) {
// // //       setMessage({ type: 'error', text: 'Please upload at least 5 images of your workspace.' })
// // //       return
// // //     }
// // //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// // //     if (validGearItems.length < 7) {
// // //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// // //       return
// // //     }
// // //     if (!formData.consent) {
// // //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// // //       return
// // //     }

// // //     setIsSubmitting(true)
// // //     setMessage(null)

// // //     try {
// // //       // Upload images
// // //       let uploadedImageUrls: string[] = []
// // //       if (imageFiles.length > 0) {
// // //         const uploadPromises = imageFiles.map((file) =>
// // //           uploadImage(file, 'submissions', 'user-uploads'),
// // //         )
// // //         uploadedImageUrls = await Promise.all(uploadPromises)
// // //       }

// // //       // Gear data
// // //       const gearData = validGearItems.map(({ name, link }) => ({
// // //         name,
// // //         link: link.trim() || null,
// // //       }))

// // //       // Insert (trimmed fields)
// // //       const { error } = await supabase.from('submissions').insert({
// // //         email: formData.email || null,
// // //         name: formData.name,
// // //         intro: formData.intro || null,
// // //         location: formData.location,
// // //         social_profiles: validSocialProfiles,
// // //         image_urls: uploadedImageUrls,
// // //         video_link: formData.videoLink || null,
// // //         description: formData.description,
// // //         budget: formData.budget || null,
// // //         space_size: formData.spaceSize || null,
// // //         favorite_item: formData.favoriteItem || null,
// // //         recent_addition: formData.recentAddition || null,
// // //         desired_change: formData.desiredChange || null,
// // //         comfort_cable: formData.comfortCable || null,
// // //         decorative_touches: formData.decorativeTouches || null,
// // //         software_tools: formData.softwareTools || null,
// // //         gear_list: gearData,
// // //         consent: formData.consent,
// // //         newsletter: formData.newsletter,
// // //         status: 'pending',
// // //       })

// // //       if (error) throw error

// // //       setMessage({
// // //         type: 'success',
// // //         text: 'Submitted! We’ll review your workspace. ✨',
// // //       })

// // //       // Reset form
// // //       setFormData({
// // //         email: '',
// // //         name: '',
// // //         intro: '',
// // //         location: '',
// // //         description: '',
// // //         budget: '',
// // //         spaceSize: '',
// // //         favoriteItem: '',
// // //         recentAddition: '',
// // //         desiredChange: '',
// // //         comfortCable: '',
// // //         decorativeTouches: '',
// // //         softwareTools: '',
// // //         videoLink: '',
// // //         consent: false,
// // //         newsletter: false,
// // //       })
// // //       setSocialProfiles([{ platform: '', handle: '' }])
// // //       setGearItems(Array(7).fill({ name: '', link: '' }))
// // //       setImageFiles([])
// // //       setImagePreviews([])
// // //       setShowOptional(false)
// // //     } catch (err: any) {
// // //       console.error(err)
// // //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// // //     } finally {
// // //       setIsSubmitting(false)
// // //     }
// // //   }

// // //   /* ---------- Reusable UI helpers --------------------------------- */
// // //   const inputClass =
// // //     'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow'
// // //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'
// // //   const subHeadingClass = 'text-sm font-semibold text-gray-700 pt-2 first:pt-0 border-t border-gray-100 first:border-t-0 mt-6 first:mt-0 mb-4'

// // //   /* ---------- Render ---------------------------------------------- */
// // //   return (
// // //     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
// // //       <div className="max-w-4xl mx-auto">
// // //         {/* Header */}
// // //         <div className="text-center mb-12">
// // //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// // //             Show us your desk setup ✨
// // //           </h1>
// // //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// // //             Fill out the form below for a chance to be featured. Required fields are marked with an asterisk (*).
// // //           </p>
// // //         </div>

// // //         {/* Form Card */}
// // //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
// // //           <form onSubmit={handleSubmit} className="space-y-10">

// // //             {/* ============================================= */}
// // //             {/* 1. ABOUT YOU                                  */}
// // //             {/* ============================================= */}
// // //             <section>
// // //               <div className="flex items-center gap-3 mb-6">
// // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
// // //                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
// // //               </div>

// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // //                 <div>
// // //                   <label htmlFor="name" className={labelClass}>Full name *</label>
// // //                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
// // //                 </div>
// // //                 <div>
// // //                   <label htmlFor="email" className={labelClass}>Email address</label>
// // //                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
// // //                   <p className="text-xs text-gray-400 mt-1">Required only if no social profiles below</p>
// // //                 </div>
// // //                 <div>
// // //                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
// // //                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
// // //                 </div>
// // //                 <div className="md:col-span-2">
// // //                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
// // //                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
// // //                 </div>
// // //               </div>

// // //               {/* Social profiles / websites */}
// // //               <div className="mt-6">
// // //                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
// // //                 <p className="text-xs text-gray-400 mb-3">Add at least one if you don't provide an email above.</p>
// // //                 {socialProfiles.map((profile, index) => (
// // //                   <div key={index} className="flex gap-2 mb-2 items-start">
// // //                     <select
// // //                       value={profile.platform}
// // //                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// // //                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
// // //                     >
// // //                       <option value="">Select</option>
// // //                       {PLATFORM_OPTIONS.map((opt) => (
// // //                         <option key={opt} value={opt}>{opt}</option>
// // //                       ))}
// // //                     </select>
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Handle or URL"
// // //                       value={profile.handle}
// // //                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// // //                       className={`${inputClass} flex-1`}
// // //                     />
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => removeSocialRow(index)}
// // //                       disabled={socialProfiles.length === 1}
// // //                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // //                       title="Remove"
// // //                     >
// // //                       ✕
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
// // //                   + Add another profile
// // //                 </button>
// // //               </div>
// // //             </section>

// // //             {/* ============================================= */}
// // //             {/* 2. YOUR WORKSPACE (required)                   */}
// // //             {/* ============================================= */}
// // //             <section>
// // //               <div className="flex items-center gap-3 mb-6">
// // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
// // //                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
// // //               </div>

// // //               <div>
// // //                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
// // //                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
// // //               </div>

// // //               <div className="mt-6">
// // //                 <label className={labelClass}>Upload images (at least 5) *</label>
// // //                 <div className="flex items-center gap-4 flex-wrap">
// // //                   <input
// // //                     type="file"
// // //                     multiple
// // //                     accept="image/*"
// // //                     onChange={handleImageSelect}
// // //                     className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
// // //                   />
// // //                   <span className="text-xs text-gray-400">
// // //                     {imageFiles.length}/5 minimum
// // //                   </span>
// // //                 </div>
// // //                 {imagePreviews.length > 0 && (
// // //                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
// // //                     {imagePreviews.map((preview, idx) => (
// // //                       <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
// // //                         <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => removeImage(idx)}
// // //                           className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
// // //                         >
// // //                           ✕
// // //                         </button>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="mt-5">
// // //                 <label htmlFor="videoLink" className={labelClass}>Video link (optional)</label>
// // //                 <input id="videoLink" type="url" value={formData.videoLink} onChange={handleInputChange} placeholder="YouTube, Vimeo, etc." className={inputClass} />
// // //               </div>

// // //               {/* Gear list */}
// // //               <div className="mt-6">
// // //                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
// // //                 <p className="text-xs text-gray-400 mb-4">List every major item. You can add an affiliate or product link (optional).</p>
// // //                 <div className="space-y-3">
// // //                   {gearItems.map((item, index) => (
// // //                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// // //                       <div className="flex-1 w-full">
// // //                         <input
// // //                           type="text"
// // //                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
// // //                           value={item.name}
// // //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// // //                           className={inputClass}
// // //                         />
// // //                       </div>
// // //                       <div className="flex-1 sm:flex-[0.4] w-full">
// // //                         <input
// // //                           type="url"
// // //                           placeholder="Link (optional)"
// // //                           value={item.link}
// // //                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
// // //                           className={`${inputClass} text-xs`}
// // //                         />
// // //                       </div>
// // //                       <button
// // //                         type="button"
// // //                         onClick={() => removeGearRow(index)}
// // //                         disabled={gearItems.length <= 7}
// // //                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// // //                         title="Remove"
// // //                       >
// // //                         ✕
// // //                       </button>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
// // //                   + Add another item
// // //                 </button>
// // //               </div>
// // //             </section>

// // //             {/* ============================================= */}
// // //             {/* 3. MORE ABOUT YOUR SETUP (consolidated optional) */}
// // //             {/* ============================================= */}
// // //             <section ref={optionalRef}>
// // //               <div className="flex items-center gap-3 mb-6">
// // //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
// // //                 <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
// // //                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
// // //               </div>

// // //               {!showOptional ? (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowOptional(true)}
// // //                   className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
// // //                 >
// // //                   <div>
// // //                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
// // //                     <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
// // //                   </div>
// // //                   <span className="text-gray-400 text-lg">+</span>
// // //                 </button>
// // //               ) : (
// // //                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
// // //                   {/* --- Setup details --- */}
// // //                   <h3 className={subHeadingClass}>Setup Story & Details</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                     <div>
// // //                       <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
// // //                       <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
// // //                     </div>
// // //                     <div>
// // //                       <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
// // //                       <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
// // //                     </div>
// // //                   </div>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// // //                     <div>
// // //                       <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
// // //                       <textarea id="favoriteItem" rows={2} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass} />
// // //                     </div>
// // //                     <div>
// // //                       <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
// // //                       <textarea id="recentAddition" rows={2} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass} />
// // //                     </div>
// // //                     <div>
// // //                       <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
// // //                       <textarea id="desiredChange" rows={2} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass} />
// // //                     </div>
// // //                   </div>

// // //                   {/* --- Comfort & function --- */}
// // //                   <h3 className={subHeadingClass}>Comfort & Function</h3>
// // //                   <div>
// // //                     <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
// // //                     <textarea id="comfortCable" rows={3} value={formData.comfortCable} onChange={handleInputChange} placeholder="Standing desk, ergo chair, under-desk trays…" className={inputClass} />
// // //                   </div>

// // //                   {/* --- Decor & personality --- */}
// // //                   <h3 className={subHeadingClass}>Decor & Personality</h3>
// // //                   <div>
// // //                     <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches that make it yours?</label>
// // //                     <textarea id="decorativeTouches" rows={2} value={formData.decorativeTouches} onChange={handleInputChange} placeholder="Plants, neon sign, art prints, figurines…" className={inputClass} />
// // //                   </div>

// // //                   {/* --- Software & tools --- */}
// // //                   <h3 className={subHeadingClass}>Software & Tools</h3>
// // //                   <div>
// // //                     <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
// // //                     <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass} />
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </section>

// // //             {/* ============================================= */}
// // //             {/* 4. CONSENT & SUBMIT                            */}
// // //             {/* ============================================= */}
// // //             <section className="border-t border-gray-200 pt-6">
// // //               <div className="space-y-4">
// // //                 <label className="flex items-start gap-3 cursor-pointer">
// // //                   <input
// // //                     type="checkbox"
// // //                     id="consent"
// // //                     checked={formData.consent}
// // //                     onChange={handleInputChange}
// // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // //                   />
// // //                   <span className="text-sm text-gray-700">
// // //                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
// // //                   </span>
// // //                 </label>
// // //                 <label className="flex items-start gap-3 cursor-pointer">
// // //                   <input
// // //                     type="checkbox"
// // //                     id="newsletter"
// // //                     checked={formData.newsletter}
// // //                     onChange={handleInputChange}
// // //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// // //                   />
// // //                   <span className="text-sm text-gray-700">
// // //                     Send me updates, featured setups, and community news.
// // //                   </span>
// // //                 </label>
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting}
// // //                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
// // //               >
// // //                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// // //               </button>

// // //               {message && (
// // //                 <div
// // //                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
// // //                     message.type === 'success'
// // //                       ? 'bg-green-50 border-green-200 text-green-700'
// // //                       : 'bg-red-50 border-red-200 text-red-700'
// // //                   }`}
// // //                 >
// // //                   {message.text}
// // //                 </div>
// // //               )}
// // //             </section>
// // //           </form>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   )
// // // }




























// // 'use client'

// // import { useState, useRef } from 'react'
// // import { createClient } from '@/lib/supabase/client'
// // // import { uploadFile } from '@/lib/utils/supabase-uploads' // renamed to generic upload
// // import { uploadMedia } from '@/actions/uploadMedia' // adjust path

// // /* ------------------------------------------------------------------ */
// // /*  Types & Constants                                                 */
// // /* ------------------------------------------------------------------ */
// // type SocialProfile = {
// //   platform: string
// //   handle: string
// // }

// // type GearItem = {
// //   name: string
// //   link: string
// // }

// // const PLATFORM_OPTIONS = [
// //   'GitHub',
// //   'Twitter / X',
// //   'Instagram',
// //   'LinkedIn',
// //   'YouTube',
// //   'Behance',
// //   'Dribbble',
// //   'Personal Website',
// //   'Other',
// // ]

// // /* ------------------------------------------------------------------ */
// // /*  Component                                                         */
// // /* ------------------------------------------------------------------ */
// // export default function SubmitForm() {
// //   const supabase = createClient()
// //   const optionalRef = useRef<HTMLDivElement>(null)

// //   const [formData, setFormData] = useState({
// //     email: '',
// //     name: '',
// //     intro: '',
// //     location: '',
// //     description: '',
// //     budget: '',
// //     spaceSize: '',
// //     favoriteItem: '',
// //     recentAddition: '',
// //     desiredChange: '',
// //     comfortCable: '',
// //     decorativeTouches: '',
// //     softwareTools: '',
// //     consent: false,
// //     newsletter: false,
// //   })

// //   /* --- Dynamic social profiles ------------------------------------ */
// //   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
// //     { platform: '', handle: '' },
// //   ])

// //   /* --- Dynamic gear list (min 7 items) ---------------------------- */
// //   const [gearItems, setGearItems] = useState<GearItem[]>(
// //     Array(7).fill({ name: '', link: '' })
// //   )

// //   /* --- File uploads (images & videos) ----------------------------- */
// //   const [mediaFiles, setMediaFiles] = useState<File[]>([])
// //   const [mediaPreviews, setMediaPreviews] = useState<string[]>([]) // object URLs for images & video posters
// //   const [isSubmitting, setIsSubmitting] = useState(false)
// //   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

// //   /* --- Optional details visibility -------------------------------- */
// //   const [showOptional, setShowOptional] = useState(false)

// //   /* ---------- Handlers -------------------------------------------- */
// //   const handleInputChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// //   ) => {
// //     const { id, value, type } = e.target
// //     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
// //     setFormData((prev) => ({ ...prev, [id]: val }))
// //   }

// //   /* Social profiles */
// //   const handleSocialChange = (
// //     index: number,
// //     field: 'platform' | 'handle',
// //     value: string,
// //   ) => {
// //     const updated = [...socialProfiles]
// //     updated[index][field] = value
// //     setSocialProfiles(updated)
// //   }

// //   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
// //   const removeSocialRow = (index: number) => {
// //     if (socialProfiles.length === 1) return
// //     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
// //   }

// //   /* Gear list */
// //   const handleGearNameChange = (index: number, name: string) => {
// //     const updated = [...gearItems]
// //     updated[index] = { ...updated[index], name }
// //     setGearItems(updated)
// //   }

// //   const handleGearLinkChange = (index: number, link: string) => {
// //     const updated = [...gearItems]
// //     updated[index] = { ...updated[index], link }
// //     setGearItems(updated)
// //   }

// //   const addGearRow = () => {
// //     setGearItems([...gearItems, { name: '', link: '' }])
// //   }

// //   const removeGearRow = (index: number) => {
// //     if (gearItems.length <= 7) return
// //     setGearItems(gearItems.filter((_, i) => i !== index))
// //   }

// //   /* Media upload (images + videos) */
// //   const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = Array.from(e.target.files || [])
// //     if (!files.length) return
// //     const total = mediaFiles.length + files.length
// //     if (total > 10) {
// //       alert('Maximum 10 files allowed.')
// //       return
// //     }
// //     const newPreviews = files.map((file) => URL.createObjectURL(file))
// //     setMediaPreviews((prev) => [...prev, ...newPreviews])
// //     setMediaFiles((prev) => [...prev, ...files])
// //   }

// //   const removeMedia = (index: number) => {
// //     const updatedFiles = [...mediaFiles]
// //     updatedFiles.splice(index, 1)
// //     setMediaFiles(updatedFiles)
// //     const updatedPreviews = [...mediaPreviews]
// //     URL.revokeObjectURL(updatedPreviews[index])
// //     updatedPreviews.splice(index, 1)
// //     setMediaPreviews(updatedPreviews)
// //   }

// //   /* ---------- Submit ---------------------------------------------- */
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()

// //     if (!showOptional) {
// //       setShowOptional(true)
// //       setTimeout(() => {
// //         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
// //       }, 100)
// //       return
// //     }

// //     const validSocialProfiles = socialProfiles.filter(
// //       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
// //     )

// //     if (!formData.email && validSocialProfiles.length === 0) {
// //       setMessage({ type: 'error', text: 'Please provide either an email or at least one social profile.' })
// //       return
// //     }
// //     if (!formData.name) {
// //       setMessage({ type: 'error', text: 'Your name is required.' })
// //       return
// //     }
// //     if (!formData.location.trim()) {
// //       setMessage({ type: 'error', text: 'Location is required (at least country).' })
// //       return
// //     }
// //     if (!formData.description.trim()) {
// //       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
// //       return
// //     }
// //     if (mediaFiles.length < 5) {
// //       setMessage({ type: 'error', text: 'Please upload at least 5 images or videos.' })
// //       return
// //     }
// //     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
// //     if (validGearItems.length < 7) {
// //       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
// //       return
// //     }
// //     if (!formData.consent) {
// //       setMessage({ type: 'error', text: 'You must agree to be featured.' })
// //       return
// //     }

// //     setIsSubmitting(true)
// //     setMessage(null)

// //     try {
// //       // Upload all files (images & videos) to a generic bucket
// //       let uploadedUrls: string[] = []
// //       if (mediaFiles.length > 0) {
// //         const uploadPromises = mediaFiles.map((file) =>
// //           uploadFile(file, 'submissions', 'user-uploads')
// //         )
// //         uploadedUrls = await Promise.all(uploadPromises)
// //       }

// //       const gearData = validGearItems.map(({ name, link }) => ({
// //         name,
// //         link: link.trim() || null,
// //       }))

// //       const { error } = await supabase.from('submissions').insert({
// //         email: formData.email || null,
// //         name: formData.name,
// //         intro: formData.intro || null,
// //         location: formData.location,
// //         social_profiles: validSocialProfiles,
// //         media_urls: uploadedUrls, // renamed column to reflect images + videos
// //         description: formData.description,
// //         budget: formData.budget || null,
// //         space_size: formData.spaceSize || null,
// //         favorite_item: formData.favoriteItem || null,
// //         recent_addition: formData.recentAddition || null,
// //         desired_change: formData.desiredChange || null,
// //         comfort_cable: formData.comfortCable || null,
// //         decorative_touches: formData.decorativeTouches || null,
// //         software_tools: formData.softwareTools || null,
// //         gear_list: gearData,
// //         consent: formData.consent,
// //         newsletter: formData.newsletter,
// //         status: 'pending',
// //       })

// //       if (error) throw error

// //       setMessage({ type: 'success', text: 'Submitted! We’ll review your workspace. ✨' })

// //       // Reset
// //       setFormData({
// //         email: '',
// //         name: '',
// //         intro: '',
// //         location: '',
// //         description: '',
// //         budget: '',
// //         spaceSize: '',
// //         favoriteItem: '',
// //         recentAddition: '',
// //         desiredChange: '',
// //         comfortCable: '',
// //         decorativeTouches: '',
// //         softwareTools: '',
// //         consent: false,
// //         newsletter: false,
// //       })
// //       setSocialProfiles([{ platform: '', handle: '' }])
// //       setGearItems(Array(7).fill({ name: '', link: '' }))
// //       setMediaFiles([])
// //       setMediaPreviews([])
// //       setShowOptional(false)
// //     } catch (err: any) {
// //       console.error(err)
// //       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   /* ---------- UI helpers ------------------------------------------ */
// //   const inputClass =
// //     'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow'
// //   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

// //   const isVideo = (file: File) => file.type.startsWith('video/')

// //   return (
// //     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
// //       <div className="max-w-4xl mx-auto">
// //         <div className="text-center mb-12">
// //           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// //             Show us your desk setup ✨
// //           </h1>
// //           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
// //             Fill out the form below for a chance to be featured. Required fields (*) are mandatory.
// //           </p>
// //         </div>

// //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
// //           <form onSubmit={handleSubmit} className="space-y-10">

// //             {/* ============================================= */}
// //             {/* 1. ABOUT YOU                                  */}
// //             {/* ============================================= */}
// //             <section>
// //               <div className="flex items-center gap-3 mb-6">
// //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
// //                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //                 <div>
// //                   <label htmlFor="name" className={labelClass}>Full name *</label>
// //                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
// //                 </div>
// //                 <div>
// //                   <label htmlFor="email" className={labelClass}>Email address</label>
// //                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
// //                   <p className="text-xs text-gray-400 mt-1">Required if no social profiles below</p>
// //                 </div>
// //                 <div>
// //                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
// //                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
// //                 </div>
// //                 <div className="md:col-span-2">
// //                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
// //                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
// //                 </div>
// //               </div>

// //               <div className="mt-6">
// //                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
// //                 <p className="text-xs text-gray-400 mb-3">At least one required if no email above.</p>
// //                 {socialProfiles.map((profile, index) => (
// //                   <div key={index} className="flex gap-2 mb-2 items-start">
// //                     <select
// //                       value={profile.platform}
// //                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
// //                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
// //                     >
// //                       <option value="">Select</option>
// //                       {PLATFORM_OPTIONS.map((opt) => (
// //                         <option key={opt} value={opt}>{opt}</option>
// //                       ))}
// //                     </select>
// //                     <input
// //                       type="text"
// //                       placeholder="Handle or URL"
// //                       value={profile.handle}
// //                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
// //                       className={`${inputClass} flex-1`}
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => removeSocialRow(index)}
// //                       disabled={socialProfiles.length === 1}
// //                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// //                       title="Remove"
// //                     >
// //                       ✕
// //                     </button>
// //                   </div>
// //                 ))}
// //                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
// //                   + Add another profile
// //                 </button>
// //               </div>
// //             </section>

// //             {/* ============================================= */}
// //             {/* 2. YOUR WORKSPACE (required)                   */}
// //             {/* ============================================= */}
// //             <section>
// //               <div className="flex items-center gap-3 mb-6">
// //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
// //                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
// //               </div>

// //               <div>
// //                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
// //                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
// //               </div>

// //               {/* Media upload (images + videos) */}
// //               <div className="mt-6">
// //                 <label className={labelClass}>Upload images & videos (at least 5) *</label>
// //                 <p className="text-xs text-gray-400 mb-3">You can mix photos and video clips.</p>
// //                 <input
// //                   type="file"
// //                   multiple
// //                   accept="image/*,video/*"
// //                   onChange={handleMediaSelect}
// //                   className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
// //                 />
// //                 {mediaPreviews.length > 0 && (
// //                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
// //                     {mediaPreviews.map((previewUrl, idx) => {
// //                       const file = mediaFiles[idx]
// //                       return (
// //                         <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-black">
// //                           {isVideo(file) ? (
// //                             <video src={previewUrl} className="h-24 w-full object-cover" muted />
// //                           ) : (
// //                             <img src={previewUrl} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
// //                           )}
// //                           <button
// //                             type="button"
// //                             onClick={() => removeMedia(idx)}
// //                             className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
// //                           >
// //                             ✕
// //                           </button>
// //                         </div>
// //                       )
// //                     })}
// //                   </div>
// //                 )}
// //                 <p className="text-xs text-gray-400 mt-2">
// //                   {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
// //                   {mediaFiles.length < 5 ? ' (minimum 5 required)' : ''}
// //                 </p>
// //               </div>

// //               {/* Gear list */}
// //               <div className="mt-6">
// //                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
// //                 <p className="text-xs text-gray-400 mb-4">List every major item. Add an affiliate link (optional).</p>
// //                 <div className="space-y-3">
// //                   {gearItems.map((item, index) => (
// //                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// //                       <div className="flex-1 w-full">
// //                         <input
// //                           type="text"
// //                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
// //                           value={item.name}
// //                           onChange={(e) => handleGearNameChange(index, e.target.value)}
// //                           className={inputClass}
// //                         />
// //                       </div>
// //                       <div className="flex-1 sm:flex-[0.4] w-full">
// //                         <input
// //                           type="url"
// //                           placeholder="Link (optional)"
// //                           value={item.link}
// //                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
// //                           className={`${inputClass} text-xs`}
// //                         />
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={() => removeGearRow(index)}
// //                         disabled={gearItems.length <= 7}
// //                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
// //                         title="Remove"
// //                       >
// //                         ✕
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
// //                   + Add another item
// //                 </button>
// //               </div>
// //             </section>

// //            {/* ============================================= */}
// // {/* 3. MORE ABOUT YOUR SETUP (improved optional)   */}
// // {/* ============================================= */}
// // <section ref={optionalRef}>
// //   <div className="flex items-center gap-3 mb-6">
// //     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
// //     <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
// //     <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
// //   </div>

// //   {!showOptional ? (
// //     <button
// //       type="button"
// //       onClick={() => setShowOptional(true)}
// //       className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
// //     >
// //       <div>
// //         <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
// //         <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
// //       </div>
// //       <span className="text-gray-400 text-lg">+</span>
// //     </button>
// //   ) : (
// //     <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm space-y-6">
// //       {/* Row 1: short inputs – always side by side */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
// //           <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
// //         </div>
// //         <div>
// //           <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
// //           <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
// //         </div>
// //       </div>

// //       {/* Row 2: two textareas of equal height */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
// //           <textarea id="favoriteItem" rows={3} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass} />
// //         </div>
// //         <div>
// //           <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
// //           <textarea id="recentAddition" rows={3} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass} />
// //         </div>
// //       </div>

// //       {/* Row 3: full-width textarea
// //       <div>
// //         <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
// //         <textarea id="desiredChange" rows={2} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass} />
// //       </div> */}

// //       <hr className="border-gray-100" />

// //       {/* Row 4: comfort & decor side by side */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //         <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
// //         <textarea id="desiredChange" rows={4} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass} />
// //       </div>
// //         <div>
// //           <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
// //           <textarea id="decorativeTouches" rows={4} value={formData.decorativeTouches} onChange={handleInputChange} placeholder="Plants, neon sign, art prints, figurines…" className={inputClass} />
// //         </div>
// //       </div>

// //        <div>
// //           <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
// //           <textarea id="comfortCable" rows={3} value={formData.comfortCable} onChange={handleInputChange} placeholder="Standing desk, ergo chair, under-desk trays…" className={inputClass} />
// //         </div>

// //       <hr className="border-gray-100" />

// //       {/* Row 5: software full width */}
// //       <div>
// //         <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
// //         <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass} />
// //       </div>
// //     </div>
// //   )}
// // </section>

// //             {/* ============================================= */}
// //             {/* 4. CONSENT & SUBMIT                            */}
// //             {/* ============================================= */}
// //             <section className="border-t border-gray-200 pt-6">
// //               <div className="space-y-4">
// //                 <label className="flex items-start gap-3 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     id="consent"
// //                     checked={formData.consent}
// //                     onChange={handleInputChange}
// //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// //                   />
// //                   <span className="text-sm text-gray-700">
// //                     I agree to be featured on DeskScrolls and its social media. I confirm the media are mine or I have permission. *
// //                   </span>
// //                 </label>
// //                 <label className="flex items-start gap-3 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     id="newsletter"
// //                     checked={formData.newsletter}
// //                     onChange={handleInputChange}
// //                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
// //                   />
// //                   <span className="text-sm text-gray-700">
// //                     Send me updates, featured setups, and community news.
// //                   </span>
// //                 </label>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
// //               >
// //                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
// //               </button>

// //               {message && (
// //                 <div
// //                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
// //                     message.type === 'success'
// //                       ? 'bg-green-50 border-green-200 text-green-700'
// //                       : 'bg-red-50 border-red-200 text-red-700'
// //                   }`}
// //                 >
// //                   {message.text}
// //                 </div>
// //               )}
// //             </section>
// //           </form>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }



















// // fully functional 
// 'use client'

// import { useState, useRef } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { uploadMedia } from '@/actions/uploadMedia' // server action

// /* ------------------------------------------------------------------ */
// /*  Types & Constants                                                 */
// /* ------------------------------------------------------------------ */
// type SocialProfile = {
//   platform: string
//   handle: string
// }

// type GearItem = {
//   name: string
//   link: string
// }

// const PLATFORM_OPTIONS = [
//   'GitHub',
//   'Twitter / X',
//   'Instagram',
//   'LinkedIn',
//   'YouTube',
//   'Behance',
//   'Dribbble',
//   'Personal Website',
//   'Other',
// ]

// /* ------------------------------------------------------------------ */
// /*  Component                                                         */
// /* ------------------------------------------------------------------ */
// export default function SubmitForm() {
//   const supabase = createClient()
//   const optionalRef = useRef<HTMLDivElement>(null)

//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     intro: '',
//     location: '',
//     description: '',
//     budget: '',
//     spaceSize: '',
//     favoriteItem: '',
//     recentAddition: '',
//     desiredChange: '',
//     comfortCable: '',
//     decorativeTouches: '',
//     softwareTools: '',
//     consent: false,
//     newsletter: false,
//   })

//   /* --- Dynamic social profiles ------------------------------------ */
//   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
//     { platform: '', handle: '' },
//   ])

//   /* --- Dynamic gear list (min 7 items) ---------------------------- */
//   const [gearItems, setGearItems] = useState<GearItem[]>(
//     Array(7).fill({ name: '', link: '' })
//   )

//   /* --- File uploads (images & videos) ----------------------------- */
//   const [mediaFiles, setMediaFiles] = useState<File[]>([])
//   const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

//   /* --- Optional details visibility -------------------------------- */
//   const [showOptional, setShowOptional] = useState(false)

//   /* ---------- Handlers -------------------------------------------- */
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { id, value, type } = e.target
//     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     setFormData((prev) => ({ ...prev, [id]: val }))
//   }

//   /* Social profiles */
//   const handleSocialChange = (
//     index: number,
//     field: 'platform' | 'handle',
//     value: string,
//   ) => {
//     const updated = [...socialProfiles]
//     updated[index][field] = value
//     setSocialProfiles(updated)
//   }

//   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
//   const removeSocialRow = (index: number) => {
//     if (socialProfiles.length === 1) return
//     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
//   }

//   /* Gear list */
//   const handleGearNameChange = (index: number, name: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], name }
//     setGearItems(updated)
//   }

//   const handleGearLinkChange = (index: number, link: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], link }
//     setGearItems(updated)
//   }

//   const addGearRow = () => {
//     setGearItems([...gearItems, { name: '', link: '' }])
//   }

//   const removeGearRow = (index: number) => {
//     if (gearItems.length <= 7) return
//     setGearItems(gearItems.filter((_, i) => i !== index))
//   }

//   /* Media upload (images + videos) */
//   const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
//     if (!files.length) return
//     const total = mediaFiles.length + files.length
//     if (total > 10) {
//       alert('Maximum 10 files allowed.')
//       return
//     }
//     const newPreviews = files.map((file) => URL.createObjectURL(file))
//     setMediaPreviews((prev) => [...prev, ...newPreviews])
//     setMediaFiles((prev) => [...prev, ...files])
//   }

//   const removeMedia = (index: number) => {
//     const updatedFiles = [...mediaFiles]
//     updatedFiles.splice(index, 1)
//     setMediaFiles(updatedFiles)
//     const updatedPreviews = [...mediaPreviews]
//     URL.revokeObjectURL(updatedPreviews[index])
//     updatedPreviews.splice(index, 1)
//     setMediaPreviews(updatedPreviews)
//   }

//   /* ---------- Submit ---------------------------------------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Open optional section if hidden (first click)
//     if (!showOptional) {
//       setShowOptional(true)
//       setTimeout(() => {
//         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//       }, 100)
//       return
//     }

//     // --- Validation ---
//     const validSocialProfiles = socialProfiles.filter(
//       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//     )

//     if (!formData.email && validSocialProfiles.length === 0) {
//       setMessage({ type: 'error', text: 'Please provide either an email or at least one social profile.' })
//       return
//     }
//     if (!formData.name) {
//       setMessage({ type: 'error', text: 'Your name is required.' })
//       return
//     }
//     if (!formData.location.trim()) {
//       setMessage({ type: 'error', text: 'Location is required (at least country).' })
//       return
//     }
//     if (!formData.description.trim()) {
//       setMessage({ type: 'error', text: 'Please tell us the story behind your desk setup.' })
//       return
//     }
//     if (mediaFiles.length < 5) {
//       setMessage({ type: 'error', text: 'Please upload at least 5 images or videos.' })
//       return
//     }
//     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//     if (validGearItems.length < 7) {
//       setMessage({ type: 'error', text: 'Please list at least 7 workspace items.' })
//       return
//     }
//     if (!formData.consent) {
//       setMessage({ type: 'error', text: 'You must agree to be featured.' })
//       return
//     }

//     setIsSubmitting(true)
//     setMessage(null)

//     try {
//       // 1. Upload all media files to ImageKit (which stores in B2)
//       let mediaUrls: string[] = []
//       if (mediaFiles.length > 0) {
//         // const uploadPromises = mediaFiles.map(async (file) => {
//         //   const fd = new FormData()
//         //   fd.append('file', file)
//         //   return await uploadMedia(fd) // returns ImageKit CDN URL
//         // })
//         // mediaUrls = await Promise.all(uploadPromises)
//         // Inside handleSubmit, after validation, before upload:
// const uploadPromises = mediaFiles.map(async (file) => {
//   const fd = new FormData()
//   fd.append('file', file)
//   fd.append('userName', formData.name)   // <-- passing the user's name
//   return await uploadMedia(fd)
// })

// mediaUrls = await Promise.all(uploadPromises)
//       }

//       // 2. Prepare gear data (clean items)
//       const gearData = validGearItems.map(({ name, link }) => ({
//         name,
//         link: link.trim() || null,
//       }))

//       // 3. Insert into existing Supabase table (new columns added)
//       const { error } = await supabase.from('submissions').insert({
//         email: formData.email || null,
//         name: formData.name,
//         intro: formData.intro || null,
//         location: formData.location,
//         description: formData.description,
//         budget: formData.budget || null,
//         space_size: formData.spaceSize || null,
//         favorite_item: formData.favoriteItem || null,
//         recent_addition: formData.recentAddition || null,
//         desired_change: formData.desiredChange || null,
//         comfort_cable: formData.comfortCable || null,
//         decorative_touches: formData.decorativeTouches || null,
//         software_tools: formData.softwareTools || null,
//         social_profiles: validSocialProfiles,
//         image_urls: mediaUrls,           // ImageKit URLs for images + videos
//         gear_list: gearData,
//         consent: formData.consent,
//         newsletter: formData.newsletter,
//         status: 'pending',
//       })

//       if (error) throw error

//       setMessage({ type: 'success', text: 'Submitted! We’ll review your workspace. ✨' })

//       // Reset form
//       setFormData({
//         email: '',
//         name: '',
//         intro: '',
//         location: '',
//         description: '',
//         budget: '',
//         spaceSize: '',
//         favoriteItem: '',
//         recentAddition: '',
//         desiredChange: '',
//         comfortCable: '',
//         decorativeTouches: '',
//         softwareTools: '',
//         consent: false,
//         newsletter: false,
//       })
//       setSocialProfiles([{ platform: '', handle: '' }])
//       setGearItems(Array(7).fill({ name: '', link: '' }))
//       setMediaFiles([])
//       setMediaPreviews([])
//       setShowOptional(false)
//     } catch (err: any) {
//       console.error(err)
//       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   /* ---------- UI helpers ------------------------------------------ */
//   const inputClass =
//     'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow'
//   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

//   const isVideo = (file: File) => file.type.startsWith('video/')

//   return (
//     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
//             Show us your desk setup ✨
//           </h1>
//           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
//             Fill out the form below for a chance to be featured. Required fields (*) are mandatory.
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-10">

//             {/* ============================================= */}
//             {/* 1. ABOUT YOU                                  */}
//             {/* ============================================= */}
//             <section>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
//                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label htmlFor="name" className={labelClass}>Full name *</label>
//                   <input id="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass} />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className={labelClass}>Email address</label>
//                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass} />
//                   <p className="text-xs text-gray-400 mt-1">Required if no social profiles below</p>
//                 </div>
//                 <div>
//                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
//                   <input id="location" type="text" required value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass} />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
//                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass} />
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
//                 <p className="text-xs text-gray-400 mb-3">At least one required if no email above.</p>
//                 {socialProfiles.map((profile, index) => (
//                   <div key={index} className="flex gap-2 mb-2 items-start">
//                     <select
//                       value={profile.platform}
//                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
//                       className="w-1/3 md:w-1/4 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     >
//                       <option value="">Select</option>
//                       {PLATFORM_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                     <input
//                       type="text"
//                       placeholder="Handle or URL"
//                       value={profile.handle}
//                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
//                       className={`${inputClass} flex-1`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSocialRow(index)}
//                       disabled={socialProfiles.length === 1}
//                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
//                       title="Remove"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
//                   + Add another profile
//                 </button>
//               </div>
//             </section>

//             {/* ============================================= */}
//             {/* 2. YOUR WORKSPACE (required)                   */}
//             {/* ============================================= */}
//             <section>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
//                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
//               </div>

//               <div>
//                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
//                 <textarea id="description" rows={5} required value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass} />
//               </div>

//               {/* Media upload (images + videos) */}
//               <div className="mt-6">
//                 <label className={labelClass}>Upload images & videos (at least 5) *</label>
//                 <p className="text-xs text-gray-400 mb-3">You can mix photos and video clips.</p>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*,video/*"
//                   onChange={handleMediaSelect}
//                   className="text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
//                 />
//                 {mediaPreviews.length > 0 && (
//                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
//                     {mediaPreviews.map((previewUrl, idx) => {
//                       const file = mediaFiles[idx]
//                       return (
//                         <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-black">
//                           {isVideo(file) ? (
//                             <video src={previewUrl} className="h-24 w-full object-cover" muted />
//                           ) : (
//                             <img src={previewUrl} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
//                           )}
//                           <button
//                             type="button"
//                             onClick={() => removeMedia(idx)}
//                             className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}
//                 <p className="text-xs text-gray-400 mt-2">
//                   {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
//                   {mediaFiles.length < 5 ? ' (minimum 5 required)' : ''}
//                 </p>
//               </div>

//               {/* Gear list */}
//               <div className="mt-6">
//                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
//                 <p className="text-xs text-gray-400 mb-4">List every major item. Add an affiliate link (optional).</p>
//                 <div className="space-y-3">
//                   {gearItems.map((item, index) => (
//                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//                       <div className="flex-1 w-full">
//                         <input
//                           type="text"
//                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
//                           value={item.name}
//                           onChange={(e) => handleGearNameChange(index, e.target.value)}
//                           className={inputClass}
//                         />
//                       </div>
//                       <div className="flex-1 sm:flex-[0.4] w-full">
//                         <input
//                           type="url"
//                           placeholder="Link (optional)"
//                           value={item.link}
//                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
//                           className={`${inputClass} text-xs`}
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeGearRow(index)}
//                         disabled={gearItems.length <= 7}
//                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
//                         title="Remove"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
//                   + Add another item
//                 </button>
//               </div>
//             </section>

//             {/* ============================================= */}
//             {/* 3. MORE ABOUT YOUR SETUP (optional)           */}
//             {/* ============================================= */}
//             <section ref={optionalRef}>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
//                 <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
//                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
//               </div>

//               {!showOptional ? (
//                 <button
//                   type="button"
//                   onClick={() => setShowOptional(true)}
//                   className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
//                 >
//                   <div>
//                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
//                     <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
//                   </div>
//                   <span className="text-gray-400 text-lg">+</span>
//                 </button>
//               ) : (
//                 <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm space-y-6">
//                   {/* Row 1: short inputs */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
//                       <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass} />
//                     </div>
//                     <div>
//                       <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
//                       <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass} />
//                     </div>
//                   </div>

//                   {/* Row 2: two textareas */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
//                       <textarea id="favoriteItem" rows={3} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass} />
//                     </div>
//                     <div>
//                       <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
//                       <textarea id="recentAddition" rows={3} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass} />
//                     </div>
//                   </div>

//                   <hr className="border-gray-100" />

//                   {/* Row 3: change & decor side by side */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
//                       <textarea id="desiredChange" rows={4} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass} />
//                     </div>
//                     <div>
//                       <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
//                       <textarea id="decorativeTouches" rows={4} value={formData.decorativeTouches} onChange={handleInputChange} placeholder="Plants, neon sign, art prints, figurines…" className={inputClass} />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
//                     <textarea id="comfortCable" rows={3} value={formData.comfortCable} onChange={handleInputChange} placeholder="Standing desk, ergo chair, under-desk trays…" className={inputClass} />
//                   </div>

//                   <hr className="border-gray-100" />

//                   {/* Software */}
//                   <div>
//                     <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
//                     <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass} />
//                   </div>
//                 </div>
//               )}
//             </section>

//             {/* ============================================= */}
//             {/* 4. CONSENT & SUBMIT                            */}
//             {/* ============================================= */}
//             <section className="border-t border-gray-200 pt-6">
//               <div className="space-y-4">
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     id="consent"
//                     checked={formData.consent}
//                     onChange={handleInputChange}
//                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">
//                     I agree to be featured on DeskScrolls and its social media. I confirm the media are mine or I have permission. *
//                   </span>
//                 </label>
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     id="newsletter"
//                     checked={formData.newsletter}
//                     onChange={handleInputChange}
//                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">
//                     Send me updates, featured setups, and community news.
//                   </span>
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
//               </button>

//               {message && (
//                 <div
//                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
//                     message.type === 'success'
//                       ? 'bg-green-50 border-green-200 text-green-700'
//                       : 'bg-red-50 border-red-200 text-red-700'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               )}
//             </section>
//           </form>
//         </div>
//       </div>
//     </section>
//   )
// }


















// 'use client'

// import { useState, useRef } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { uploadMedia } from '@/actions/uploadMedia'

// /* ------------------------------------------------------------------ */
// /*  Types & Constants (unchanged)                                     */
// /* ------------------------------------------------------------------ */
// type SocialProfile = {
//   platform: string
//   handle: string
// }

// type GearItem = {
//   name: string
//   link: string
// }

// const PLATFORM_OPTIONS = [
//   'GitHub',
//   'Twitter / X',
//   'Instagram',
//   'LinkedIn',
//   'YouTube',
//   'Behance',
//   'Dribbble',
//   'Personal Website',
//   'Other',
// ]

// const MAX_FILE_SIZE_MB = 5
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// /* ------------------------------------------------------------------ */
// /*  Component – ONLY UI/UX CHANGES, ALL LOGIC UNTOUCHED              */
// /* ------------------------------------------------------------------ */
// export default function SubmitForm() {
//   const supabase = createClient()
//   const optionalRef = useRef<HTMLDivElement>(null)

//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     intro: '',
//     location: '',
//     description: '',
//     budget: '',
//     spaceSize: '',
//     favoriteItem: '',
//     recentAddition: '',
//     desiredChange: '',
//     comfortCable: '',
//     decorativeTouches: '',
//     softwareTools: '',
//     consent: false,
//     newsletter: false,
//   })

//   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
//     { platform: '', handle: '' },
//   ])

//   const [gearItems, setGearItems] = useState<GearItem[]>(
//     Array(7).fill({ name: '', link: '' })
//   )

//   const [mediaFiles, setMediaFiles] = useState<File[]>([])
//   const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
//   const [showOptional, setShowOptional] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   /* ---------- Validation (unchanged) ------------------------------ */
//   const validate = (): Record<string, string> => {
//     const newErrors: Record<string, string> = {}
//     const validSocialProfiles = socialProfiles.filter(
//       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//     )

//     if (!formData.email && validSocialProfiles.length === 0) {
//       newErrors.email = 'Email is required if no social profile is provided.'
//       newErrors.socialProfiles = 'At least one social profile or email is required.'
//     }
//     if (!formData.name.trim()) {
//       newErrors.name = 'Full name is required.'
//     }
//     if (!formData.location.trim()) {
//       newErrors.location = 'Location is required.'
//     }
//     if (!formData.description.trim()) {
//       newErrors.description = 'Please describe your desk setup.'
//     }
//     if (mediaFiles.length < 5) {
//       newErrors.mediaFiles = 'Please upload at least 5 images.'
//     }
//     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//     if (validGearItems.length < 7) {
//       newErrors.gearItems = 'Please list at least 7 workspace items (each item must have a name).'
//     }
//     if (!formData.consent) {
//       newErrors.consent = 'You must agree to be featured.'
//     }
//     return newErrors
//   }

//   /* ---------- Handlers (unchanged) -------------------------------- */
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { id, value, type } = e.target
//     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     setFormData((prev) => ({ ...prev, [id]: val }))
//     if (errors[id]) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next[id]
//         return next
//       })
//     }
//   }

//   /* Social profiles */
//   const handleSocialChange = (
//     index: number,
//     field: 'platform' | 'handle',
//     value: string,
//   ) => {
//     const updated = [...socialProfiles]
//     updated[index][field] = value
//     setSocialProfiles(updated)
//     if (errors.socialProfiles) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.socialProfiles
//         return next
//       })
//     }
//   }

//   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
//   const removeSocialRow = (index: number) => {
//     if (socialProfiles.length === 1) return
//     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
//   }

//   /* Gear list */
//   const handleGearNameChange = (index: number, name: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], name }
//     setGearItems(updated)
//     if (errors.gearItems) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.gearItems
//         return next
//       })
//     }
//   }

//   const handleGearLinkChange = (index: number, link: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], link }
//     setGearItems(updated)
//   }

//   const addGearRow = () => setGearItems([...gearItems, { name: '', link: '' }])
//   const removeGearRow = (index: number) => {
//     if (gearItems.length <= 7) return
//     setGearItems(gearItems.filter((_, i) => i !== index))
//   }

//   /* Media upload – IMAGES ONLY (unchanged) */
//   const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
//     if (!files.length) return

//     const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
//     if (oversizedFiles.length > 0) {
//       const names = oversizedFiles.map((f) => f.name).join(', ')
//       setErrors((prev) => ({
//         ...prev,
//         mediaFiles: `File(s) "${names}" exceed ${MAX_FILE_SIZE_MB} MB limit.`,
//       }))
//       return
//     }

//     const total = mediaFiles.length + files.length
//     if (total > 10) {
//       setErrors((prev) => ({
//         ...prev,
//         mediaFiles: 'Maximum 10 images allowed.',
//       }))
//       return
//     }

//     if (errors.mediaFiles) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.mediaFiles
//         return next
//       })
//     }

//     const newPreviews = files.map((file) => URL.createObjectURL(file))
//     setMediaPreviews((prev) => [...prev, ...newPreviews])
//     setMediaFiles((prev) => [...prev, ...files])
//   }

//   const removeMedia = (index: number) => {
//     const updatedFiles = [...mediaFiles]
//     updatedFiles.splice(index, 1)
//     setMediaFiles(updatedFiles)
//     const updatedPreviews = [...mediaPreviews]
//     URL.revokeObjectURL(updatedPreviews[index])
//     updatedPreviews.splice(index, 1)
//     setMediaPreviews(updatedPreviews)
//   }

//   /* ---------- Submit (unchanged) ---------------------------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const newErrors = validate()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       const firstErrorKey = Object.keys(newErrors)[0]
//       const el = document.getElementById(firstErrorKey)
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       }
//       return
//     }

//     if (!showOptional) {
//       setShowOptional(true)
//       setTimeout(() => {
//         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//       }, 100)
//       return
//     }

//     const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
//     let submissionId = ''
//     for (let i = 0; i < 2; i++) {
//       submissionId += chars[Math.floor(Math.random() * chars.length)]
//     }

//     setErrors({})
//     setIsSubmitting(true)
//     setMessage(null)

//     try {
//       let mediaUrls: string[] = []
//       if (mediaFiles.length > 0) {
//         const uploadPromises = mediaFiles.map(async (file) => {
//           const fd = new FormData()
//           fd.append('file', file)
//           fd.append('userName', formData.name)
//           fd.append('submissionId', submissionId)
//           const result = await uploadMedia(fd)
//           if (!result.success || !result.url) {
//             throw new Error(result.error || 'Image upload failed')
//           }
//           return result.url
//         })
//         mediaUrls = await Promise.all(uploadPromises)
//       }

//       const validSocialProfiles = socialProfiles.filter(
//         (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//       )
//       const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//       const gearData = validGearItems.map(({ name, link }) => ({
//         name,
//         link: link.trim() || null,
//       }))

//       const { error } = await supabase.from('submissions').insert({
//         email: formData.email || null,
//         name: formData.name,
//         intro: formData.intro || null,
//         location: formData.location,
//         description: formData.description,
//         budget: formData.budget || null,
//         space_size: formData.spaceSize || null,
//         favorite_item: formData.favoriteItem || null,
//         recent_addition: formData.recentAddition || null,
//         desired_change: formData.desiredChange || null,
//         comfort_cable: formData.comfortCable || null,
//         decorative_touches: formData.decorativeTouches || null,
//         software_tools: formData.softwareTools || null,
//         social_profiles: validSocialProfiles,
//         image_urls: mediaUrls,
//         gear_list: gearData,
//         consent: formData.consent,
//         newsletter: formData.newsletter,
//         status: 'pending',
//       })

//       if (error) throw error

//       setMessage({ type: 'success', text: 'Submitted! We’ll review your workspace. ✨' })

//       // Reset form
//       setFormData({
//         email: '',
//         name: '',
//         intro: '',
//         location: '',
//         description: '',
//         budget: '',
//         spaceSize: '',
//         favoriteItem: '',
//         recentAddition: '',
//         desiredChange: '',
//         comfortCable: '',
//         decorativeTouches: '',
//         softwareTools: '',
//         consent: false,
//         newsletter: false,
//       })
//       setSocialProfiles([{ platform: '', handle: '' }])
//       setGearItems(Array(7).fill({ name: '', link: '' }))
//       setMediaFiles([])
//       setMediaPreviews([])
//       setShowOptional(false)
//       setErrors({})
//     } catch (err: any) {
//       console.error(err)
//       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   /* ---------- UI helpers (refined classes) ------------------------ */
//   const inputClass = (fieldId: string) =>
//     `w-full rounded-lg border ${
//       errors[fieldId] ? 'border-red-400 focus:ring-red-200' : 'border-gray-400 focus:ring-indigo-200'
//     } bg-white px-3 py-2.5 md:px-4 md:py-3 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-indigo-400 transition-shadow`

//   const labelClass = 'block text-sm font-medium text-gray-600 mb-1'

//   return (
//     <section className="min-h-screen bg-gray-50 px-3 py-10 md:py-20">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6 md:mb-10">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
//             Show us your desk setup ✨
//           </h1>
//           <p className="mt-3 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
//             Fill out the form below for a chance to be featured. Required fields (*) are mandatory.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//           {/* 1. ABOUT YOU */}
//           <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8">
//             <div className="flex items-center gap-3 mb-5">
//               <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold shrink-0">1</span>
//               <h2 className="text-lg font-bold text-gray-900">About You</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 md:gap-x-5 md:gap-y-6">
//               <div>
//                 <label htmlFor="name" className={labelClass}>Full name *</label>
//                 <input id="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass('name')} />
//                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//               </div>
//               <div>
//                 <label htmlFor="email" className={labelClass}>Email address</label>
//                 <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass('email')} />
//                 <p className="text-xs text-gray-400 mt-1">Required if no social profiles below</p>
//                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//               </div>
//               <div>
//                 <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
//                 <input id="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass('location')} />
//                 {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
//               </div>
//               <div className="md:col-span-2">
//                 <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
//                 <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass('intro')} />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className={labelClass}>Online profiles / websites (handle or URL)</label>
//               <p className="text-xs text-gray-400 mb-3">At least one required if no email above.</p>
//               {socialProfiles.map((profile, index) => (
//                 <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2 items-start">
//                   <div className="flex w-full sm:w-auto gap-2">
//                     <select
//                       value={profile.platform}
//                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
//                       className={`w-1/2 sm:w-36 rounded-lg border ${errors.socialProfiles ? 'border-red-400' : 'border-gray-400'} bg-white px-3 py-2.5 md:py-3 text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400`}
//                     >
//                       <option value="">Select</option>
//                       {PLATFORM_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                     <input
//                       type="text"
//                       placeholder="Handle or URL"
//                       value={profile.handle}
//                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
//                       className={`${inputClass('socialHandle')} flex-1`}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeSocialRow(index)}
//                     disabled={socialProfiles.length === 1}
//                     className="text-gray-400 hover:text-red-500 p-2 disabled:opacity-20 transition-colors self-center sm:self-start"
//                     title="Remove"
//                   >
//                     <span className="flex items-center justify-center w-8 h-8">✕</span>
//                   </button>
//                 </div>
//               ))}
//               {errors.socialProfiles && (
//                 <p className="text-red-500 text-xs mt-1">{errors.socialProfiles}</p>
//               )}
//               <button
//                 type="button"
//                 onClick={addSocialRow}
//                 className="mt-2 block w-full sm:w-auto text-left text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//               >
//                 + Add another profile
//               </button>
//             </div>
//           </section>

//           {/* 2. YOUR WORKSPACE (required) */}
//           <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8">
//             <div className="flex items-center gap-3 mb-5">
//               <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold shrink-0">2</span>
//               <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
//             </div>

//             <div>
//               <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
//               <textarea id="description" rows={5} value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass('description')} />
//               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//             </div>

//             {/* IMAGE UPLOAD */}
//             <div className="mt-6">
//               <label className={labelClass}>Upload images (at least 5) *</label>
//               <p className="text-xs text-gray-400 mb-3">Up to 10 images. Max {MAX_FILE_SIZE_MB} MB each.</p>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//                 <label
//                   htmlFor="media-upload"
//                   className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center rounded-lg border border-gray-400 bg-white px-5 py-2.5 md:py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition active:scale-95"
//                 >
//                   Choose images
//                 </label>
//                 <input
//                   id="media-upload"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleMediaSelect}
//                   className="sr-only"
//                 />
//                 <span className="text-sm text-gray-500">
//                   {mediaFiles.length > 0
//                     ? `${mediaFiles.length} file${mediaFiles.length > 1 ? 's' : ''} selected`
//                     : 'No files chosen'}
//                 </span>
//               </div>
//               {errors.mediaFiles && <p className="text-red-500 text-xs mt-2">{errors.mediaFiles}</p>}

//               {mediaPreviews.length > 0 && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
//                   {mediaPreviews.map((previewUrl, idx) => (
//                     <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
//                       <img
//                         src={previewUrl}
//                         alt={`Preview ${idx + 1}`}
//                         className="h-28 w-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeMedia(idx)}
//                         className="absolute top-1 right-1 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {mediaFiles.length < 5 && (
//                 <p className="text-xs text-gray-400 mt-2">
//                   {5 - mediaFiles.length} more image{5 - mediaFiles.length > 1 ? 's' : ''} required.
//                 </p>
//               )}
//             </div>

//             {/* Gear list */}
//             <div className="mt-6">
//               <label className={labelClass}>Workspace items / gear (at least 7) *</label>
//               <p className="text-xs text-gray-400 mb-4">List every major item. Add an affiliate link (optional).</p>
//               <div className="space-y-3">
//                 {gearItems.map((item, index) => (
//                   <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
//                     <div className="flex-1 w-full">
//                       <input
//                         type="text"
//                         placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
//                         value={item.name}
//                         onChange={(e) => handleGearNameChange(index, e.target.value)}
//                         className={inputClass(`gear-${index}`)}
//                       />
//                     </div>
//                     <div className="flex w-full sm:w-auto gap-2">
//                       {/* Link input – hidden on mobile */}
//                       <input
//                         type="url"
//                         placeholder="Link (optional)"
//                         value={item.link}
//                         onChange={(e) => handleGearLinkChange(index, e.target.value)}
//                         className="hidden sm:block flex-1 sm:flex-none sm:w-48 rounded-lg border border-gray-400 bg-white px-3 py-2.5 md:px-4 md:py-3 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeGearRow(index)}
//                         disabled={gearItems.length <= 7}
//                         className="text-gray-400 hover:text-red-500 disabled:opacity-20 transition-colors p-2 self-center"
//                         title="Remove"
//                       >
//                         <span className="flex items-center justify-center w-8 h-8">✕</span>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {errors.gearItems && <p className="text-red-500 text-xs mt-1">{errors.gearItems}</p>}
//               <button type="button" onClick={addGearRow} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-3 inline-flex items-center gap-1">
//                 + Add another item
//               </button>
//             </div>
//           </section>

//           {/* 3. MORE ABOUT YOUR SETUP (optional) */}
//           <section ref={optionalRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8">
//             <div className="flex items-center gap-3 mb-5">
//               <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold shrink-0">3</span>
//               <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
//               <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
//             </div>

//             {!showOptional ? (
//               <button
//                 type="button"
//                 onClick={() => setShowOptional(true)}
//                 className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-400 p-4 text-left hover:border-gray-500 hover:bg-gray-50 transition-colors"
//               >
//                 <div>
//                   <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
//                   <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
//                 </div>
//                 <span className="text-gray-400 text-2xl leading-none ml-4">+</span>
//               </button>
//             ) : (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 md:gap-x-5 md:gap-y-6">
//                   <div>
//                     <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
//                     <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass('budget')} />
//                   </div>
//                   <div>
//                     <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
//                     <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass('spaceSize')} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 md:gap-x-5 md:gap-y-6">
//                   <div>
//                     <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
//                     <textarea id="favoriteItem" rows={3} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass('favoriteItem')} />
//                   </div>
//                   <div>
//                     <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
//                     <textarea id="recentAddition" rows={3} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass('recentAddition')} />
//                   </div>
//                 </div>

//                 <hr className="border-gray-200" />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 md:gap-x-5 md:gap-y-6">
//                   <div>
//                     <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
//                     <textarea id="desiredChange" rows={4} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass('desiredChange')} />
//                   </div>
//                   <div>
//                     <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
//                     <textarea id="decorativeTouches" rows={4} value={formData.decorativeTouches} onChange={handleInputChange} placeholder="Plants, neon sign, art prints, figurines…" className={inputClass('decorativeTouches')} />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
//                   <textarea id="comfortCable" rows={3} value={formData.comfortCable} onChange={handleInputChange} placeholder="Standing desk, ergo chair, under-desk trays…" className={inputClass('comfortCable')} />
//                 </div>

//                 <hr className="border-gray-200" />

//                 <div>
//                   <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
//                   <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass('softwareTools')} />
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* 4. CONSENT & SUBMIT */}
//           <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8">
//             <div className="space-y-4">
//               <label className={`flex items-start gap-3 cursor-pointer ${errors.consent ? 'text-red-500' : ''}`}>
//                 <input
//                   type="checkbox"
//                   id="consent"
//                   checked={formData.consent}
//                   onChange={handleInputChange}
//                   className="mt-0.5 h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 shrink-0"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
//                 </span>
//               </label>
//               {errors.consent && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consent}</p>}
//               <label className="flex items-start gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   id="newsletter"
//                   checked={formData.newsletter}
//                   onChange={handleInputChange}
//                   className="mt-0.5 h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 shrink-0"
//                 />
//                 <span className="text-sm text-gray-700">
//                   Send me updates, featured setups, and community news.
//                 </span>
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full mt-6 bg-gray-900 text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition active:scale-[0.98] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-400"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
//             </button>

//             {message && (
//               <div
//                 className={`mt-5 text-sm font-medium p-3 rounded-lg border ${
//                   message.type === 'success'
//                     ? 'bg-green-50 border-green-200 text-green-700'
//                     : 'bg-red-50 border-red-200 text-red-700'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}
//           </section>
//         </form>
//       </div>
//     </section>
//   )
// }












'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadMedia } from '@/actions/uploadMedia'

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                 */
/* ------------------------------------------------------------------ */
type SocialProfile = {
    platform: string
    handle: string
}

type GearItem = {
    name: string
    link: string
}

const PLATFORM_OPTIONS = [
    'GitHub',
    'Twitter / X',
    'Instagram',
    'LinkedIn',
    'YouTube',
    'Behance',
    'Dribbble',
    'Personal Website',
    'Other',
]

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/* ------------------------------------------------------------------ */
/*  Component – fully responsive (mobile‑first + desktop polish)      */
/* ------------------------------------------------------------------ */
export default function SubmitForm() {
    const supabase = createClient()
    const optionalRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        intro: '',
        location: '',
        description: '',
        budget: '',
        spaceSize: '',
        favoriteItem: '',
        recentAddition: '',
        desiredChange: '',
        comfortCable: '',
        decorativeTouches: '',
        softwareTools: '',
        consent: false,
        newsletter: false,
    })

    const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
        { platform: '', handle: '' },
    ])

    const [gearItems, setGearItems] = useState<GearItem[]>(
        Array(7).fill({ name: '', link: '' })
    )

    const [mediaFiles, setMediaFiles] = useState<File[]>([])
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [showOptional, setShowOptional] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

    // Scroll to top on mount
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    /* ---------- Validation (unchanged logic) ----------------------- */
    const validate = (): Record<string, string> => {
        const newErrors: Record<string, string> = {}
        const validSocialProfiles = socialProfiles.filter(
            (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
        )

        if (!formData.email && validSocialProfiles.length === 0) {
            newErrors.email = 'Email is required if no social profile is provided.'
            newErrors.socialProfiles = 'At least one social profile or email is required.'
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required.'
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required.'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Please describe your desk setup.'
        }
        if (mediaFiles.length < 5) {
            newErrors.mediaFiles = 'Please upload at least 5 images.'
        }
        const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
        if (validGearItems.length < 7) {
            newErrors.gearItems = 'Please list at least 7 workspace items (each item must have a name).'
        }
        if (!formData.consent) {
            newErrors.consent = 'You must agree to be featured.'
        }
        return newErrors
    }

    const validateField = (fieldId: string): string | undefined => {
        const fieldErrors = validate()
        return fieldErrors[fieldId]
    }

    const handleFieldBlur = (fieldId: string) => {
        setTouchedFields((prev) => new Set(prev).add(fieldId))
        const fieldError = validateField(fieldId)
        if (fieldError) {
            setErrors((prev) => ({ ...prev, [fieldId]: fieldError }))
        } else {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[fieldId]
                return next
            })
        }
    }

    /* ---------- Handlers ------------------------------------------- */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { id, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData((prev) => ({ ...prev, [id]: val }))
        if (errors[id]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[id]
                return next
            })
        }
    }

    /* Social profiles */
    const handleSocialChange = (
        index: number,
        field: 'platform' | 'handle',
        value: string,
    ) => {
        const updated = [...socialProfiles]
        updated[index][field] = value
        setSocialProfiles(updated)
        if (errors.socialProfiles) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next.socialProfiles
                return next
            })
        }
    }

    const addSocialRow = () => {
        if (socialProfiles.length < 5) {
            setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
        }
    }

    const removeSocialRow = (index: number) => {
        if (socialProfiles.length === 1) return
        setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
    }

    /* Gear list */
    const handleGearNameChange = (index: number, name: string) => {
        const updated = [...gearItems]
        updated[index] = { ...updated[index], name }
        setGearItems(updated)
        if (errors.gearItems) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next.gearItems
                return next
            })
        }
    }

    const handleGearLinkChange = (index: number, link: string) => {
        const updated = [...gearItems]
        updated[index] = { ...updated[index], link }
        setGearItems(updated)
    }

    const addGearRow = () => {
        if (gearItems.length < 15) {
            setGearItems([...gearItems, { name: '', link: '' }])
        }
    }

    const removeGearRow = (index: number) => {
        if (gearItems.length <= 7) return
        setGearItems(gearItems.filter((_, i) => i !== index))
    }

    /* Media upload */
    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
        if (oversizedFiles.length > 0) {
            const names = oversizedFiles.map((f) => f.name).join(', ')
            setErrors((prev) => ({
                ...prev,
                mediaFiles: `File(s) "${names}" exceed ${MAX_FILE_SIZE_MB} MB limit.`,
            }))
            return
        }

        const total = mediaFiles.length + files.length
        if (total > 10) {
            setErrors((prev) => ({
                ...prev,
                mediaFiles: 'Maximum 10 images allowed.',
            }))
            return
        }

        if (errors.mediaFiles) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next.mediaFiles
                return next
            })
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file))
        setMediaPreviews((prev) => [...prev, ...newPreviews])
        setMediaFiles((prev) => [...prev, ...files])
    }

    const removeMedia = (index: number) => {
        const updatedFiles = [...mediaFiles]
        updatedFiles.splice(index, 1)
        setMediaFiles(updatedFiles)
        const updatedPreviews = [...mediaPreviews]
        URL.revokeObjectURL(updatedPreviews[index])
        updatedPreviews.splice(index, 1)
        setMediaPreviews(updatedPreviews)
    }

    const triggerFilePicker = () => {
        fileInputRef.current?.click()
    }

    /* ---------- Submit --------------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const allFields = ['name', 'email', 'location', 'description', 'consent']
        setTouchedFields(new Set(allFields))

        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            const firstErrorKey = Object.keys(newErrors)[0]
            const el = document.getElementById(firstErrorKey)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        if (!showOptional) {
            setShowOptional(true)
            setTimeout(() => {
                optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 150)
            return
        }

        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let submissionId = ''
        for (let i = 0; i < 2; i++) {
            submissionId += chars[Math.floor(Math.random() * chars.length)]
        }

        setErrors({})
        setIsSubmitting(true)
        setMessage(null)

        try {
            let mediaUrls: string[] = []
            if (mediaFiles.length > 0) {
                const uploadPromises = mediaFiles.map(async (file) => {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('userName', formData.name)
                    fd.append('submissionId', submissionId)
                    const result = await uploadMedia(fd)
                    if (!result.success || !result.url) {
                        throw new Error(result.error || 'Image upload failed')
                    }
                    return result.url
                })
                mediaUrls = await Promise.all(uploadPromises)
            }

            const validSocialProfiles = socialProfiles.filter(
                (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
            )
            const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
            const gearData = validGearItems.map(({ name, link }) => ({
                name,
                link: link.trim() || null,
            }))

            const { error } = await supabase.from('submissions').insert({
                email: formData.email || null,
                name: formData.name,
                intro: formData.intro || null,
                location: formData.location,
                description: formData.description,
                budget: formData.budget || null,
                space_size: formData.spaceSize || null,
                favorite_item: formData.favoriteItem || null,
                recent_addition: formData.recentAddition || null,
                desired_change: formData.desiredChange || null,
                comfort_cable: formData.comfortCable || null,
                decorative_touches: formData.decorativeTouches || null,
                software_tools: formData.softwareTools || null,
                social_profiles: validSocialProfiles,
                image_urls: mediaUrls,
                gear_list: gearData,
                consent: formData.consent,
                newsletter: formData.newsletter,
                status: 'pending',
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Submitted! We\'ll review your workspace. ✨' })

            // Reset form
            setFormData({
                email: '',
                name: '',
                intro: '',
                location: '',
                description: '',
                budget: '',
                spaceSize: '',
                favoriteItem: '',
                recentAddition: '',
                desiredChange: '',
                comfortCable: '',
                decorativeTouches: '',
                softwareTools: '',
                consent: false,
                newsletter: false,
            })
            setSocialProfiles([{ platform: '', handle: '' }])
            setGearItems(Array(7).fill({ name: '', link: '' }))
            setMediaFiles([])
            setMediaPreviews([])
            setShowOptional(false)
            setErrors({})
            setTouchedFields(new Set())

            topRef.current?.scrollIntoView({ behavior: 'smooth' })

        } catch (err: any) {
            console.error(err)
            setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ---------- UI Helpers ----------------------------------------- */
    const inputClass = (fieldId: string) => {
        const hasError = errors[fieldId] && touchedFields.has(fieldId)
        const isFocused = focusedField === fieldId
        return `w-full rounded-xl border-2 px-2 py-3 md:py-3 text-base text-gray-900 placeholder:text-gray-400 
      transition-all duration-200 ease-out bg-white
      ${hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : isFocused
                    ? 'border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]'
                    : 'border-gray-300 hover:border-gray-400'
            }
      focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400
      disabled:opacity-60 disabled:cursor-not-allowed
      appearance-none`
    }

    const labelClass = 'block text-sm font-semibold text-gray-800 mb-1 tracking-tight'

    const errorMessage = (fieldId: string) => {
        if (errors[fieldId] && touchedFields.has(fieldId)) {
            return <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                <span className="inline-block w-3.5 h-3.5 flex-shrink-0">⚠️</span>
                {errors[fieldId]}
            </p>
        }
        return null
    }

    const sectionHeader = (num: number, title: string, subtitle?: string) => (
        <div className="flex items-start gap-3 mb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold shadow-sm">
                {num}
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )

    const cardClass = 'bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 md:p-7 transition-all'

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-6 md:py-12 lg:py-20">
            <div ref={topRef} className="max-w-4xl mx-auto">

                {/* --- Header --- */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 bg-gray-900/5 rounded-full px-4 py-1.5 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-gray-700 tracking-wide">Submit your setup</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                        Show us your desk setup
                        <span className="block text-4xl md:text-5xl lg:text-6xl mt-1">✨</span>
                    </h1>
                    <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Fill out the form below for a chance to be featured. Required fields <span className="text-red-500">*</span> are mandatory.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7" noValidate>

                    {/* ============================================================ */}
                    {/* 1. ABOUT YOU */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        {sectionHeader(1, 'About You')}

                        <div className="space-y-5">
                            {/* Name + Email + Location – grid on desktop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className={labelClass}>
                                        Full name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => { setFocusedField(null); handleFieldBlur('name') }}
                                        placeholder="Jane Smith"
                                        className={inputClass('name')}
                                        autoComplete="name"
                                    />
                                    {errorMessage('name')}
                                </div>
                                <div>
                                    <label htmlFor="email" className={labelClass}>Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => { setFocusedField(null); handleFieldBlur('email') }}
                                        placeholder="you@example.com"
                                        className={inputClass('email')}
                                        autoComplete="email"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5 ml-0.5">Required if no social profile</p>
                                    {errorMessage('email')}
                                </div>
                            </div>

                            {/* Location – full width */}
                            <div>
                                <label htmlFor="location" className={labelClass}>
                                    Location <span className="text-red-500">*</span>
                                    {/* <span className="font-normal text-gray-400 text-xs ml-1.5">(City, State, Country)</span> */}
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('location')}
                                    onBlur={() => { setFocusedField(null); handleFieldBlur('location') }}
                                    placeholder="San Francisco, CA, USA"
                                    className={inputClass('location')}
                                    autoComplete="address-level2"
                                />
                                {errorMessage('location')}
                            </div>

                            {/* Intro */}
                            <div>
                                <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
                                <textarea
                                    id="intro"
                                    rows={4}
                                    value={formData.intro}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('intro')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Write a couple of paragraphs – your background, your work, your passions…"
                                    className={inputClass('intro')}
                                />
                            </div>

                            {/* Social Profiles */}
                            <div className="pt-1">
                                <label className={labelClass}>Online profiles / websites</label>
                                <p className="text-xs text-gray-400 mb-3 ml-0.5">At least one required if no email above.</p>

                                <div className="space-y-3">
                                    {socialProfiles.map((profile, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
                                            <div className="flex w-full gap-2 flex-1">
                                                <select
                                                    value={profile.platform}
                                                    onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                                                    className={`w-1/2 sm:w-36 rounded-xl border-2 px-3 py-3.5 md:py-3 text-base text-gray-900 bg-white
                                                ${errors.socialProfiles && touchedFields.has('socialProfiles')
                                                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                            : 'border-gray-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                                                        }
                                                focus:outline-none transition-all duration-200 appearance-none`}
                                                >
                                                    <option value="">Select</option>
                                                    {PLATFORM_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Handle or URL"
                                                    value={profile.handle}
                                                    onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
                                                    onFocus={() => setFocusedField('socialHandle')}
                                                    onBlur={() => { setFocusedField(null); setTouchedFields(prev => new Set(prev).add('socialProfiles')) }}
                                                    className={`${inputClass('socialHandle')} flex-1`}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSocialRow(index)}
                                                disabled={socialProfiles.length === 1}
                                                className="text-gray-400 hover:text-red-500 disabled:opacity-25 transition-colors p-2.5 self-center shrink-0 touch-manipulation"
                                                aria-label="Remove social profile"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {errorMessage('socialProfiles')}

                                <button
                                    type="button"
                                    onClick={addSocialRow}
                                    disabled={socialProfiles.length >= 5}
                                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                                >
                                    <span className="text-lg leading-none">+</span> Add another profile
                                    {socialProfiles.length >= 5 && <span className="text-xs text-gray-400 font-normal">(max 5)</span>}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ============================================================ */}
                    {/* 2. YOUR WORKSPACE */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        {sectionHeader(2, 'Your Workspace', 'Required')}

                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <label htmlFor="description" className={labelClass}>
                                    Story behind your desk setup <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('description')}
                                    onBlur={() => { setFocusedField(null); handleFieldBlur('description') }}
                                    placeholder="What inspired your setup? Any theme or philosophy? How did you build it?"
                                    className={inputClass('description')}
                                />
                                {errorMessage('description')}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className={labelClass}>
                                    Upload images <span className="text-red-500">*</span>
                                    <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 5)</span>
                                </label>
                                <p className="text-xs text-gray-400 mb-3 ml-0.5">Up to 10 images. Max {MAX_FILE_SIZE_MB} MB each.</p>

                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        id="media-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleMediaSelect}
                                        className="sr-only"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFilePicker}
                                        className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-5 py-5 md:py-6 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 touch-manipulation"
                                    >
                                        <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            {mediaFiles.length > 0 ? `${mediaFiles.length} image${mediaFiles.length > 1 ? 's' : ''} selected` : 'Choose images'}
                                        </span>
                                    </button>
                                </div>

                                {errorMessage('mediaFiles')}

                                {/* Image preview grid – responsive columns */}
                                {mediaPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                                        {mediaPreviews.map((previewUrl, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group rounded-xl overflow-hidden border-2 border-gray-200 aspect-square bg-gray-100"
                                            >
                                                <img
                                                    src={previewUrl}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(idx)}
                                                    className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:bg-white transition-colors touch-manipulation"
                                                    aria-label="Remove image"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                    {idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mediaFiles.length > 0 && mediaFiles.length < 5 && (
                                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
                                        <span>📸</span>
                                        {5 - mediaFiles.length} more image{5 - mediaFiles.length > 1 ? 's' : ''} required.
                                    </p>
                                )}
                            </div>

                            {/* Gear Items */}
                            <div>
                                <label className={labelClass}>
                                    Workspace items / gear <span className="text-red-500">*</span>
                                    <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 7)</span>
                                </label>
                                <p className="text-xs text-gray-400 mb-3 ml-0.5">List every major item. Add an affiliate link (optional).</p>

                                <div className="space-y-3">
                                    {gearItems.map((item, index) => {
                                        const isNameError = errors.gearItems && !item.name.trim() && touchedFields.has('gearItems')
                                        return (
                                            <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
                                                <div className="flex-1 w-full sm:w-auto">
                                                    <input
                                                        type="text"
                                                        placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
                                                        value={item.name}
                                                        onChange={(e) => handleGearNameChange(index, e.target.value)}
                                                        onFocus={() => setFocusedField('gearItems')}
                                                        onBlur={() => { setFocusedField(null); setTouchedFields(prev => new Set(prev).add('gearItems')) }}
                                                        className={`${inputClass(`gear-${index}`)} ${isNameError ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' : ''}`}
                                                    />
                                                </div>
                                                <div className="flex w-full sm:w-auto gap-2 flex-1">
                                                    <input
                                                        type="url"
                                                        placeholder="Link (optional)"
                                                        value={item.link}
                                                        onChange={(e) => handleGearLinkChange(index, e.target.value)}
                                                        className="flex-1 rounded-xl border-2 border-gray-300 px-3 py-3.5 md:py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGearRow(index)}
                                                        disabled={gearItems.length <= 7}
                                                        className="text-gray-400 hover:text-red-500 disabled:opacity-25 transition-colors p-2.5 self-center shrink-0 touch-manipulation"
                                                        aria-label="Remove gear item"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {errorMessage('gearItems')}

                                <button
                                    type="button"
                                    onClick={addGearRow}
                                    disabled={gearItems.length >= 15}
                                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                                >
                                    <span className="text-lg leading-none">+</span> Add another item
                                    {gearItems.length >= 15 && <span className="text-xs text-gray-400 font-normal">(max 15)</span>}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ============================================================ */}
                    {/* 3. MORE ABOUT YOUR SETUP (optional) */}
                    {/* ============================================================ */}
                    <section ref={optionalRef} className={cardClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">optional</span>
                                </div>
                            </div>
                        </div>

                        {!showOptional ? (
                            <button
                                type="button"
                                onClick={() => setShowOptional(true)}
                                className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 p-4 md:p-5 text-left hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-200 touch-manipulation"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
                                </div>
                                <span className="text-2xl text-gray-400 ml-4 flex-shrink-0">+</span>
                            </button>
                        ) : (
                            <div className="space-y-5 animate-fadeIn">
                                {/* Budget & Space – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="budget" className={labelClass}>What's your approximate setup budget?</label>
                                        <input
                                            id="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            placeholder="$2,500"
                                            className={inputClass('budget')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
                                        <input
                                            id="spaceSize"
                                            value={formData.spaceSize}
                                            onChange={handleInputChange}
                                            placeholder="120 sq ft / 11 m²"
                                            className={inputClass('spaceSize')}
                                        />
                                    </div>
                                </div>

                                {/* Favorite & Recent – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="favoriteItem" className={labelClass}>What's your favorite item on this desk?</label>
                                        <textarea
                                            id="favoriteItem"
                                            rows={3}
                                            value={formData.favoriteItem}
                                            onChange={handleInputChange}
                                            placeholder="Tell us why it's special…"
                                            className={inputClass('favoriteItem')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="recentAddition" className={labelClass}>What's the most recent addition?</label>
                                        <textarea
                                            id="recentAddition"
                                            rows={3}
                                            value={formData.recentAddition}
                                            onChange={handleInputChange}
                                            placeholder="What did you add last?"
                                            className={inputClass('recentAddition')}
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Change & Decor – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
                                        <textarea
                                            id="desiredChange"
                                            rows={4}
                                            value={formData.desiredChange}
                                            onChange={handleInputChange}
                                            placeholder="Better cable management, new chair…"
                                            className={inputClass('desiredChange')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
                                        <textarea
                                            id="decorativeTouches"
                                            rows={4}
                                            value={formData.decorativeTouches}
                                            onChange={handleInputChange}
                                            placeholder="Plants, neon sign, art prints, figurines…"
                                            className={inputClass('decorativeTouches')}
                                        />
                                    </div>
                                </div>

                                {/* Comfort & Cable – full width */}
                                <div>
                                    <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
                                    <textarea
                                        id="comfortCable"
                                        rows={3}
                                        value={formData.comfortCable}
                                        onChange={handleInputChange}
                                        placeholder="Standing desk, ergo chair, under-desk trays…"
                                        className={inputClass('comfortCable')}
                                    />
                                </div>

                                <hr className="border-gray-200" />

                                {/* Software – full width */}
                                <div>
                                    <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
                                    <textarea
                                        id="softwareTools"
                                        rows={3}
                                        value={formData.softwareTools}
                                        onChange={handleInputChange}
                                        placeholder="Figma, VS Code, Notion, Spotify…"
                                        className={inputClass('softwareTools')}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowOptional(false)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors touch-manipulation flex items-center gap-1"
                                >
                                    <span>−</span> Hide optional details
                                </button>
                            </div>
                        )}
                    </section>

                    {/* ============================================================ */}
                    {/* 4. CONSENT & SUBMIT */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <label className={`flex items-start gap-3 cursor-pointer ${errors.consent && touchedFields.has('consent') ? 'text-red-500' : ''}`}>
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                    onBlur={() => { setTouchedFields(prev => new Set(prev).add('consent')) }}
                                    className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0 shrink-0 cursor-pointer transition-all"
                                />
                                <span className="text-sm text-gray-700 leading-relaxed">
                                    I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. <span className="text-red-500">*</span>
                                </span>
                            </label>
                            {errorMessage('consent')}

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleInputChange}
                                    className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0 shrink-0 cursor-pointer transition-all"
                                />
                                <span className="text-sm text-gray-700 leading-relaxed">
                                    Send me updates, featured setups, and community news.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full max-w-md mx-auto mt-6 block bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gray-300 touch-manipulation text-base shadow-sm"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting…
                                </span>
                            ) : (
                                'Submit workspace for review'
                            )}
                        </button>

                        {message && (
                            <div
                                className={`mt-4 text-sm font-medium p-4 rounded-xl border-2 animate-fadeIn max-w-2xl mx-auto ${
                                    message.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </section>

                    {/* --- Footer note --- */}
                    <p className="text-center text-xs text-gray-400 pt-3 pb-6">
                        ✦ Your submission will be reviewed before being featured ✦
                    </p>

                </form>
            </div>

            {/* Inject keyframe animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s ease-out forwards;
                }
            `}</style>
        </section>
    )
}
































































































































// 'use client'

// import { useState, useRef } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { uploadMedia } from '@/actions/uploadMedia' // server action

// /* ------------------------------------------------------------------ */
// /*  Types & Constants                                                 */
// /* ------------------------------------------------------------------ */
// type SocialProfile = {
//   platform: string
//   handle: string
// }

// type GearItem = {
//   name: string
//   link: string
// }

// const PLATFORM_OPTIONS = [
//   'GitHub',
//   'Twitter / X',
//   'Instagram',
//   'LinkedIn',
//   'YouTube',
//   'Behance',
//   'Dribbble',
//   'Personal Website',
//   'Other',
// ]

// const MAX_FILE_SIZE_MB = 5
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// /* ------------------------------------------------------------------ */
// /*  Component                                                         */
// /* ------------------------------------------------------------------ */
// export default function SubmitForm() {
//   const supabase = createClient()
//   const optionalRef = useRef<HTMLDivElement>(null)

//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     intro: '',
//     location: '',
//     description: '',
//     budget: '',
//     spaceSize: '',
//     favoriteItem: '',
//     recentAddition: '',
//     desiredChange: '',
//     comfortCable: '',
//     decorativeTouches: '',
//     softwareTools: '',
//     consent: false,
//     newsletter: false,
//   })

//   const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
//     { platform: '', handle: '' },
//   ])

//   const [gearItems, setGearItems] = useState<GearItem[]>(
//     Array(7).fill({ name: '', link: '' })
//   )

//   // Only images now
//   const [mediaFiles, setMediaFiles] = useState<File[]>([])
//   const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
//   const [showOptional, setShowOptional] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   /* ---------- Validation (reusable) -------------------------------- */
//   const validate = (): Record<string, string> => {
//     const newErrors: Record<string, string> = {}
//     const validSocialProfiles = socialProfiles.filter(
//       (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//     )

//     if (!formData.email && validSocialProfiles.length === 0) {
//       newErrors.email = 'Email is required if no social profile is provided.'
//       newErrors.socialProfiles = 'At least one social profile or email is required.'
//     }
//     if (!formData.name.trim()) {
//       newErrors.name = 'Full name is required.'
//     }
//     if (!formData.location.trim()) {
//       newErrors.location = 'Location is required.'
//     }
//     if (!formData.description.trim()) {
//       newErrors.description = 'Please describe your desk setup.'
//     }
//     if (mediaFiles.length < 5) {
//       newErrors.mediaFiles = 'Please upload at least 5 images.'
//     }
//     const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//     if (validGearItems.length < 7) {
//       newErrors.gearItems = 'Please list at least 7 workspace items (each item must have a name).'
//     }
//     if (!formData.consent) {
//       newErrors.consent = 'You must agree to be featured.'
//     }
//     return newErrors
//   }

//   /* ---------- Handlers -------------------------------------------- */
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { id, value, type } = e.target
//     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     setFormData((prev) => ({ ...prev, [id]: val }))
//     if (errors[id]) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next[id]
//         return next
//       })
//     }
//   }

//   /* Social profiles */
//   const handleSocialChange = (
//     index: number,
//     field: 'platform' | 'handle',
//     value: string,
//   ) => {
//     const updated = [...socialProfiles]
//     updated[index][field] = value
//     setSocialProfiles(updated)
//     if (errors.socialProfiles) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.socialProfiles
//         return next
//       })
//     }
//   }

//   const addSocialRow = () => setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
//   const removeSocialRow = (index: number) => {
//     if (socialProfiles.length === 1) return
//     setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
//   }

//   /* Gear list */
//   const handleGearNameChange = (index: number, name: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], name }
//     setGearItems(updated)
//     if (errors.gearItems) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.gearItems
//         return next
//       })
//     }
//   }

//   const handleGearLinkChange = (index: number, link: string) => {
//     const updated = [...gearItems]
//     updated[index] = { ...updated[index], link }
//     setGearItems(updated)
//   }

//   const addGearRow = () => setGearItems([...gearItems, { name: '', link: '' }])
//   const removeGearRow = (index: number) => {
//     if (gearItems.length <= 7) return
//     setGearItems(gearItems.filter((_, i) => i !== index))
//   }

//   /* Media upload – IMAGES ONLY ------------------------------------ */
//   const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
//     if (!files.length) return

//     const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
//     if (oversizedFiles.length > 0) {
//       const names = oversizedFiles.map((f) => f.name).join(', ')
//       setErrors((prev) => ({
//         ...prev,
//         mediaFiles: `File(s) "${names}" exceed ${MAX_FILE_SIZE_MB} MB limit.`,
//       }))
//       return
//     }

//     const total = mediaFiles.length + files.length
//     if (total > 10) {
//       setErrors((prev) => ({
//         ...prev,
//         mediaFiles: 'Maximum 10 images allowed.',
//       }))
//       return
//     }

//     if (errors.mediaFiles) {
//       setErrors((prev) => {
//         const next = { ...prev }
//         delete next.mediaFiles
//         return next
//       })
//     }

//     const newPreviews = files.map((file) => URL.createObjectURL(file))
//     setMediaPreviews((prev) => [...prev, ...newPreviews])
//     setMediaFiles((prev) => [...prev, ...files])
//   }

//   const removeMedia = (index: number) => {
//     const updatedFiles = [...mediaFiles]
//     updatedFiles.splice(index, 1)
//     setMediaFiles(updatedFiles)
//     const updatedPreviews = [...mediaPreviews]
//     URL.revokeObjectURL(updatedPreviews[index])
//     updatedPreviews.splice(index, 1)
//     setMediaPreviews(updatedPreviews)
//   }

//   /* ---------- Submit ---------------------------------------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // 1. Always validate required fields first
//     const newErrors = validate()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       // scroll to first error
//       const firstErrorKey = Object.keys(newErrors)[0]
//       const el = document.getElementById(firstErrorKey)
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       }
//       return
//     }

//     // 2. If optional section is hidden, open it now (after validation passes)
//     if (!showOptional) {
//       setShowOptional(true)
//       setTimeout(() => {
//         optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//       }, 100)
//       return
//     }


//     // Generate a short 2‑character unique ID (e.g. "a7")
//     const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
//     let submissionId = ''
//     for (let i = 0; i < 2; i++) {
//       submissionId += chars[Math.floor(Math.random() * chars.length)]
//     }


//     // 3. Required fields passed & optional is visible → final submit
//     setErrors({})
//     setIsSubmitting(true)
//     setMessage(null)

//     try {
//       // Upload images (only images)
//       let mediaUrls: string[] = []
//       if (mediaFiles.length > 0) {
//         const uploadPromises = mediaFiles.map(async (file) => {
//           const fd = new FormData()
//           fd.append('file', file)
//           fd.append('userName', formData.name)
//           fd.append('submissionId', submissionId)
//           const result = await uploadMedia(fd)
//           if (!result.success || !result.url) {
//             throw new Error(result.error || 'Image upload failed')
//           }
//           return result.url
//         })
//         mediaUrls = await Promise.all(uploadPromises)
//       }


//       const validSocialProfiles = socialProfiles.filter(
//         (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//       )
//       const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//       const gearData = validGearItems.map(({ name, link }) => ({
//         name,
//         link: link.trim() || null,
//       }))

//       const { error } = await supabase.from('submissions').insert({
//         email: formData.email || null,
//         name: formData.name,
//         intro: formData.intro || null,
//         location: formData.location,
//         description: formData.description,
//         budget: formData.budget || null,
//         space_size: formData.spaceSize || null,
//         favorite_item: formData.favoriteItem || null,
//         recent_addition: formData.recentAddition || null,
//         desired_change: formData.desiredChange || null,
//         comfort_cable: formData.comfortCable || null,
//         decorative_touches: formData.decorativeTouches || null,
//         software_tools: formData.softwareTools || null,
//         social_profiles: validSocialProfiles,
//         image_urls: mediaUrls,
//         gear_list: gearData,
//         consent: formData.consent,
//         newsletter: formData.newsletter,
//         status: 'pending',
//       })

//       if (error) throw error

//       setMessage({ type: 'success', text: 'Submitted! We’ll review your workspace. ✨' })

//       // Reset form
//       setFormData({
//         email: '',
//         name: '',
//         intro: '',
//         location: '',
//         description: '',
//         budget: '',
//         spaceSize: '',
//         favoriteItem: '',
//         recentAddition: '',
//         desiredChange: '',
//         comfortCable: '',
//         decorativeTouches: '',
//         softwareTools: '',
//         consent: false,
//         newsletter: false,
//       })
//       setSocialProfiles([{ platform: '', handle: '' }])
//       setGearItems(Array(7).fill({ name: '', link: '' }))
//       setMediaFiles([])
//       setMediaPreviews([])
//       setShowOptional(false)
//       setErrors({})
//     } catch (err: any) {
//       console.error(err)
//       setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   /* ---------- UI helpers ------------------------------------------ */
//   const inputClass = (fieldId: string) =>
//     `w-full rounded-lg border ${errors[fieldId] ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200'
//     } bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-gray-300 transition-shadow`

//   const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

//   return (
//     <section className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
//             Show us your desk setup ✨
//           </h1>
//           <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
//             Fill out the form below for a chance to be featured. Required fields (*) are mandatory.
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-10" noValidate>
//             {/* 1. ABOUT YOU */}
//             <section>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">1</span>
//                 <h2 className="text-lg font-bold text-gray-900">About You</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label htmlFor="name" className={labelClass}>Full name *</label>
//                   <input id="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Jane Smith" className={inputClass('name')} />
//                   {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="email" className={labelClass}>Email address</label>
//                   <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass('email')} />
//                   <p className="text-xs text-gray-400 mt-1">Required if no social profiles below</p>
//                   {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="location" className={labelClass}>Location * (City, State, Country)</label>
//                   <input id="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className={inputClass('location')} />
//                   {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
//                 </div>
//                 <div className="md:col-span-2">
//                   <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
//                   <textarea id="intro" rows={4} value={formData.intro} onChange={handleInputChange} placeholder="Write a couple of paragraphs – your background, your work, your passions…" className={inputClass('intro')} />
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <label className={labelClass}>Online profiles / websites (handle or URL)</label>
//                 <p className="text-xs text-gray-400 mb-3">At least one required if no email above.</p>
//                 {socialProfiles.map((profile, index) => (
//                   <div key={index} className="flex gap-2 mb-2 items-start">
//                     <select
//                       value={profile.platform}
//                       onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
//                       className={`w-1/3 md:w-1/4 rounded-lg border ${errors.socialProfiles ? 'border-red-500' : 'border-gray-200'
//                         } bg-white px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200`}
//                     >
//                       <option value="">Select</option>
//                       {PLATFORM_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                     <input
//                       type="text"
//                       placeholder="Handle or URL"
//                       value={profile.handle}
//                       onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
//                       className={`${inputClass('socialHandle')} flex-1`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSocialRow(index)}
//                       disabled={socialProfiles.length === 1}
//                       className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
//                       title="Remove"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//                 {errors.socialProfiles && (
//                   <p className="text-red-500 text-xs mt-1">{errors.socialProfiles}</p>
//                 )}
//                 <button type="button" onClick={addSocialRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-1 inline-flex items-center gap-1">
//                   + Add another profile
//                 </button>
//               </div>
//             </section>

//             {/* 2. YOUR WORKSPACE (required) */}
//             <section>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">2</span>
//                 <h2 className="text-lg font-bold text-gray-900">Your Workspace *</h2>
//               </div>

//               <div>
//                 <label htmlFor="description" className={labelClass}>Story behind your desk setup *</label>
//                 <textarea id="description" rows={5} value={formData.description} onChange={handleInputChange} placeholder="What inspired your setup? Any theme or philosophy? How did you build it?" className={inputClass('description')} />
//                 {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//               </div>

//               {/* IMAGE UPLOAD (IMAGES ONLY) */}
//               <div className="mt-6">
//                 <label className={labelClass}>Upload images (at least 5) *</label>
//                 <p className="text-xs text-gray-400 mb-3">You can upload up to 10 images. Max {MAX_FILE_SIZE_MB} MB per file.</p>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleMediaSelect}
//                   className={`text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition ${errors.mediaFiles ? 'border border-red-500 rounded-lg p-2' : ''
//                     }`}
//                 />
//                 {mediaPreviews.length > 0 && (
//                   <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
//                     {mediaPreviews.map((previewUrl, idx) => (
//                       <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
//                         <img src={previewUrl} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
//                         <button
//                           type="button"
//                           onClick={() => removeMedia(idx)}
//                           className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {errors.mediaFiles && <p className="text-red-500 text-xs mt-2">{errors.mediaFiles}</p>}
//                 <p className="text-xs text-gray-400 mt-2">
//                   {mediaFiles.length} image{mediaFiles.length !== 1 ? 's' : ''} selected
//                   {mediaFiles.length < 5 ? ' (minimum 5 required)' : ''}
//                 </p>
//               </div>

//               {/* Gear list */}
//               <div className="mt-6">
//                 <label className={labelClass}>Workspace items / gear (at least 7) *</label>
//                 <p className="text-xs text-gray-400 mb-4">List every major item. Add an affiliate link (optional).</p>
//                 <div className="space-y-3">
//                   {gearItems.map((item, index) => (
//                     <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//                       <div className="flex-1 w-full">
//                         <input
//                           type="text"
//                           placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
//                           value={item.name}
//                           onChange={(e) => handleGearNameChange(index, e.target.value)}
//                           className={inputClass(`gear-${index}`)}
//                         />
//                       </div>
//                       <div className="flex-1 sm:flex-[0.4] w-full">
//                         <input
//                           type="url"
//                           placeholder="Link (optional)"
//                           value={item.link}
//                           onChange={(e) => handleGearLinkChange(index, e.target.value)}
//                           className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-shadow"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeGearRow(index)}
//                         disabled={gearItems.length <= 7}
//                         className="text-gray-400 hover:text-red-500 p-3 disabled:opacity-20 transition-colors"
//                         title="Remove"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.gearItems && <p className="text-red-500 text-xs mt-1">{errors.gearItems}</p>}
//                 <button type="button" onClick={addGearRow} className="text-sm text-green-600 hover:text-green-700 font-medium mt-3 inline-flex items-center gap-1">
//                   + Add another item
//                 </button>
//               </div>
//             </section>

//             {/* 3. MORE ABOUT YOUR SETUP (optional) */}
//             <section ref={optionalRef}>
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
//                 <h2 className="text-lg font-bold text-gray-900">More About Your Setup</h2>
//                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">optional</span>
//               </div>

//               {!showOptional ? (
//                 <button
//                   type="button"
//                   onClick={() => setShowOptional(true)}
//                   className="w-full flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
//                 >
//                   <div>
//                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
//                     <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
//                   </div>
//                   <span className="text-gray-400 text-lg">+</span>
//                 </button>
//               ) : (
//                 <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="budget" className={labelClass}>What’s your approximate setup budget?</label>
//                       <input id="budget" value={formData.budget} onChange={handleInputChange} placeholder="$2,500" className={inputClass('budget')} />
//                     </div>
//                     <div>
//                       <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
//                       <input id="spaceSize" value={formData.spaceSize} onChange={handleInputChange} placeholder="120 sq ft / 11 m²" className={inputClass('spaceSize')} />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="favoriteItem" className={labelClass}>What’s your favorite item on this desk?</label>
//                       <textarea id="favoriteItem" rows={3} value={formData.favoriteItem} onChange={handleInputChange} placeholder="Tell us why it’s special…" className={inputClass('favoriteItem')} />
//                     </div>
//                     <div>
//                       <label htmlFor="recentAddition" className={labelClass}>What’s the most recent addition?</label>
//                       <textarea id="recentAddition" rows={3} value={formData.recentAddition} onChange={handleInputChange} placeholder="What did you add last?" className={inputClass('recentAddition')} />
//                     </div>
//                   </div>

//                   <hr className="border-gray-100" />

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
//                       <textarea id="desiredChange" rows={4} value={formData.desiredChange} onChange={handleInputChange} placeholder="Better cable management, new chair…" className={inputClass('desiredChange')} />
//                     </div>
//                     <div>
//                       <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
//                       <textarea id="decorativeTouches" rows={4} value={formData.decorativeTouches} onChange={handleInputChange} placeholder="Plants, neon sign, art prints, figurines…" className={inputClass('decorativeTouches')} />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
//                     <textarea id="comfortCable" rows={3} value={formData.comfortCable} onChange={handleInputChange} placeholder="Standing desk, ergo chair, under-desk trays…" className={inputClass('comfortCable')} />
//                   </div>

//                   <hr className="border-gray-100" />

//                   <div>
//                     <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use on a daily basis?</label>
//                     <textarea id="softwareTools" rows={3} value={formData.softwareTools} onChange={handleInputChange} placeholder="Figma, VS Code, Notion, Spotify…" className={inputClass('softwareTools')} />
//                   </div>
//                 </div>
//               )}
//             </section>

//             {/* 4. CONSENT & SUBMIT */}
//             <section className="border-t border-gray-200 pt-6">
//               <div className="space-y-4">
//                 <label className={`flex items-start gap-3 cursor-pointer ${errors.consent ? 'text-red-500' : ''}`}>
//                   <input
//                     type="checkbox"
//                     id="consent"
//                     checked={formData.consent}
//                     onChange={handleInputChange}
//                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">
//                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. *
//                   </span>
//                 </label>
//                 {errors.consent && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consent}</p>}
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     id="newsletter"
//                     checked={formData.newsletter}
//                     onChange={handleInputChange}
//                     className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">
//                     Send me updates, featured setups, and community news.
//                   </span>
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full mt-6 bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit workspace for review'}
//               </button>

//               {message && (
//                 <div
//                   className={`mt-5 text-sm font-medium p-3 rounded-lg border ${message.type === 'success'
//                       ? 'bg-green-50 border-green-200 text-green-700'
//                       : 'bg-red-50 border-red-200 text-red-700'
//                     }`}
//                 >
//                   {message.text}
//                 </div>
//               )}
//             </section>
//           </form>
//         </div>
//       </div>
//     </section>
//   )
// }