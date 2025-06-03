"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../../../components/Navbar";
import FeaturedProducts from "../../../components/FeaturedProducts";
import { ShoppingCart, MapPin, CreditCard } from 'lucide-react';



export default function CreateOrderPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || '';

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        const cartRes = await fetch('/api/cart');
        const cartData = await cartRes.json();
        setCartItems(cartData);

        const addrRes = await fetch('/api/addresses');
        const addrData = await addrRes.json();
        setAddresses(addrData);
        if (addrData.length > 0) setSelectedAddressId(addrData[0].id);
      } catch (err) {
        setMessage("Veri çekilirken hata oluştu.");
      }
    }

    fetchData();
  }, [userId]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (!selectedAddressId) {
      setMessage("Lütfen bir teslimat adresi seçin.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod: 'Kapıda Ödeme',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sipariş oluşturulamadı.");
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentClick = () => {
    if (!selectedAddressId) {
      setMessage("Lütfen teslimat adresi seçin.");
      return;
    }

    // Mesaj varsa temizle
    setMessage('');

    // Ödeme sayfasına yönlendir
    router.push(`/payment?totalAmount=${totalAmount}&addressId=${selectedAddressId}`);
  };

  if (status === "loading") return <div className="p-6 text-center">Yükleniyor...</div>;
  if (!session) return <div className="p-6 text-center text-red-600">Lütfen giriş yapın.</div>;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-green-800">

        {/* 🛒 SEPET */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <ShoppingCart className="w-5 h-5" /> Sepetiniz
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Sepetiniz boş.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto text-sm">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between border-b pb-1">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{item.product.price * item.quantity} ₺</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🏠 ADRES */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <MapPin className="w-5 h-5" /> Teslimat Adresi
          </h2>
          {addresses.length === 0 ? (
            <p className="text-gray-600 mb-2">Adresiniz bulunamadı. Lütfen adres ekleyin.</p>
          ) : (
            <select
              className="border p-2 rounded w-full bg-white"
              value={selectedAddressId}
              onChange={e => setSelectedAddressId(e.target.value)}
            >
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.label && `${addr.label} - `}
                  {addr.fullName}, {addr.city} / {addr.district}
                </option>
              ))}
            </select>
          )}
          <Link href="/profile" className="inline-block mt-4">
            <button className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Adres Ekle/Düzenle
            </button>
          </Link>
        </div>

        {/* 💳 ÖDEME */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <CreditCard className="w-5 h-5" /> Ödeme Yöntemi
          </h2>
          <select
            className="border p-2 rounded w-full bg-white"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit_card">Online Ödeme</option>
            <option value="cash_on_delivery">Kapıda Ödeme</option>
          </select>
        </div>

        {/* ✅ ONAY & TUTAR */}
        <div className="text-lg font-bold">
          <span className="text-green-700">Toplam Tutar: </span> {totalAmount} ₺
        </div>

         {paymentMethod === 'cash_on_delivery' ? (
          <button
            onClick={handleOrder}
            className="bg-green-600 text-white w-full py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sipariş oluşturuluyor...' : 'Siparişi Onayla'}
          </button>
        ) : (
          <button
            onClick={handlePaymentClick}
            className="bg-green-600 text-white w-full py-3 rounded-xl hover:bg-green-700 transition"
          >
            Ödeme Sayfasına Git
          </button>
        )}
        {message && (
          <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>
        )}
      </div>

      <FeaturedProducts />
    </div>
  );
}
