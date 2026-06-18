// app/admin/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  status: string
  created_at: string
}

export default function UsersPage() {
  const supabase = createClient()
  const router = useRouter()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null) // user id being processed
  const [error, setError] = useState('')

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (filter === 'pending') query = query.eq('status', 'pending')
    else if (filter === 'active') query = query.eq('status', 'active')
    const { data, error: fetchError } = await query
    if (fetchError) setError(fetchError.message)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [filter])

  // Approve user: set status = active, role = selected role
  const approveUser = async (userId: string, newRole: string) => {
    setActionLoading(userId)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: 'active', role: newRole })
      .eq('id', userId)
    if (updateError) {
      alert('Failed to approve: ' + updateError.message)
    } else {
      fetchUsers() // refresh list
    }
    setActionLoading(null)
  }

  // Change role of existing active user
  const changeRole = async (userId: string, newRole: string) => {
    setActionLoading(userId)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
    if (updateError) {
      alert('Failed to change role: ' + updateError.message)
    } else {
      fetchUsers()
    }
    setActionLoading(null)
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'active'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && ' 🕒'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.avatar_url && (
                        <img src={user.avatar_url} className="w-8 h-8 rounded-full" alt="" />
                      )}
                      <span className="font-medium text-gray-900">
                        {user.full_name || 'No name'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    {user.status === 'pending' ? (
                      <div className="flex items-center gap-2 justify-end">
                        <select
                          defaultValue="author"
                          className="text-xs border rounded px-1 py-0.5"
                          id={`role-${user.id}`}
                        >
                          <option value="author">Author</option>
                          <option value="manager">Manager</option>
                        </select>
                        <button
                          onClick={() => {
                            const select = document.getElementById(`role-${user.id}`) as HTMLSelectElement
                            approveUser(user.id, select.value)
                          }}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === user.id ? '...' : 'Approve'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <select
                          defaultValue={user.role}
                          className="text-xs border rounded px-1 py-0.5"
                          id={`role-${user.id}`}
                          disabled={user.role === 'admin'} // can't change admin's own role? Actually you could, but be careful
                        >
                          <option value="author">Author</option>
                          <option value="manager">Manager</option>
                          {user.role === 'admin' && <option value="admin">Admin</option>}
                        </select>
                        <button
                          onClick={() => {
                            const select = document.getElementById(`role-${user.id}`) as HTMLSelectElement
                            changeRole(user.id, select.value)
                          }}
                          disabled={actionLoading === user.id || user.role === 'admin'}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoading === user.id ? '...' : 'Update Role'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}