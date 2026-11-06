export type HomeCategory = {
  name: string
  slug: string
}

export type HomeSetup = {
  id: string
  title: string | null
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
  featured: boolean | null
  published_at: string | null
  primary_category: HomeCategory | null
}

/** PostgREST returns a to-one embed as an object, but the untyped client
 *  sometimes types it as an array. Normalise both shapes. */
export function toOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? value[0] ?? null : value
}

export function setupTitle(setup: Pick<HomeSetup, 'title' | 'owner_name'>) {
  return setup.title?.trim() || `${setup.owner_name}'s desk setup`
}

export function ownerInitial(ownerName: string) {
  return (ownerName.trim().charAt(0) || 'D').toUpperCase()
}
