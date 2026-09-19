// app/admin/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          User Management
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Approve users and manage their admin roles.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:flex">
        {(['all', 'pending', 'active'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium capitalize ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-slate-200 hover:bg-gray-50'
            }`}
          >
            {f}
            {f === 'pending' && ' 🕒'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No users found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
                      {(user.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-slate-900">
                      {user.full_name || 'No name'}
                    </h2>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium capitalize text-blue-800">
                        {user.role}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  {user.status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        defaultValue="author"
                        id={`mobile-role-${user.id}`}
                        className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base"
                      >
                        <option value="author">Author</option>
                        <option value="manager">Manager</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const select = document.getElementById(
                            `mobile-role-${user.id}`
                          ) as HTMLSelectElement

                          approveUser(user.id, select.value)
                        }}
                        disabled={actionLoading === user.id}
                        className="min-h-11 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === user.id ? 'Approving…' : 'Approve'}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        defaultValue={user.role}
                        id={`mobile-role-${user.id}`}
                        disabled={user.role === 'admin'}
                        className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base disabled:bg-slate-100"
                      >
                        <option value="author">Author</option>
                        <option value="manager">Manager</option>

                        {user.role === 'admin' && (
                          <option value="admin">Admin</option>
                        )}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const select = document.getElementById(
                            `mobile-role-${user.id}`
                          ) as HTMLSelectElement

                          changeRole(user.id, select.value)
                        }}
                        disabled={
                          actionLoading === user.id ||
                          user.role === 'admin'
                        }
                        className="min-h-11 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {actionLoading === user.id ? 'Updating…' : 'Update Role'}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-lg bg-white shadow sm:block">
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
                          // eslint-disable-next-line @next/next/no-img-element
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
                            className="min-h-10 rounded-lg border bg-white px-2 text-sm"
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
                            className="min-h-10 rounded-lg bg-green-600 px-3 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === user.id ? '...' : 'Approve'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-end">
                          <select
                            defaultValue={user.role}
                            className="min-h-10 rounded-lg border bg-white px-2 text-sm"
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
                            className="min-h-10 rounded-lg bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
        </>
      )}
    </div>
  )
}
