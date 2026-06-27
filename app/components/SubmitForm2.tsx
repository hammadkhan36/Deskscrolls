'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadMedia } from '@/actions/uploadMedia'
import toast, { Toaster } from 'react-hot-toast'

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
    const [isDraggingFiles, setIsDraggingFiles] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

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

    /* Drag & drop visual affordance only — delegates to the same select handler */
    const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsDraggingFiles(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsDraggingFiles(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsDraggingFiles(false)
        const files = Array.from(e.dataTransfer.files || [])
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
            toast.error('Please fix the highlighted fields.')
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
        setUploadProgress(0)
        setMessage(null)

        const uploadToastId = toast.loading('Uploading images...') // ✅ show loading toast


        try {
            let mediaUrls: string[] = []
            // if (mediaFiles.length > 0) {
            //     const uploadPromises = mediaFiles.map(async (file) => {
            //         const fd = new FormData()
            //         fd.append('file', file)
            //         fd.append('userName', formData.name)
            //         fd.append('submissionId', submissionId)
            //         const result = await uploadMedia(fd)
            //         if (!result.success || !result.url) {
            //             throw new Error(result.error || 'Image upload failed')
            //         }
            //         return result.url
            //     })
            //     mediaUrls = await Promise.all(uploadPromises)
            // }
            if (mediaFiles.length > 0) {
                // Upload one by one to track progress
                for (let i = 0; i < mediaFiles.length; i++) {
                    const file = mediaFiles[i]
                    // Optional: compress image here (see compression snippet below)
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('userName', formData.name)
                    fd.append('submissionId', submissionId)
                    const result = await uploadMedia(fd)
                    if (!result.success || !result.url) {
                        throw new Error(result.error || 'Image upload failed')
                    }
                    mediaUrls.push(result.url)
                    // update progress
                    const progress = Math.round(((i + 1) / mediaFiles.length) * 100)
                    setUploadProgress(progress)
                    toast.loading(`Uploading images... ${progress}%`, { id: uploadToastId })
                }
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

            toast.success('Submitted! We\'ll review your workspace. ✨', { id: uploadToastId })

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
            toast.error('Submission failed. Please try again.', { id: uploadToastId })
        } finally {
            setIsSubmitting(false)
            setUploadProgress(0)
        }
    }

    /* ---------- UI Helpers ----------------------------------------- */
    const inputClass = (fieldId: string) => {
        const hasError = errors[fieldId] && touchedFields.has(fieldId)
        const isFocused = focusedField === fieldId
        return `w-full rounded-xl border-2 px-3.5 py-3.5 md:py-3 text-base text-gray-900 placeholder:text-gray-400
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

    const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5 tracking-tight'

    const errorMessage = (fieldId: string) => {
        if (errors[fieldId] && touchedFields.has(fieldId)) {
            return (
                <p className="text-red-500 text-xs mt-1.5 flex items-start gap-1.5 animate-fadeIn" role="alert">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M12 8v4.5M12 15.5h.01" />
                    </svg>
                    <span>{errors[fieldId]}</span>
                </p>
            )
        }
        return null
    }

    const sectionHeader = (num: number, title: string, subtitle?: string) => (
        <div className="flex items-center gap-3 mb-5 md:mb-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold shadow-sm tabular-nums">
                {num}
            </div>
            <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )

    const cardClass = 'bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 md:p-8 transition-shadow hover:shadow-md'

    const removeButtonClass =
        'flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors p-2.5 rounded-lg self-center shrink-0 touch-manipulation'

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 md:py-14 lg:py-20">


            {/* Add Toaster component */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 5000,
                    style: { background: '#363636', color: '#fff' },
                    success: { duration: 4000 },
                }}
            />


            <div ref={topRef} className="max-w-4xl mx-auto">

                {/* --- Header --- */}
                <div className="text-center mb-10 md:mb-14">
                    {/* <div className="inline-flex items-center gap-2 bg-gray-900/5 rounded-full px-4 py-1.5 mb-5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-medium text-gray-700 tracking-wide">Submissions open</span>
                    </div> */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                        Submit your desk setup
                    </h1>
                    <p className="mt-4 text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Fill out the form below for a chance to be featured. Fields marked
                        <span className="text-red-500 font-medium"> *</span> are required — the rest help us tell your story better.
                    </p>

                    {/* Section progress – purely visual, mirrors the numbered cards below */}
                    {/* <div className="hidden sm:flex items-center justify-center gap-2 mt-7" aria-hidden="true">
                        {['About you', 'Workspace', 'More detail', 'Submit'].map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                    <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] tabular-nums">
                                        {i + 1}
                                    </span>
                                    {label}
                                </div>
                                {i < 3 && <span className="w-6 h-px bg-gray-300" />}
                            </div>
                        ))}
                    </div> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" noValidate>

                    {/* ============================================================ */}
                    {/* 1. ABOUT YOU */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        {sectionHeader(1, 'About you')}

                        <div className="space-y-5">
                            {/* Name + Email – grid on desktop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
                                        aria-invalid={!!(errors.name && touchedFields.has('name'))}
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
                                        aria-invalid={!!(errors.email && touchedFields.has('email'))}
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">Required if you don't add a social profile below</p>
                                    {errorMessage('email')}
                                </div>
                            </div>

                            {/* Location – full width */}
                            <div>
                                <label htmlFor="location" className={labelClass}>
                                    Location <span className="text-red-500">*</span>
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
                                    aria-invalid={!!(errors.location && touchedFields.has('location'))}
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
                                    className={`${inputClass('intro')} resize-y min-h-[110px]`}
                                />
                            </div>

                            {/* Social Profiles */}
                            <div className="pt-1">
                                <label className={labelClass}>Online profiles</label>
                                <p className="text-xs text-gray-400 mb-3">At least one required if you don't add an email above</p>

                                <div className="space-y-2.5">
                                    {socialProfiles.map((profile, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <div className="flex w-full gap-2 flex-1">
                                                <select
                                                    value={profile.platform}
                                                    onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                                                    aria-label="Platform"
                                                    className={`w-[40%] sm:w-40 rounded-xl border-2 pl-3 pr-7 py-3.5 md:py-3 text-base text-gray-900 bg-white
                                                bg-no-repeat bg-[right_0.6rem_center]
                                                ${errors.socialProfiles && touchedFields.has('socialProfiles')
                                                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                            : 'border-gray-300 hover:border-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                                                        }
                                                focus:outline-none transition-all duration-200 appearance-none`}
                                                    style={{
                                                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                                                    }}
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
                                                    className={`${inputClass('socialHandle')} flex-1 min-w-0`}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSocialRow(index)}
                                                disabled={socialProfiles.length === 1}
                                                className={removeButtonClass}
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
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add another profile
                                    {socialProfiles.length >= 5 && <span className="text-xs text-gray-400 font-normal">(max 5)</span>}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ============================================================ */}
                    {/* 2. YOUR WORKSPACE */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        {sectionHeader(2, 'Your workspace', 'Required')}

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
                                    className={`${inputClass('description')} resize-y min-h-[130px]`}
                                    aria-invalid={!!(errors.description && touchedFields.has('description'))}
                                />
                                {errorMessage('description')}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <div className="flex items-baseline justify-between flex-wrap gap-1">
                                    <label className={labelClass}>
                                        Upload images <span className="text-red-500">*</span>
                                        <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 5)</span>
                                    </label>
                                    <span className={`text-xs font-medium tabular-nums ${mediaFiles.length >= 5 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {mediaFiles.length}/10
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Up to 10 images, {MAX_FILE_SIZE_MB} MB max each</p>

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
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`w-full flex items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-6 md:py-7 text-center transition-all duration-200 touch-manipulation
                                            ${isDraggingFiles
                                                ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
                                                : errors.mediaFiles && touchedFields.has('mediaFiles')
                                                    ? 'border-red-300 bg-red-50/40 hover:border-red-400'
                                                    : 'border-gray-300 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'
                                            }`}
                                    >
                                        <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 7.5L12 3m0 0L7.5 7.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            {mediaFiles.length > 0
                                                ? `${mediaFiles.length} image${mediaFiles.length > 1 ? 's' : ''} selected — add more or drop here`
                                                : 'Choose images or drag and drop'}
                                        </span>
                                    </button>
                                </div>

                                {errorMessage('mediaFiles')}

                                {/* Image preview grid – responsive columns */}
                                {mediaPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 mt-4">
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
                                                    className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm rounded-full w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center shadow-sm hover:bg-white hover:text-red-500 transition-colors touch-manipulation"
                                                    aria-label={`Remove image ${idx + 1}`}
                                                >
                                                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm tabular-nums">
                                                    {idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mediaFiles.length > 0 && mediaFiles.length < 5 && (
                                    <p className="text-xs text-amber-600 mt-2.5 flex items-center gap-1.5 bg-amber-50 rounded-lg px-3 py-2">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="9" />
                                            <path strokeLinecap="round" d="M12 8v4.5M12 15.5h.01" />
                                        </svg>
                                        {5 - mediaFiles.length} more image{5 - mediaFiles.length > 1 ? 's' : ''} needed
                                    </p>
                                )}
                            </div>

                            {/* Gear Items */}
                            <div>
                                <div className="flex items-baseline justify-between flex-wrap gap-1">
                                    <label className={labelClass}>
                                        Workspace items <span className="text-red-500">*</span>
                                        {/* <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 7)</span> */}
                                    </label>
                                    <span className={`text-xs font-medium tabular-nums ${gearItems.filter(g => g.name.trim()).length >= 7 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {gearItems.filter(g => g.name.trim()).length}/{gearItems.length}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">List every major item. An affiliate link is optional.</p>

                                <div className="space-y-2.5">
                                    {gearItems.map((item, index) => {
                                        const isNameError = errors.gearItems && !item.name.trim() && touchedFields.has('gearItems')
                                        return (
                                            <div key={index} className="flex gap-2 items-start">
                                                <span className="hidden sm:flex items-center justify-center w-9 h-[52px] text-xs font-medium text-gray-400 tabular-nums shrink-0">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
                                                        value={item.name}
                                                        onChange={(e) => handleGearNameChange(index, e.target.value)}
                                                        onFocus={() => setFocusedField('gearItems')}
                                                        onBlur={() => { setFocusedField(null); setTouchedFields(prev => new Set(prev).add('gearItems')) }}
                                                        className={inputClass(`gear-${index}`) + (isNameError ? ' border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' : '')}
                                                    />
                                                </div>
                                                <div className="flex w-[42%] sm:w-56 gap-2 shrink-0">
                                                    <input
                                                        type="url"
                                                        placeholder="Link (optional)"
                                                        value={item.link}
                                                        onChange={(e) => handleGearLinkChange(index, e.target.value)}
                                                        className="flex-1 min-w-0 rounded-xl border-2 border-gray-300 px-3 py-3.5 md:py-3 text-base text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGearRow(index)}
                                                        disabled={gearItems.length <= 7}
                                                        className={removeButtonClass}
                                                        aria-label={`Remove item ${index + 1}`}
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
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add another item
                                    {gearItems.length >= 15 && <span className="text-xs text-gray-400 font-normal">(max 15)</span>}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ============================================================ */}
                    {/* 3. MORE ABOUT YOUR SETUP (optional) */}
                    {/* ============================================================ */}
                    <section ref={optionalRef} className={cardClass}>
                        <div className="flex items-center gap-3 mb-5 md:mb-6">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold tabular-nums">
                                3
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-bold text-gray-900">More about your setup</h2>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">optional</span>
                                </div>
                            </div>
                        </div>

                        {!showOptional ? (
                            <button
                                type="button"
                                onClick={() => setShowOptional(true)}
                                className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 p-4 md:p-5 text-left hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-200 touch-manipulation group"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
                                </div>
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors ml-4 flex-shrink-0 text-lg">
                                    +
                                </span>
                            </button>
                        ) : (
                            <div className="space-y-5 animate-fadeIn">
                                {/* Budget & Space – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label htmlFor="budget" className={labelClass}>Approximate setup budget</label>
                                        <input
                                            id="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('budget')}
                                            onBlur={() => setFocusedField(null)}
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
                                            onFocus={() => setFocusedField('spaceSize')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="120 sq ft / 11 m²"
                                            className={inputClass('spaceSize')}
                                        />
                                    </div>
                                </div>

                                {/* Favorite & Recent – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label htmlFor="favoriteItem" className={labelClass}>Your favorite item on this desk</label>
                                        <textarea
                                            id="favoriteItem"
                                            rows={3}
                                            value={formData.favoriteItem}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('favoriteItem')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Tell us why it's special…"
                                            className={`${inputClass('favoriteItem')} resize-y min-h-[88px]`}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="recentAddition" className={labelClass}>The most recent addition</label>
                                        <textarea
                                            id="recentAddition"
                                            rows={3}
                                            value={formData.recentAddition}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('recentAddition')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="What did you add last?"
                                            className={`${inputClass('recentAddition')} resize-y min-h-[88px]`}
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Change & Decor – two columns on desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
                                        <textarea
                                            id="desiredChange"
                                            rows={4}
                                            value={formData.desiredChange}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('desiredChange')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Better cable management, new chair…"
                                            className={`${inputClass('desiredChange')} resize-y min-h-[110px]`}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
                                        <textarea
                                            id="decorativeTouches"
                                            rows={4}
                                            value={formData.decorativeTouches}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('decorativeTouches')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Plants, neon sign, art prints, figurines…"
                                            className={`${inputClass('decorativeTouches')} resize-y min-h-[110px]`}
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
                                        onFocus={() => setFocusedField('comfortCable')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Standing desk, ergo chair, under-desk trays…"
                                        className={`${inputClass('comfortCable')} resize-y min-h-[88px]`}
                                    />
                                </div>

                                <hr className="border-gray-200" />

                                {/* Software – full width */}
                                <div>
                                    <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use daily?</label>
                                    <textarea
                                        id="softwareTools"
                                        rows={3}
                                        value={formData.softwareTools}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('softwareTools')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Figma, VS Code, Notion, Spotify…"
                                        className={`${inputClass('softwareTools')} resize-y min-h-[88px]`}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowOptional(false)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors touch-manipulation flex items-center gap-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                    Hide optional details
                                </button>
                            </div>
                        )}
                    </section>

                    {/* ============================================================ */}
                    {/* 4. CONSENT & SUBMIT */}
                    {/* ============================================================ */}
                    <section className={cardClass}>
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <label
                                htmlFor="consent"
                                className={`flex items-start gap-3 cursor-pointer rounded-xl p-3 -m-3 transition-colors hover:bg-gray-50 ${errors.consent && touchedFields.has('consent') ? 'bg-red-50/60' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                    onBlur={() => { setTouchedFields(prev => new Set(prev).add('consent')) }}
                                    className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0 shrink-0 cursor-pointer transition-all"
                                />
                                <span className={`text-sm leading-relaxed ${errors.consent && touchedFields.has('consent') ? 'text-red-600' : 'text-gray-700'}`}>
                                    I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. <span className="text-red-500">*</span>
                                </span>
                            </label>
                            {errorMessage('consent')}

                            <label
                                htmlFor="newsletter"
                                className="flex items-start gap-3 cursor-pointer rounded-xl p-3 -m-3 transition-colors hover:bg-gray-50"
                            >
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
                            className="w-full max-w-md mx-auto mt-6 block bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-4 focus:ring-gray-300 touch-manipulation text-base shadow-sm"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting…
                                </span>
                            ) : showOptional ? (
                                'Submit workspace for review'
                            ) : (
                                'Continue'
                            )}
                        </button>


                        {/* Add progress bar below the submit button */}
                        {isSubmitting && uploadProgress > 0 && (
                            <div className="w-full max-w-md mx-auto mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                            </div>
                        )}

                        {!showOptional && (
                            <p className="text-center text-xs text-gray-400 mt-3">
                                We'll show you one more optional step before you submit.
                            </p>
                        )}

                        {message && (
                            <div
                                role="status"
                                className={`mt-4 text-sm font-medium p-4 rounded-xl border-2 animate-fadeIn max-w-2xl mx-auto flex items-start gap-2.5 ${message.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                    }`}
                            >
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}
                    </section>

                    {/* --- Footer note --- */}
                    <p className="text-center text-xs text-gray-400 pt-2 pb-6">
                        Your submission will be reviewed before being featured
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

// import { useState, useRef, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { uploadMedia } from '@/actions/uploadMedia'

// /* ------------------------------------------------------------------ */
// /*  Types & Constants                                                 */
// /* ------------------------------------------------------------------ */
// type SocialProfile = {
//     platform: string
//     handle: string
// }

// type GearItem = {
//     name: string
//     link: string
// }

// const PLATFORM_OPTIONS = [
//     'GitHub',
//     'Twitter / X',
//     'Instagram',
//     'LinkedIn',
//     'YouTube',
//     'Behance',
//     'Dribbble',
//     'Personal Website',
//     'Other',
// ]

// const MAX_FILE_SIZE_MB = 5
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// /* ------------------------------------------------------------------ */
// /*  Component – fully responsive (mobile‑first + desktop polish)      */
// /* ------------------------------------------------------------------ */
// export default function SubmitForm() {
//     const supabase = createClient()
//     const optionalRef = useRef<HTMLDivElement>(null)
//     const topRef = useRef<HTMLDivElement>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const [formData, setFormData] = useState({
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
//     })

//     const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
//         { platform: '', handle: '' },
//     ])

//     const [gearItems, setGearItems] = useState<GearItem[]>(
//         Array(7).fill({ name: '', link: '' })
//     )

//     const [mediaFiles, setMediaFiles] = useState<File[]>([])
//     const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
//     const [showOptional, setShowOptional] = useState(false)
//     const [errors, setErrors] = useState<Record<string, string>>({})
//     const [focusedField, setFocusedField] = useState<string | null>(null)
//     const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
//     const [isDraggingFiles, setIsDraggingFiles] = useState(false)
//     // UI-only: tracks which gear rows have their (optional) link field expanded on mobile.
//     // Purely presentational — does not affect validation or submitted data.
//     const [expandedGearLinks, setExpandedGearLinks] = useState<Set<number>>(new Set())

//     // Scroll to top on mount
//     useEffect(() => {
//         if (topRef.current) {
//             topRef.current.scrollIntoView({ behavior: 'smooth' })
//         }
//     }, [])

//     /* ---------- Validation (unchanged logic) ----------------------- */
//     const validate = (): Record<string, string> => {
//         const newErrors: Record<string, string> = {}
//         const validSocialProfiles = socialProfiles.filter(
//             (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//         )

//         if (!formData.email && validSocialProfiles.length === 0) {
//             newErrors.email = 'Email is required if no social profile is provided.'
//             newErrors.socialProfiles = 'At least one social profile or email is required.'
//         }
//         if (!formData.name.trim()) {
//             newErrors.name = 'Full name is required.'
//         }
//         if (!formData.location.trim()) {
//             newErrors.location = 'Location is required.'
//         }
//         if (!formData.description.trim()) {
//             newErrors.description = 'Please describe your desk setup.'
//         }
//         if (mediaFiles.length < 5) {
//             newErrors.mediaFiles = 'Please upload at least 5 images.'
//         }
//         const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//         if (validGearItems.length < 7) {
//             newErrors.gearItems = 'Please list at least 7 workspace items (each item must have a name).'
//         }
//         if (!formData.consent) {
//             newErrors.consent = 'You must agree to be featured.'
//         }
//         return newErrors
//     }

//     const validateField = (fieldId: string): string | undefined => {
//         const fieldErrors = validate()
//         return fieldErrors[fieldId]
//     }

//     const handleFieldBlur = (fieldId: string) => {
//         setTouchedFields((prev) => new Set(prev).add(fieldId))
//         const fieldError = validateField(fieldId)
//         if (fieldError) {
//             setErrors((prev) => ({ ...prev, [fieldId]: fieldError }))
//         } else {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next[fieldId]
//                 return next
//             })
//         }
//     }

//     /* ---------- Handlers ------------------------------------------- */
//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//     ) => {
//         const { id, value, type } = e.target
//         const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//         setFormData((prev) => ({ ...prev, [id]: val }))
//         if (errors[id]) {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next[id]
//                 return next
//             })
//         }
//     }

//     /* Social profiles */
//     const handleSocialChange = (
//         index: number,
//         field: 'platform' | 'handle',
//         value: string,
//     ) => {
//         const updated = [...socialProfiles]
//         updated[index][field] = value
//         setSocialProfiles(updated)
//         if (errors.socialProfiles) {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next.socialProfiles
//                 return next
//             })
//         }
//     }

//     const addSocialRow = () => {
//         if (socialProfiles.length < 5) {
//             setSocialProfiles([...socialProfiles, { platform: '', handle: '' }])
//         }
//     }

//     const removeSocialRow = (index: number) => {
//         if (socialProfiles.length === 1) return
//         setSocialProfiles(socialProfiles.filter((_, i) => i !== index))
//     }

//     /* Gear list */
//     const handleGearNameChange = (index: number, name: string) => {
//         const updated = [...gearItems]
//         updated[index] = { ...updated[index], name }
//         setGearItems(updated)
//         if (errors.gearItems) {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next.gearItems
//                 return next
//             })
//         }
//     }

//     const handleGearLinkChange = (index: number, link: string) => {
//         const updated = [...gearItems]
//         updated[index] = { ...updated[index], link }
//         setGearItems(updated)
//     }

//     const addGearRow = () => {
//         if (gearItems.length < 15) {
//             setGearItems([...gearItems, { name: '', link: '' }])
//         }
//     }

//     const removeGearRow = (index: number) => {
//         if (gearItems.length <= 7) return
//         setGearItems(gearItems.filter((_, i) => i !== index))
//         // Keep the expanded-link UI state in sync with the new indices after removal.
//         setExpandedGearLinks((prev) => {
//             const next = new Set<number>()
//             prev.forEach((i) => {
//                 if (i === index) return
//                 next.add(i > index ? i - 1 : i)
//             })
//             return next
//         })
//     }

//     /* UI-only: shows/hides the optional link input under a gear row (mobile layout) */
//     const toggleGearLink = (index: number) => {
//         setExpandedGearLinks((prev) => {
//             const next = new Set(prev)
//             if (next.has(index)) {
//                 next.delete(index)
//             } else {
//                 next.add(index)
//             }
//             return next
//         })
//     }

//     /* Media upload */
//     const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = Array.from(e.target.files || [])
//         if (!files.length) return

//         const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
//         if (oversizedFiles.length > 0) {
//             const names = oversizedFiles.map((f) => f.name).join(', ')
//             setErrors((prev) => ({
//                 ...prev,
//                 mediaFiles: `File(s) "${names}" exceed ${MAX_FILE_SIZE_MB} MB limit.`,
//             }))
//             return
//         }

//         const total = mediaFiles.length + files.length
//         if (total > 10) {
//             setErrors((prev) => ({
//                 ...prev,
//                 mediaFiles: 'Maximum 10 images allowed.',
//             }))
//             return
//         }

//         if (errors.mediaFiles) {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next.mediaFiles
//                 return next
//             })
//         }

//         const newPreviews = files.map((file) => URL.createObjectURL(file))
//         setMediaPreviews((prev) => [...prev, ...newPreviews])
//         setMediaFiles((prev) => [...prev, ...files])
//     }

//     const removeMedia = (index: number) => {
//         const updatedFiles = [...mediaFiles]
//         updatedFiles.splice(index, 1)
//         setMediaFiles(updatedFiles)
//         const updatedPreviews = [...mediaPreviews]
//         URL.revokeObjectURL(updatedPreviews[index])
//         updatedPreviews.splice(index, 1)
//         setMediaPreviews(updatedPreviews)
//     }

//     const triggerFilePicker = () => {
//         fileInputRef.current?.click()
//     }

//     /* Drag & drop visual affordance only — delegates to the same select handler */
//     const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
//         e.preventDefault()
//         setIsDraggingFiles(true)
//     }

//     const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
//         e.preventDefault()
//         setIsDraggingFiles(false)
//     }

//     const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
//         e.preventDefault()
//         setIsDraggingFiles(false)
//         const files = Array.from(e.dataTransfer.files || [])
//         if (!files.length) return

//         const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
//         if (oversizedFiles.length > 0) {
//             const names = oversizedFiles.map((f) => f.name).join(', ')
//             setErrors((prev) => ({
//                 ...prev,
//                 mediaFiles: `File(s) "${names}" exceed ${MAX_FILE_SIZE_MB} MB limit.`,
//             }))
//             return
//         }

//         const total = mediaFiles.length + files.length
//         if (total > 10) {
//             setErrors((prev) => ({
//                 ...prev,
//                 mediaFiles: 'Maximum 10 images allowed.',
//             }))
//             return
//         }

//         if (errors.mediaFiles) {
//             setErrors((prev) => {
//                 const next = { ...prev }
//                 delete next.mediaFiles
//                 return next
//             })
//         }

//         const newPreviews = files.map((file) => URL.createObjectURL(file))
//         setMediaPreviews((prev) => [...prev, ...newPreviews])
//         setMediaFiles((prev) => [...prev, ...files])
//     }

//     /* ---------- Submit --------------------------------------------- */
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         const allFields = ['name', 'email', 'location', 'description', 'consent']
//         setTouchedFields(new Set(allFields))

//         const newErrors = validate()
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors)
//             const firstErrorKey = Object.keys(newErrors)[0]
//             const el = document.getElementById(firstErrorKey)
//             if (el) {
//                 el.scrollIntoView({ behavior: 'smooth', block: 'center' })
//             }
//             return
//         }

//         if (!showOptional) {
//             setShowOptional(true)
//             setTimeout(() => {
//                 optionalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//             }, 150)
//             return
//         }

//         const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
//         let submissionId = ''
//         for (let i = 0; i < 2; i++) {
//             submissionId += chars[Math.floor(Math.random() * chars.length)]
//         }

//         setErrors({})
//         setIsSubmitting(true)
//         setMessage(null)

//         try {
//             let mediaUrls: string[] = []
//             if (mediaFiles.length > 0) {
//                 const uploadPromises = mediaFiles.map(async (file) => {
//                     const fd = new FormData()
//                     fd.append('file', file)
//                     fd.append('userName', formData.name)
//                     fd.append('submissionId', submissionId)
//                     const result = await uploadMedia(fd)
//                     if (!result.success || !result.url) {
//                         throw new Error(result.error || 'Image upload failed')
//                     }
//                     return result.url
//                 })
//                 mediaUrls = await Promise.all(uploadPromises)
//             }

//             const validSocialProfiles = socialProfiles.filter(
//                 (s) => s.platform.trim() !== '' && s.handle.trim() !== ''
//             )
//             const validGearItems = gearItems.filter((g) => g.name.trim() !== '')
//             const gearData = validGearItems.map(({ name, link }) => ({
//                 name,
//                 link: link.trim() || null,
//             }))

//             const { error } = await supabase.from('submissions').insert({
//                 email: formData.email || null,
//                 name: formData.name,
//                 intro: formData.intro || null,
//                 location: formData.location,
//                 description: formData.description,
//                 budget: formData.budget || null,
//                 space_size: formData.spaceSize || null,
//                 favorite_item: formData.favoriteItem || null,
//                 recent_addition: formData.recentAddition || null,
//                 desired_change: formData.desiredChange || null,
//                 comfort_cable: formData.comfortCable || null,
//                 decorative_touches: formData.decorativeTouches || null,
//                 software_tools: formData.softwareTools || null,
//                 social_profiles: validSocialProfiles,
//                 image_urls: mediaUrls,
//                 gear_list: gearData,
//                 consent: formData.consent,
//                 newsletter: formData.newsletter,
//                 status: 'pending',
//             })

//             if (error) throw error

//             setMessage({ type: 'success', text: 'Submitted! We\'ll review your workspace. ✨' })

//             // Reset form
//             setFormData({
//                 email: '',
//                 name: '',
//                 intro: '',
//                 location: '',
//                 description: '',
//                 budget: '',
//                 spaceSize: '',
//                 favoriteItem: '',
//                 recentAddition: '',
//                 desiredChange: '',
//                 comfortCable: '',
//                 decorativeTouches: '',
//                 softwareTools: '',
//                 consent: false,
//                 newsletter: false,
//             })
//             setSocialProfiles([{ platform: '', handle: '' }])
//             setGearItems(Array(7).fill({ name: '', link: '' }))
//             setExpandedGearLinks(new Set())
//             setMediaFiles([])
//             setMediaPreviews([])
//             setShowOptional(false)
//             setErrors({})
//             setTouchedFields(new Set())

//             topRef.current?.scrollIntoView({ behavior: 'smooth' })

//         } catch (err: any) {
//             console.error(err)
//             setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     /* ---------- UI Helpers ----------------------------------------- */
//     const inputClass = (fieldId: string) => {
//         const hasError = errors[fieldId] && touchedFields.has(fieldId)
//         const isFocused = focusedField === fieldId
//         return `w-full rounded-xl border-2 px-3.5 py-3.5 md:py-3 text-base text-gray-900 placeholder:text-gray-400
//       transition-all duration-200 ease-out bg-white
//       ${hasError
//                 ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
//                 : isFocused
//                     ? 'border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]'
//                     : 'border-gray-300 hover:border-gray-400'
//             }
//       focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400
//       disabled:opacity-60 disabled:cursor-not-allowed
//       appearance-none`
//     }

//     const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5 tracking-tight'

//     const errorMessage = (fieldId: string) => {
//         if (errors[fieldId] && touchedFields.has(fieldId)) {
//             return (
//                 <p className="text-red-500 text-xs mt-1.5 flex items-start gap-1.5 animate-fadeIn" role="alert">
//                     <svg className="w-3.5 h-3.5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                         <circle cx="12" cy="12" r="9" />
//                         <path strokeLinecap="round" d="M12 8v4.5M12 15.5h.01" />
//                     </svg>
//                     <span>{errors[fieldId]}</span>
//                 </p>
//             )
//         }
//         return null
//     }

//     const sectionHeader = (num: number, title: string, subtitle?: string) => (
//         <div className="flex items-center gap-3 mb-5 md:mb-6">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold shadow-sm tabular-nums">
//                 {num}
//             </div>
//             <div className="min-w-0">
//                 <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
//                 {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
//             </div>
//         </div>
//     )

//     const cardClass = 'bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 md:p-8 transition-shadow hover:shadow-md'

//     const removeButtonClass =
//         'flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors p-2.5 rounded-lg self-center shrink-0 touch-manipulation'

//     return (
//         <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 md:py-14 lg:py-20">
//             <div ref={topRef} className="max-w-4xl mx-auto">

//                 {/* --- Header --- */}
//                 <div className="text-center mb-10 md:mb-14">
//                     <div className="inline-flex items-center gap-2 bg-gray-900/5 rounded-full px-4 py-1.5 mb-5">
//                         <span className="relative flex h-2 w-2">
//                             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
//                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
//                         </span>
//                         <span className="text-xs font-medium text-gray-700 tracking-wide">Submissions open</span>
//                     </div>
//                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
//                         Show us your desk setup
//                     </h1>
//                     <p className="mt-4 text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
//                         Fill out the form below for a chance to be featured. Fields marked
//                         <span className="text-red-500 font-medium"> *</span> are required — the rest help us tell your story better.
//                     </p>

//                     {/* Section progress – purely visual, mirrors the numbered cards below */}
//                     <div className="flex items-center justify-center gap-1.5 mt-7 sm:hidden" aria-hidden="true">
//                         {[0, 1, 2, 3].map((i) => (
//                             <span key={i} className="h-1.5 w-6 rounded-full bg-gray-200" />
//                         ))}
//                     </div>
//                     <div className="hidden sm:flex items-center justify-center gap-2 mt-7" aria-hidden="true">
//                         {['About you', 'Workspace', 'More detail', 'Submit'].map((label, i) => (
//                             <div key={label} className="flex items-center gap-2">
//                                 <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
//                                     <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] tabular-nums">
//                                         {i + 1}
//                                     </span>
//                                     {label}
//                                 </div>
//                                 {i < 3 && <span className="w-6 h-px bg-gray-300" />}
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" noValidate>

//                     {/* ============================================================ */}
//                     {/* 1. ABOUT YOU */}
//                     {/* ============================================================ */}
//                     <section className={cardClass}>
//                         {sectionHeader(1, 'About you')}

//                         <div className="space-y-5">
//                             {/* Name + Email – grid on desktop */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                 <div>
//                                     <label htmlFor="name" className={labelClass}>
//                                         Full name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         id="name"
//                                         type="text"
//                                         value={formData.name}
//                                         onChange={handleInputChange}
//                                         onFocus={() => setFocusedField('name')}
//                                         onBlur={() => { setFocusedField(null); handleFieldBlur('name') }}
//                                         placeholder="Jane Smith"
//                                         className={inputClass('name')}
//                                         autoComplete="name"
//                                         aria-invalid={!!(errors.name && touchedFields.has('name'))}
//                                     />
//                                     {errorMessage('name')}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="email" className={labelClass}>Email address</label>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         onFocus={() => setFocusedField('email')}
//                                         onBlur={() => { setFocusedField(null); handleFieldBlur('email') }}
//                                         placeholder="you@example.com"
//                                         className={inputClass('email')}
//                                         autoComplete="email"
//                                         aria-invalid={!!(errors.email && touchedFields.has('email'))}
//                                     />
//                                     <p className="text-xs text-gray-400 mt-1.5">Required if you don't add a social profile below</p>
//                                     {errorMessage('email')}
//                                 </div>
//                             </div>

//                             {/* Location – full width */}
//                             <div>
//                                 <label htmlFor="location" className={labelClass}>
//                                     Location <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     id="location"
//                                     type="text"
//                                     value={formData.location}
//                                     onChange={handleInputChange}
//                                     onFocus={() => setFocusedField('location')}
//                                     onBlur={() => { setFocusedField(null); handleFieldBlur('location') }}
//                                     placeholder="San Francisco, CA, USA"
//                                     className={inputClass('location')}
//                                     autoComplete="address-level2"
//                                     aria-invalid={!!(errors.location && touchedFields.has('location'))}
//                                 />
//                                 {errorMessage('location')}
//                             </div>

//                             {/* Intro */}
//                             <div>
//                                 <label htmlFor="intro" className={labelClass}>Tell us about yourself and what you do</label>
//                                 <textarea
//                                     id="intro"
//                                     rows={4}
//                                     value={formData.intro}
//                                     onChange={handleInputChange}
//                                     onFocus={() => setFocusedField('intro')}
//                                     onBlur={() => setFocusedField(null)}
//                                     placeholder="Write a couple of paragraphs – your background, your work, your passions…"
//                                     className={`${inputClass('intro')} resize-y min-h-[110px]`}
//                                 />
//                             </div>

//                             {/* Social Profiles */}
//                             <div className="pt-1">
//                                 <label className={labelClass}>Online profiles / websites</label>
//                                 <p className="text-xs text-gray-400 mb-3">At least one required if you don't add an email above</p>

//                                 <div className="space-y-2.5">
//                                     {socialProfiles.map((profile, index) => (
//                                         <div key={index} className="flex gap-2 items-start">
//                                             <div className="flex w-full gap-2 flex-1">
//                                                 <select
//                                                     value={profile.platform}
//                                                     onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
//                                                     aria-label="Platform"
//                                                     className={`w-[40%] sm:w-40 rounded-xl border-2 pl-3 pr-7 py-3.5 md:py-3 text-base text-gray-900 bg-white
//                                                 bg-no-repeat bg-[right_0.6rem_center]
//                                                 ${errors.socialProfiles && touchedFields.has('socialProfiles')
//                                                             ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
//                                                             : 'border-gray-300 hover:border-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
//                                                         }
//                                                 focus:outline-none transition-all duration-200 appearance-none`}
//                                                     style={{
//                                                         backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
//                                                     }}
//                                                 >
//                                                     <option value="">Select</option>
//                                                     {PLATFORM_OPTIONS.map((opt) => (
//                                                         <option key={opt} value={opt}>{opt}</option>
//                                                     ))}
//                                                 </select>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Handle or URL"
//                                                     value={profile.handle}
//                                                     onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
//                                                     onFocus={() => setFocusedField('socialHandle')}
//                                                     onBlur={() => { setFocusedField(null); setTouchedFields(prev => new Set(prev).add('socialProfiles')) }}
//                                                     className={`${inputClass('socialHandle')} flex-1 min-w-0`}
//                                                 />
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeSocialRow(index)}
//                                                 disabled={socialProfiles.length === 1}
//                                                 className={removeButtonClass}
//                                                 aria-label="Remove social profile"
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {errorMessage('socialProfiles')}

//                                 <button
//                                     type="button"
//                                     onClick={addSocialRow}
//                                     disabled={socialProfiles.length >= 5}
//                                     className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                                     </svg>
//                                     Add another profile
//                                     {socialProfiles.length >= 5 && <span className="text-xs text-gray-400 font-normal">(max 5)</span>}
//                                 </button>
//                             </div>
//                         </div>
//                     </section>

//                     {/* ============================================================ */}
//                     {/* 2. YOUR WORKSPACE */}
//                     {/* ============================================================ */}
//                     <section className={cardClass}>
//                         {sectionHeader(2, 'Your workspace', 'Required')}

//                         <div className="space-y-6">
//                             {/* Description */}
//                             <div>
//                                 <label htmlFor="description" className={labelClass}>
//                                     Story behind your desk setup <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     id="description"
//                                     rows={5}
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     onFocus={() => setFocusedField('description')}
//                                     onBlur={() => { setFocusedField(null); handleFieldBlur('description') }}
//                                     placeholder="What inspired your setup? Any theme or philosophy? How did you build it?"
//                                     className={`${inputClass('description')} resize-y min-h-[130px]`}
//                                     aria-invalid={!!(errors.description && touchedFields.has('description'))}
//                                 />
//                                 {errorMessage('description')}
//                             </div>

//                             {/* Image Upload */}
//                             <div>
//                                 <div className="flex items-baseline justify-between flex-wrap gap-1">
//                                     <label className={labelClass}>
//                                         Upload images <span className="text-red-500">*</span>
//                                         <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 5)</span>
//                                     </label>
//                                     <span className={`text-xs font-medium tabular-nums ${mediaFiles.length >= 5 ? 'text-emerald-600' : 'text-gray-400'}`}>
//                                         {mediaFiles.length}/10
//                                     </span>
//                                 </div>
//                                 <p className="text-xs text-gray-400 mb-3">Up to 10 images, {MAX_FILE_SIZE_MB} MB max each</p>

//                                 <div className="relative">
//                                     <input
//                                         ref={fileInputRef}
//                                         id="media-upload"
//                                         type="file"
//                                         multiple
//                                         accept="image/*"
//                                         onChange={handleMediaSelect}
//                                         className="sr-only"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={triggerFilePicker}
//                                         onDragOver={handleDragOver}
//                                         onDragLeave={handleDragLeave}
//                                         onDrop={handleDrop}
//                                         className={`w-full flex items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-6 md:py-7 text-center transition-all duration-200 touch-manipulation
//                                             ${isDraggingFiles
//                                                 ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
//                                                 : errors.mediaFiles && touchedFields.has('mediaFiles')
//                                                     ? 'border-red-300 bg-red-50/40 hover:border-red-400'
//                                                     : 'border-gray-300 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'
//                                             }`}
//                                     >
//                                         <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 7.5L12 3m0 0L7.5 7.5M12 3v13.5" />
//                                         </svg>
//                                         <span className="text-sm font-medium text-gray-700">
//                                             {mediaFiles.length > 0
//                                                 ? `${mediaFiles.length} image${mediaFiles.length > 1 ? 's' : ''} selected — add more or drop here`
//                                                 : 'Choose images or drag and drop'}
//                                         </span>
//                                     </button>
//                                 </div>

//                                 {errorMessage('mediaFiles')}

//                                 {/* Image preview grid – responsive columns */}
//                                 {mediaPreviews.length > 0 && (
//                                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 mt-4">
//                                         {mediaPreviews.map((previewUrl, idx) => (
//                                             <div
//                                                 key={idx}
//                                                 className="relative group rounded-xl overflow-hidden border-2 border-gray-200 aspect-square bg-gray-100"
//                                             >
//                                                 <img
//                                                     src={previewUrl}
//                                                     alt={`Preview ${idx + 1}`}
//                                                     className="w-full h-full object-cover"
//                                                     loading="lazy"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeMedia(idx)}
//                                                     className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm rounded-full w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center shadow-sm hover:bg-white hover:text-red-500 transition-colors touch-manipulation"
//                                                     aria-label={`Remove image ${idx + 1}`}
//                                                 >
//                                                     <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                                     </svg>
//                                                 </button>
//                                                 <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm tabular-nums">
//                                                     {idx + 1}
//                                                 </span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {mediaFiles.length > 0 && mediaFiles.length < 5 && (
//                                     <p className="text-xs text-amber-600 mt-2.5 flex items-center gap-1.5 bg-amber-50 rounded-lg px-3 py-2">
//                                         <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                             <circle cx="12" cy="12" r="9" />
//                                             <path strokeLinecap="round" d="M12 8v4.5M12 15.5h.01" />
//                                         </svg>
//                                         {5 - mediaFiles.length} more image{5 - mediaFiles.length > 1 ? 's' : ''} needed
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Gear Items */}
//                             <div>
//                                 <div className="flex items-baseline justify-between flex-wrap gap-1">
//                                     <label className={labelClass}>
//                                         Workspace items / gear <span className="text-red-500">*</span>
//                                         <span className="font-normal text-gray-400 text-xs ml-1.5">(at least 7)</span>
//                                     </label>
//                                     <span className={`text-xs font-medium tabular-nums ${gearItems.filter(g => g.name.trim()).length >= 7 ? 'text-emerald-600' : 'text-gray-400'}`}>
//                                         {gearItems.filter(g => g.name.trim()).length}/{gearItems.length}
//                                     </span>
//                                 </div>
//                                 <p className="text-xs text-gray-400 mb-3">List every major item. An affiliate link is optional.</p>

//                                 <div className="space-y-2 sm:space-y-2.5">
//                                     {gearItems.map((item, index) => {
//                                         const isNameError = errors.gearItems && !item.name.trim() && touchedFields.has('gearItems')
//                                         const isLinkOpen = expandedGearLinks.has(index) || item.link.trim() !== ''
//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className="rounded-xl border border-gray-200/0 sm:hover:border-gray-200 sm:hover:bg-gray-50/40 sm:p-1.5 sm:-m-1.5 transition-colors"
//                                             >
//                                                 {/* Main row: number (desktop) + name + link (desktop) + remove */}
//                                                 <div className="flex gap-2 items-start">
//                                                     <span className="hidden sm:flex items-center justify-center w-7 h-[52px] text-xs font-medium text-gray-400 tabular-nums shrink-0">
//                                                         {index + 1}
//                                                     </span>
//                                                     <div className="flex-1 min-w-0">
//                                                         <input
//                                                             type="text"
//                                                             placeholder={`Item ${index + 1} – e.g., Monitor, Keyboard`}
//                                                             value={item.name}
//                                                             onChange={(e) => handleGearNameChange(index, e.target.value)}
//                                                             onFocus={() => setFocusedField('gearItems')}
//                                                             onBlur={() => { setFocusedField(null); setTouchedFields(prev => new Set(prev).add('gearItems')) }}
//                                                             className={inputClass(`gear-${index}`) + (isNameError ? ' border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' : '')}
//                                                         />
//                                                     </div>

//                                                     {/* Desktop: link sits inline */}
//                                                     <input
//                                                         type="url"
//                                                         placeholder="Link (optional)"
//                                                         value={item.link}
//                                                         onChange={(e) => handleGearLinkChange(index, e.target.value)}
//                                                         className="hidden sm:block w-56 shrink-0 rounded-xl border-2 border-gray-300 px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
//                                                     />

//                                                     {/* Mobile: small toggle for the optional link, keeps the row to one line */}
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => toggleGearLink(index)}
//                                                         className={`sm:hidden flex items-center justify-center w-[52px] h-[52px] rounded-xl border-2 shrink-0 transition-colors touch-manipulation
//                                                             ${item.link.trim() !== ''
//                                                                 ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
//                                                                 : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
//                                                             }`}
//                                                         aria-label={item.link.trim() !== '' ? `Edit link for item ${index + 1}` : `Add link for item ${index + 1}`}
//                                                         aria-expanded={isLinkOpen}
//                                                     >
//                                                         <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5L21 3m0 0h-5.25M21 3v5.25M11 5H7a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-4" />
//                                                         </svg>
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeGearRow(index)}
//                                                         disabled={gearItems.length <= 7}
//                                                         className={removeButtonClass + ' hidden sm:flex'}
//                                                         aria-label={`Remove item ${index + 1}`}
//                                                     >
//                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>

//                                                 {/* Mobile: link field + remove, shown below the name row only when relevant */}
//                                                 {isLinkOpen && (
//                                                     <div className="sm:hidden flex gap-2 items-start mt-2 pl-0 animate-fadeIn">
//                                                         <input
//                                                             type="url"
//                                                             placeholder="Paste a link (optional)"
//                                                             value={item.link}
//                                                             onChange={(e) => handleGearLinkChange(index, e.target.value)}
//                                                             autoFocus={expandedGearLinks.has(index) && item.link.trim() === ''}
//                                                             className="flex-1 min-w-0 rounded-xl border-2 border-gray-300 px-3.5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
//                                                         />
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => removeGearRow(index)}
//                                                             disabled={gearItems.length <= 7}
//                                                             className={removeButtonClass}
//                                                             aria-label={`Remove item ${index + 1}`}
//                                                         >
//                                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                                             </svg>
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )
//                                     })}
//                                 </div>

//                                 {errorMessage('gearItems')}

//                                 <button
//                                     type="button"
//                                     onClick={addGearRow}
//                                     disabled={gearItems.length >= 15}
//                                     className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                                     </svg>
//                                     Add another item
//                                     {gearItems.length >= 15 && <span className="text-xs text-gray-400 font-normal">(max 15)</span>}
//                                 </button>
//                             </div>
//                         </div>
//                     </section>

//                     {/* ============================================================ */}
//                     {/* 3. MORE ABOUT YOUR SETUP (optional) */}
//                     {/* ============================================================ */}
//                     <section ref={optionalRef} className={cardClass}>
//                         <div className="flex items-center gap-3 mb-5 md:mb-6">
//                             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold tabular-nums">
//                                 3
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-2 flex-wrap">
//                                     <h2 className="text-lg font-bold text-gray-900">More about your setup</h2>
//                                     <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">optional</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {!showOptional ? (
//                             <button
//                                 type="button"
//                                 onClick={() => setShowOptional(true)}
//                                 className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 p-4 md:p-5 text-left hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-200 touch-manipulation group"
//                             >
//                                 <div>
//                                     <p className="text-sm font-semibold text-gray-700">Add more details about your workspace</p>
//                                     <p className="text-xs text-gray-500 mt-0.5">Budget, favorite items, comfort, decor, software…</p>
//                                 </div>
//                                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors ml-4 flex-shrink-0 text-lg">
//                                     +
//                                 </span>
//                             </button>
//                         ) : (
//                             <div className="space-y-5 animate-fadeIn">
//                                 {/* Budget & Space – two columns on desktop */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                     <div>
//                                         <label htmlFor="budget" className={labelClass}>Approximate setup budget</label>
//                                         <input
//                                             id="budget"
//                                             value={formData.budget}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('budget')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="$2,500"
//                                             className={inputClass('budget')}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="spaceSize" className={labelClass}>How much space does it occupy?</label>
//                                         <input
//                                             id="spaceSize"
//                                             value={formData.spaceSize}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('spaceSize')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="120 sq ft / 11 m²"
//                                             className={inputClass('spaceSize')}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Favorite & Recent – two columns on desktop */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                     <div>
//                                         <label htmlFor="favoriteItem" className={labelClass}>Your favorite item on this desk</label>
//                                         <textarea
//                                             id="favoriteItem"
//                                             rows={3}
//                                             value={formData.favoriteItem}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('favoriteItem')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="Tell us why it's special…"
//                                             className={`${inputClass('favoriteItem')} resize-y min-h-[88px]`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="recentAddition" className={labelClass}>The most recent addition</label>
//                                         <textarea
//                                             id="recentAddition"
//                                             rows={3}
//                                             value={formData.recentAddition}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('recentAddition')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="What did you add last?"
//                                             className={`${inputClass('recentAddition')} resize-y min-h-[88px]`}
//                                         />
//                                     </div>
//                                 </div>

//                                 <hr className="border-gray-200" />

//                                 {/* Change & Decor – two columns on desktop */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                     <div>
//                                         <label htmlFor="desiredChange" className={labelClass}>If you could change one thing, what would it be?</label>
//                                         <textarea
//                                             id="desiredChange"
//                                             rows={4}
//                                             value={formData.desiredChange}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('desiredChange')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="Better cable management, new chair…"
//                                             className={`${inputClass('desiredChange')} resize-y min-h-[110px]`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="decorativeTouches" className={labelClass}>Any decorative items or personal touches?</label>
//                                         <textarea
//                                             id="decorativeTouches"
//                                             rows={4}
//                                             value={formData.decorativeTouches}
//                                             onChange={handleInputChange}
//                                             onFocus={() => setFocusedField('decorativeTouches')}
//                                             onBlur={() => setFocusedField(null)}
//                                             placeholder="Plants, neon sign, art prints, figurines…"
//                                             className={`${inputClass('decorativeTouches')} resize-y min-h-[110px]`}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Comfort & Cable – full width */}
//                                 <div>
//                                     <label htmlFor="comfortCable" className={labelClass}>What have you done for comfort, ergonomics, and cable management?</label>
//                                     <textarea
//                                         id="comfortCable"
//                                         rows={3}
//                                         value={formData.comfortCable}
//                                         onChange={handleInputChange}
//                                         onFocus={() => setFocusedField('comfortCable')}
//                                         onBlur={() => setFocusedField(null)}
//                                         placeholder="Standing desk, ergo chair, under-desk trays…"
//                                         className={`${inputClass('comfortCable')} resize-y min-h-[88px]`}
//                                     />
//                                 </div>

//                                 <hr className="border-gray-200" />

//                                 {/* Software – full width */}
//                                 <div>
//                                     <label htmlFor="softwareTools" className={labelClass}>What software / tools do you use daily?</label>
//                                     <textarea
//                                         id="softwareTools"
//                                         rows={3}
//                                         value={formData.softwareTools}
//                                         onChange={handleInputChange}
//                                         onFocus={() => setFocusedField('softwareTools')}
//                                         onBlur={() => setFocusedField(null)}
//                                         placeholder="Figma, VS Code, Notion, Spotify…"
//                                         className={`${inputClass('softwareTools')} resize-y min-h-[88px]`}
//                                     />
//                                 </div>

//                                 <button
//                                     type="button"
//                                     onClick={() => setShowOptional(false)}
//                                     className="text-sm text-gray-400 hover:text-gray-600 transition-colors touch-manipulation flex items-center gap-1.5"
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
//                                     </svg>
//                                     Hide optional details
//                                 </button>
//                             </div>
//                         )}
//                     </section>

//                     {/* ============================================================ */}
//                     {/* 4. CONSENT & SUBMIT */}
//                     {/* ============================================================ */}
//                     <section className={cardClass}>
//                         {sectionHeader(4, 'Review & submit')}

//                         <div className="space-y-4 max-w-2xl mx-auto">
//                             <label
//                                 htmlFor="consent"
//                                 className={`flex items-start gap-3 cursor-pointer rounded-xl p-3 -m-3 transition-colors hover:bg-gray-50 ${errors.consent && touchedFields.has('consent') ? 'bg-red-50/60' : ''}`}
//                             >
//                                 <input
//                                     type="checkbox"
//                                     id="consent"
//                                     checked={formData.consent}
//                                     onChange={handleInputChange}
//                                     onBlur={() => { setTouchedFields(prev => new Set(prev).add('consent')) }}
//                                     className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0 shrink-0 cursor-pointer transition-all"
//                                 />
//                                 <span className={`text-sm leading-relaxed ${errors.consent && touchedFields.has('consent') ? 'text-red-600' : 'text-gray-700'}`}>
//                                     I agree to be featured on DeskScrolls and its social media. I confirm the photos are mine or I have permission. <span className="text-red-500">*</span>
//                                 </span>
//                             </label>
//                             {errorMessage('consent')}

//                             <label
//                                 htmlFor="newsletter"
//                                 className="flex items-start gap-3 cursor-pointer rounded-xl p-3 -m-3 transition-colors hover:bg-gray-50"
//                             >
//                                 <input
//                                     type="checkbox"
//                                     id="newsletter"
//                                     checked={formData.newsletter}
//                                     onChange={handleInputChange}
//                                     className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0 shrink-0 cursor-pointer transition-all"
//                                 />
//                                 <span className="text-sm text-gray-700 leading-relaxed">
//                                     Send me updates, featured setups, and community news.
//                                 </span>
//                             </label>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full max-w-md mx-auto mt-6 block bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-4 focus:ring-gray-300 touch-manipulation text-base shadow-sm"
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center justify-center gap-3">
//                                     <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                     </svg>
//                                     Submitting…
//                                 </span>
//                             ) : showOptional ? (
//                                 'Submit workspace for review'
//                             ) : (
//                                 'Continue'
//                             )}
//                         </button>

//                         {!showOptional && (
//                             <p className="text-center text-xs text-gray-400 mt-3">
//                                 We'll show you one more optional step before you submit.
//                             </p>
//                         )}

//                         {message && (
//                             <div
//                                 role="status"
//                                 className={`mt-4 text-sm font-medium p-4 rounded-xl border-2 animate-fadeIn max-w-2xl mx-auto flex items-start gap-2.5 ${
//                                     message.type === 'success'
//                                         ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
//                                         : 'bg-red-50 border-red-200 text-red-700'
//                                 }`}
//                             >
//                                 {message.type === 'success' ? (
//                                     <svg className="w-5 h-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-5 h-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
//                                     </svg>
//                                 )}
//                                 <span>{message.text}</span>
//                             </div>
//                         )}
//                     </section>

//                     {/* --- Footer note --- */}
//                     <p className="text-center text-xs text-gray-400 pt-2 pb-6">
//                         Your submission will be reviewed before being featured
//                     </p>

//                 </form>
//             </div>

//             {/* Inject keyframe animations */}
//             <style jsx>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(6px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fadeIn {
//                     animation: fadeIn 0.25s ease-out forwards;
//                 }
//             `}</style>
//         </section>
//     )
// }