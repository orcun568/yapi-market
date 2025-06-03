'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'  
import Navbar from '../../../components/Navbar'
import AdminSidebar from '../../../components/AdminSidebar'

import { redirect } from "next/navigation";

export default function UserManagementPage() {
  
  const { data: session } = useSession()  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId)
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole }),
    })
    const updatedUser = await res.json()

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: updatedUser.role } : user
      )
    )
    setUpdatingUserId(null)
  }

  const handleDelete = async (userId) => {
    if (session?.user?.id === userId) {
      alert('Kendi kullanıcı hesabınızı silemezsiniz.')
      return
    }

    const confirmed = confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')
    if (!confirmed) return

    const res = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })

    if (!res.ok) {
      const data = await res.json()
      alert('Silme hatası: ' + (data.error || 'Bilinmeyen hata'))
      return
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const filteredUsers = users.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="p-4">Yükleniyor...</div>

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 p-6 text-black">
          <h1 className="text-2xl font-semibold mb-4 text-green-600">Kullanıcı Yönetimi</h1>

          <input
            type="text"
            placeholder="Kullanıcı adına göre ara..."
            className="mb-4 border p-2 rounded w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <table className="min-w-full border border-green-600 shadow-lg rounded-lg overflow-hidden text-sm">
            <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white text-left">
              <tr>
                <th className="py-3 px-5">Ad</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Telefon</th>
                <th className="py-3 px-5">Rol</th>
                <th className="py-3 px-5">Rol Değiştir</th>
                <th className="py-3 px-5">Sil</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-green-50 transition-colors duration-200 border-t border-green-200"
                  >
                    <td className="py-3 px-5">{user.name || '-'}</td>
                    <td className="py-3 px-5">{user.email}</td>
                    <td className="py-3 px-5">{user.phoneNumber || '-'}</td>
                    <td className="py-3 px-5 capitalize">{user.role}</td>
                    <td className="py-3 px-5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingUserId === user.id}
                        className="border rounded p-1 w-full bg-white"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-5">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
