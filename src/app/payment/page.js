'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';



export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [addressId, setAddressId] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const address = searchParams.get('addressId');
    if (address) {
      setAddressId(address);
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');

    if (!cardNumber || !cardHolder || !expiryDate || !cvc) {
      setMessage('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: addressId,
          paymentMethod: 'online',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Sipariş oluşturulamadı.');
      }

      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-md w-full mx-auto px-4 py-8 mt-10 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Online Ödeme</h1>

        <div className="space-y-5 text-green-700">
          <div>
            <label className="block text-sm font-semibold mb-1">Kart Numarası</label>
            <input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Kart Sahibi</label>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Son Kullanma</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">CVC</label>
              <input
                type="password"
                placeholder="123"
                maxLength={4}
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ödeme İşleniyor...' : 'Ödemeyi Tamamla'}
          </button>

          {message && (
            <p className="text-red-600 text-sm text-center mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
