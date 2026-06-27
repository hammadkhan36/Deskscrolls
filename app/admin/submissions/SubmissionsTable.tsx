// // app/admin/submissions/SubmissionsTable.tsx
// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'
// import { updateSubmissionStatus } from './actions'

// type Submission = {
//   id: string
//   email: string
//   name: string
//   twitter: string | null
//   instagram: string | null
//   photo_link: string | null
//   description: string | null
//   equipment: string | null
//   status: string
//   created_at: string
//   social_profiles: any
//   image_urls: any
// }

// export default function SubmissionsTable({ submissions, currentStatus }: { submissions: Submission[]; currentStatus: string }) {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const changeStatus = async (id: string, newStatus: string) => {
//     await updateSubmissionStatus(id, newStatus)
//     router.refresh()
//   }

//   const updateFilter = (status: string) => {
//     const params = new URLSearchParams(searchParams.toString())
//     params.set('status', status)
//     router.push(`/admin/submissions?${params.toString()}`)
//   }

//   return (
//     <div className="space-y-4">
//       {/* Status tabs */}
//       <div className="flex gap-2 flex-wrap">
//         {['pending', 'approved', 'rejected', 'all'].map(s => (
//           <button
//             key={s}
//             onClick={() => updateFilter(s)}
//             className={`px-4 py-1 rounded-full text-sm font-medium ${
//               currentStatus === s
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             {s.charAt(0).toUpperCase() + s.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white rounded shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Email</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Description</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//               <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {submissions.map(sub => (
//               <tr key={sub.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 font-medium">{sub.name}</td>
//                 <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{sub.email}</td>
//                 <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">
//                   {sub.description || sub.equipment || '—'}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     sub.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {sub.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
//                   {sub.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => changeStatus(sub.id, 'approved')}
//                         className="text-green-600 hover:text-green-800 text-sm"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => changeStatus(sub.id, 'rejected')}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                   {sub.status === 'approved' && (
//                     <button
//                       onClick={() => changeStatus(sub.id, 'pending')}
//                       className="text-yellow-600 hover:text-yellow-800 text-sm"
//                     >
//                       Reset to Pending
//                     </button>
//                   )}
//                   {sub.status === 'rejected' && (
//                     <button
//                       onClick={() => changeStatus(sub.id, 'pending')}
//                       className="text-yellow-600 hover:text-yellow-800 text-sm"
//                     >
//                       Reset to Pending
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {submissions.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No submissions found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }























// app/admin/submissions/SubmissionsTable.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { updateSubmissionStatus } from './actions'

type Submission = {
  id: string
  email: string
  name: string
  location: string | null
  intro: string | null
  description: string | null
  budget: string | null
  space_size: string | null
  favorite_item: string | null
  recent_addition: string | null
  desired_change: string | null
  comfort_cable: string | null
  decorative_touches: string | null
  software_tools: string | null
  social_profiles: { platform: string; handle: string }[] | null
  image_urls: string[] | null
  gear_list: { name: string; link: string | null }[] | null
  consent: boolean
  newsletter: boolean
  status: string
  created_at: string
}

export default function SubmissionsTable({
  submissions,
  currentStatus,
}: {
  submissions: Submission[]
  currentStatus: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showModal, setShowModal] = useState(false)

  const changeStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Change status to "${newStatus}"?`)) return
    await updateSubmissionStatus(id, newStatus)
    router.refresh()
  }

  const updateFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', status)
    router.push(`/admin/submissions?${params.toString()}`)
  }

  const openDetail = (sub: Submission) => {
    setSelectedSubmission(sub)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSubmission(null)
  }

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => updateFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStatus === s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Images</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Gear</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <div className="text-xs text-gray-500">{sub.email}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                  {sub.location || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                  {sub.image_urls?.length ?? 0}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                  {sub.gear_list?.length ?? 0}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : sub.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openDetail(sub)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View
                  </button>
                  {sub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => changeStatus(sub.id, 'approved')}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => changeStatus(sub.id, 'rejected')}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(sub.status === 'approved' || sub.status === 'rejected') && (
                    <button
                      onClick={() => changeStatus(sub.id, 'pending')}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    >
                      Reset
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <SubmissionDetailModal submission={selectedSubmission} onClose={closeModal} />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Detail Modal Component                                                    */
/* -------------------------------------------------------------------------- */
function SubmissionDetailModal({
  submission,
  onClose,
}: {
  submission: Submission
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
              <p className="text-gray-900 font-medium">{submission.name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <p className="text-gray-900">{submission.email || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
              <p className="text-gray-900">{submission.location || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  submission.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : submission.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {submission.status}
              </span>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</label>
              <p className="text-gray-900">{new Date(submission.created_at).toLocaleString()}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Intro & Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Intro</label>
            <p className="text-gray-900 mt-1 whitespace-pre-line">{submission.intro || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
            <p className="text-gray-900 mt-1 whitespace-pre-line">{submission.description || '—'}</p>
          </div>

          <hr className="border-gray-200" />

          {/* Social Profiles */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Social Profiles</label>
            {submission.social_profiles && submission.social_profiles.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {submission.social_profiles.map((p, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{p.platform}:</span> {p.handle}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">None provided</p>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Images */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Images</label>
            {submission.image_urls && submission.image_urls.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                {submission.image_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No images uploaded</p>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Gear List */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gear Items</label>
            {submission.gear_list && submission.gear_list.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {submission.gear_list.map((item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{item.name}</span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-indigo-600 hover:underline text-xs"
                      >
                        (link)
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No gear listed</p>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Optional details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.budget && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</label>
                <p className="text-gray-900">{submission.budget}</p>
              </div>
            )}
            {submission.space_size && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Space Size</label>
                <p className="text-gray-900">{submission.space_size}</p>
              </div>
            )}
            {submission.favorite_item && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorite Item</label>
                <p className="text-gray-900">{submission.favorite_item}</p>
              </div>
            )}
            {submission.recent_addition && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Addition</label>
                <p className="text-gray-900">{submission.recent_addition}</p>
              </div>
            )}
            {submission.desired_change && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Desired Change</label>
                <p className="text-gray-900">{submission.desired_change}</p>
              </div>
            )}
            {submission.comfort_cable && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comfort & Cable</label>
                <p className="text-gray-900">{submission.comfort_cable}</p>
              </div>
            )}
            {submission.decorative_touches && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Decorative Touches</label>
                <p className="text-gray-900">{submission.decorative_touches}</p>
              </div>
            )}
            {submission.software_tools && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Software / Tools</label>
                <p className="text-gray-900">{submission.software_tools}</p>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Consent & Newsletter */}
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-medium">Consent:</span>{' '}
              {submission.consent ? (
                <span className="text-green-600">✓ Given</span>
              ) : (
                <span className="text-red-500">✗ Not given</span>
              )}
            </div>
            <div>
              <span className="font-medium">Newsletter:</span>{' '}
              {submission.newsletter ? (
                <span className="text-green-600">✓ Subscribed</span>
              ) : (
                <span className="text-gray-400">Not subscribed</span>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}