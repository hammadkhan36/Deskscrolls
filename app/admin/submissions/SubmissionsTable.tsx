// app/admin/submissions/SubmissionsTable.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { updateSubmissionStatus } from './actions'

type Submission = {
  id: string
  email: string
  name: string
  twitter: string | null
  instagram: string | null
  photo_link: string | null
  description: string | null
  equipment: string | null
  status: string
  created_at: string
  social_profiles: any
  image_urls: any
}

export default function SubmissionsTable({ submissions, currentStatus }: { submissions: Submission[]; currentStatus: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const changeStatus = async (id: string, newStatus: string) => {
    await updateSubmissionStatus(id, newStatus)
    router.refresh()
  }

  const updateFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', status)
    router.push(`/admin/submissions?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map(s => (
          <button
            key={s}
            onClick={() => updateFilter(s)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              currentStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{sub.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{sub.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">
                  {sub.description || sub.equipment || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                    sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  {sub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => changeStatus(sub.id, 'approved')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => changeStatus(sub.id, 'rejected')}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {sub.status === 'approved' && (
                    <button
                      onClick={() => changeStatus(sub.id, 'pending')}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      Reset to Pending
                    </button>
                  )}
                  {sub.status === 'rejected' && (
                    <button
                      onClick={() => changeStatus(sub.id, 'pending')}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      Reset to Pending
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}