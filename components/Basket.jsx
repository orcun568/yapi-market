'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAnyOutOfStock = cartItems.some(item => item.product.stock === 0);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Sepet alınamadı');
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, type) => {
    const res = await fetch('/api/cart/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, type }),
    });
    if (res.ok) fetchCart();
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch('/api/cart/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const result = await res.json();

      if (res.ok) fetchCart();
      else alert('Silme hatası: ' + result.error);
    } catch (error) {
      alert('Silme sırasında hata oluştu.');
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) fetchCart();
      else alert('Temizleme hatası: ' + result.error);
    } catch (error) {
      alert('Sepet temizlenemedi.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) return <p className="text-center text-green-600">Yükleniyor...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Sepetim</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-green-700 bg-green-50 border border-green-200 rounded-lg p-6 shadow">
          <p className="text-lg font-medium">Sepetiniz boş.</p>
          <Link href="/" className="mt-4 inline-block text-green-600 hover:underline">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-center bg-white p-4 shadow-sm border rounded-lg"
            >
              <Link href={`/product/${item.product.id}`} className="flex gap-4 items-center">
                <div className="relative w-20 h-20">
                  <img
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                  />
                  {item.product.stock === 0 && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Tükendi
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-green-700">{item.product.name}</p>
                  <p className="text-sm text-gray-600">{item.product.price} ₺</p>
                  <p className="text-sm text-gray-500">Stok: {item.product.stock}</p>
                </div>
              </Link>

              <p className="text-sm text-gray-600 hidden md:block line-clamp-2 px-4">
                {item.product.description}
              </p>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => updateQuantity(item.productId, 'decrease')}
                  className="w-8 h-8  rounded text-green-600 hover:bg-green-100"
                >
                  -
                </button>
                <span className="min-w-[24px] text-center text-black">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, 'increase')}
                  className="w-8 h-8  rounded text-green-600 hover:bg-green-100"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          {isAnyOutOfStock && (
            <p className="text-red-600 text-sm mt-2">
              Sepette stoğu tükenmiş ürün(ler) var. Lütfen çıkarınız.
            </p>
          )}

          <div className="sticky bottom-0 bg-white border-t pt-4 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xl font-semibold text-green-700">
              Toplam: {calculateTotal()} ₺
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sepeti Temizle
              </button>
              <Link href="/order" className="w-full sm:w-auto">
                <button
                  disabled={isAnyOutOfStock}
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Satın Al
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
