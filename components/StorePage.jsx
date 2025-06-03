'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [categories, setCategories] = useState(["Hepsi"]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  // Fiyatı sayıya çeviren yardımcı fonksiyon
  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    return Number(price.toString().replace(/[^\d]/g, ""));
  };

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
    async function fetchData() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error(`API isteği başarısız oldu: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);

        // Kategorileri ürünlerden çıkart
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category.name)));
        setCategories(["Hepsi", ...uniqueCategories]);
      } catch (err) {
        console.error("Ürünler alınırken hata oluştu:", err);
        setProducts([]); // Hata durumunda ürünleri boş yap
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "Hepsi"
      ? products
      : products.filter((p) => p.category.name === selectedCategory);

  const priceFilteredProducts = filteredProducts.filter((product) => {
    const price = parsePrice(product.price);
    const min = minPrice ? parseInt(minPrice, 10) : -Infinity;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
    return price >= min && price <= max;
  });

  if (loading) return <div className="p-10 text-center text-green-600">Yükleniyor...</div>;

  return (
    <div className="flex min-h-[80vh] gap-8 bg-white p-8">
      {/* Sol: Filtreleme */}
      <aside className="w-[220px] bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-green-600 text-center mb-4">Kategoriler</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`w-full text-left px-4 py-2 rounded border ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-600 border-green-600"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h3 className="text-green-600 text-center mb-4">Fiyat Aralığı</h3>
          <div className="flex flex-col gap-2">
            <input
              type="number"
              placeholder="Min ₺"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-green-600 rounded px-3 py-2 text-green-600 placeholder-green-400"
            />
            <input
              type="number"
              placeholder="Max ₺"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-green-600 rounded px-3 py-2 text-green-600 placeholder-green-400"
            />
          </div>
        </div>
      </aside>

      {/* Sağ: Ürünler */}
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {priceFilteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg bg-white shadow-lg p-4 flex flex-col items-center"
            >
              <div className="relative w-full h-64 mb-4 overflow-hidden ">
                <img
                  src={product.image || "/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-contain rounded"
                  style={{ objectPosition: "center", background: "#ffffff" }}
                />
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                    Tükendi
                  </div>
                )}
              </div>
              <h3 className="text-green-600 text-lg font-semibold text-center mb-2">
                {product.name}
              </h3>
              
              <p
                className="text-sm text-gray-700 mb-2 text-center line-clamp-2"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '2.5em'
                }}
              >
                {product.description}
              </p>
              <div className="text-green-600 font-bold text-lg mb-4">
                ₺{parsePrice(product.price).toLocaleString("tr-TR")}
              </div>
              <div className="flex w-full gap-2 ">
                <Link href={`/product/${product.id}`} className="flex-1">
                  <button className="w-full h-11 bg-white border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
                    İncele
                  </button>
                </Link>
                <button
                  onClick={() => addToCart(product.id)}
                  className="flex-1 h-11 bg-green-600 text-white rounded hover:bg-white hover:text-green-600 border border-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
