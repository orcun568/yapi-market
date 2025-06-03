'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  const addToCart = async (productId) => {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Ürün sepete eklendi!");
    } else {
      alert("Lütfen giriş yapın!");
    }
  };

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products/featured');
        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Öne çıkan ürünler alınamadı:", err);
      }
    }

    fetchFeatured();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-10 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-green-600 mb-8">
          Öne Çıkan Ürünler
        </h2>

        <div className="flex items-center space-x-4">
          {/* Sol buton */}
          <button
            onClick={scrollLeft}
            className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
            aria-label="Önceki"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Ürün listesi */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-64 sm:w-72 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-40 sm:h-56">
                  <img
                    src={product.image || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                      Tükendi
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-600">{product.name}</h3>
                  <p className="text-xl mt-2 font-bold text-green-600">
                    ₺{Number(product.price).toLocaleString("tr-TR")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 text-center border-green-600 border bg-white text-green-600 py-2 px-4 rounded-lg hover:text-white hover:bg-green-600 transition text-sm"
                    >
                      İncele
                    </Link>
                    <button
                      onClick={() => {
                        addToCart(product.id);
                        if (window.location.pathname === "/basket") {
                          window.location.reload();
                        } else if (window.location.pathname === "/order") {
                          window.location.href = "/basket";
                        }
                      }}
                      disabled={product.stock === 0}
                      className="flex-1 text-center border-green-600 border bg-green-600 text-white py-2 px-4 rounded-lg hover:text-green-600 hover:bg-white transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sağ buton */}
          <button
            onClick={scrollRight}
            className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
            aria-label="Sonraki"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollbar gizleme */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
