'use client'

import { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import SignOutButton from '../../../components/SignOutButton'


export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])

  // Filtreler
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error('Siparişler alınamadı:', error)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Tarih aralığı filtresi
    if (startDate) {
      filtered = filtered.filter(order => new Date(order.createdAt) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter(order => new Date(order.createdAt) <= new Date(endDate))
    }

    setFilteredOrders(filtered)
  }, [statusFilter, startDate, endDate, orders])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen">
          <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
          <nav className="flex flex-col space-y-4 flex-1">
            <a href="/profile" className="text-gray-700 hover:text-green-600">Profilim</a>
            <a href="/order-list" className="text-gray-700 hover:text-green-600">Siparişlerim</a>
            <a href="/appointment-list" className="text-gray-700 hover:text-green-600">Randevularım</a>
            <a href="/change-password" className="text-gray-700 hover:text-green-600">Şifre Yenileme</a>
          </nav>
          <SignOutButton />
        </aside>

        <div className="p-6 flex-1 text-black">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Siparişlerim</h1>

          {/* Filtre alanları */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div>
              <label className="mr-2 font-semibold text-gray-700">Ödeme Durumu:</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-green-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="all">Tümü</option>
                <option value="Sipariş Alındı">Sipariş Alındı</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal Edildi">İptal Edildi</option>
                
              </select>
            </div>

            
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-green-600 shadow-lg rounded-lg overflow-hidden text-sm">
              <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white text-left">
                <tr>
                  <th className="py-3 px-5">Ürün Adı</th>
                  <th className="py-3 px-5">Adet</th>
                  <th className="py-3 px-5">Toplam Tutar</th>
                  <th className="py-3 px-5">Ödeme Durumu</th>
                  <th className="py-3 px-5">Adres</th>
                  <th className="py-3 px-5">Ödeme Tipi</th>
                  <th className="py-3 px-5">Sipariş Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Kriterlere uygun sipariş bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) =>
                    order.items.map((item, index) => (
                      <tr
                        key={`${order.id}-${index}`}
                        className="hover:bg-green-50 transition-colors duration-200 border-t border-green-200"
                      >
                        <td className="py-3 px-5">{item.productName}</td>
                        <td className="py-3 px-5">{item.quantity}</td>
                        {index === 0 && (
                          <>
                            <td className="py-3 px-5" rowSpan={order.items.length}>
                              <span className="font-semibold text-green-700">
                                {order.totalAmount} ₺
                              </span>
                            </td>
                            <td className="py-3 px-5" rowSpan={order.items.length}>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Sipariş Alındı'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'Kargoya Verildi'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : order.status === 'canceled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {order.us}
                              </span>
                            </td>
                            <td className="py-3 px-5" rowSpan={order.items.length}>
                              <div className="text-sm text-gray-700">{order.address}</div>
                            </td>
                            <td className="py-3 px-5" rowSpan={order.items.length}>
                              {order.paymentMethod}
                            </td>
                            <td className="py-3 px-5" rowSpan={order.items.length}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  )
}
