'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import Link from 'next/link'
import ColorCatalogClient from '../../../components/ColorCatalogClient'



function ResponseView({ status, message, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-3xl shadow-xl max-w-lg mx-auto space-y-4 text-center">
      {status === 'success' ? (
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}

      <h2 className={`text-2xl font-bold ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
        {status === 'success' ? 'Başarılı!' : 'Hata!'}
      </h2>
      <p className="text-gray-700">{message}</p>

      <button
        onClick={onClose}
        className={`mt-6 px-6 py-3 rounded-full font-semibold transition ${
          status === 'success'
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        Tamam
      </button>
    </div>
  )
}

export default function AppointmentPage() {
   

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    addressId: '',
    paintAreaDescription: '',
    paintColorId: '',
    paintType: '',
    appointmentDate: '',
  })

  const [colors, setColors] = useState([])
  const [addresses, setAddresses] = useState([])
  const [bookedDates, setBookedDates] = useState([]) // Dolmuş randevu günleri
  const [response, setResponse] = useState(null) // {status: 'success'|'error', message: string}
  const router = useRouter()

  useEffect(() => {
    const fetchColors = async () => {
      const res = await fetch('/api/paint-color')
      const data = await res.json()
      setColors(data)
    }
    fetchColors()
  }, [])

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await fetch('/api/addresses')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    }
    fetchAddresses()
  }, [])

  useEffect(() => {
    const fetchBookedDates = async () => {
      const res = await fetch('/api/appointments/booked-dates')
      if (res.ok) {
        const data = await res.json()
        setBookedDates(data) // ["2025-06-10", "2025-06-15", ...]
      }
    }
    fetchBookedDates()
  }, [])

  const fillUserInfo = async () => {
    try {
      const res = await fetch('/api/user')
      if (!res.ok) throw new Error('Kullanıcı bilgisi alınamadı')
      const data = await res.json()
      setFormData(prev => ({
        ...prev,
        fullName: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
      }))
    } catch {
      setResponse({ status: 'error', message: 'Kullanıcı bilgileri alınamadı.' })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'appointmentDate') {
      if (bookedDates.includes(value)) {
        alert('Seçtiğiniz tarih doludur, lütfen başka bir tarih seçin.')
        return
      }
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (bookedDates.includes(formData.appointmentDate)) {
      setResponse({ status: 'error', message: 'Seçtiğiniz tarihe randevu zaten alınmış.' })
      return
    }

    const selectedAddress = addresses.find(addr => addr.id === formData.addressId)
    const fullAddress = selectedAddress
      ? `${selectedAddress.label} - ${selectedAddress.city}/${selectedAddress.district} - ${selectedAddress.openAddress}`
      : ''

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, address: fullAddress }),
      })

      if (res.ok) {
        setResponse({ status: 'success', message: 'Randevu başarıyla oluşturuldu.' })
        setTimeout(() => router.push('/appointment-success'), 2000)
      } else {
        const errorData = await res.json()
        setResponse({ status: 'error', message: errorData.error || 'Bilinmeyen hata oluştu.' })
      }
    } catch (error) {
      setResponse({ status: 'error', message: 'Sunucu hatası: ' + error.message })
    }
  }

  if (response) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-4 py-16">
          <ResponseView
            status={response.status}
            message={response.message}
            onClose={() => setResponse(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-16 text-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-lg max-w-xl w-full space-y-6"
          noValidate
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-green-700">Randevu Al</h1>
            <button
              type="button"
              onClick={fillUserInfo}
              className="text-sm bg-white border border-green-700 text-green-700 px-5 py-2 rounded-full shadow-md hover:bg-green-700 hover:text-white transition"
            >
              Kendi Bilgilerini Kullan
            </button>
          </div>

          <input
            type="text"
            name="fullName"
            placeholder="Ad Soyad"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Telefon Numarası"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            name="addressId"
            onChange={handleChange}
            value={formData.addressId}
            required
            className="w-full p-4 border border-green-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Adres Seç</option>
            {addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.label} - {addr.city}, {addr.district}
              </option>
            ))}
          </select>

          <Link
            href="/profile"
            className="inline-block bg-green-700 text-white py-2 px-8 rounded-full font-semibold text-center hover:bg-white hover:text-green-700 border border-green-700 transition mb-6"
            tabIndex={-1}
          >
            Adres Ekle/Düzenle
          </Link>

          <textarea
            name="paintAreaDescription"
            placeholder="Boyanacak alan hakkında bilgi (örnek: 3 oda + 1 salon)"
            value={formData.paintAreaDescription}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[100px]"
          />

          <select
            name="paintType"
            value={formData.paintType}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Boya Tipi Seç</option>
            <option value="mat">Mat</option>
            <option value="yarımat">Yarı Mat</option>
            <option value="parlak">Parlak</option>
          </select>

          <select
            name="paintColorId"
            value={formData.paintColorId}
            onChange={handleChange}
            required
            className="w-full p-4 border border-green-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Renk Seç</option>
            {colors.map(color => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // Bugünden sonrası
            className="w-full p-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition"
          >
            Randevu Oluştur
          </button>
        </form>
      </div>
      <ColorCatalogClient colors={colors} />
    </div>
  )
}
