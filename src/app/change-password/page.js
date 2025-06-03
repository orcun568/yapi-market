'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../../../components/Navbar';
import SignOutButton from '../../../components/SignOutButton';

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  

  if (status === 'loading') {
    return <p>Yükleniyor...</p>;
  }

  if (!session) {
    return <p>Bu sayfayı görüntülemek için giriş yapmalısınız.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== newPasswordConfirm) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Bir hata oluştu');
        return;
      }

      setMessage(data.message);
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err) {
      setError('İstek sırasında hata oluştu');
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <aside className="w-64 bg-white p-6 shadow-lg flex flex-col min-h-[calc(100vh-64px)] sticky top-16">
          <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
          <nav className="flex flex-col space-y-4 flex-grow">
            <a href="/profile" className="text-gray-700 hover:text-green-600">
              Profilim
            </a>
            <a href="/order-list" className="text-gray-700 hover:text-green-600">
              Siparişlerim
            </a>
            <a href="/appointment-list" className="text-gray-700 hover:text-green-600">
              Randevularım
            </a>
            <a
              href="/change-password"
              className="text-gray-700 hover:text-green-600 font-semibold"
            >
              Şifre Yenileme
            </a>
          </nav>
          <SignOutButton className="mt-auto" />
        </aside>

        <main className="flex-grow p-8 max-w-3xl mx-auto w-full text-black">
          <h1 className="text-3xl font-semibold mb-6 text-green-600">Şifre Değiştir</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block mb-2 font-medium">Eski Şifre</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Yeni Şifre</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Şifreyi Güncelle
            </button>
          </form>

          {message && <p className="text-green-600 mt-6">{message}</p>}
          {error && <p className="text-red-600 mt-6">{error}</p>}
        </main>
      </div>
    </div>
  );
}
