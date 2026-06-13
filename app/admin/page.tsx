import { createServerSupabase } from '../lib/supabase/server'
import Link from 'next/link'

type Setup = {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
}

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()
  const { data: setups } = await supabase
    .from('setups')
    .select('id, title, slug, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Setups</h1>
        <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded">+ New Setup</Link>
      </div>
      <ul className="space-y-2">
        {setups?.map((setup) => (
          <li key={setup.id} className="border p-3 rounded flex justify-between">
            <div>
              <Link href={`/admin/edit/${setup.id}`} className="font-semibold hover:underline">{setup.title}</Link>
              <span className="text-sm text-gray-500 ml-2">({setup.slug})</span>
            </div>
            <span className={`text-sm ${setup.published ? 'text-green-600' : 'text-yellow-600'}`}>
              {setup.published ? 'Published' : 'Draft'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}