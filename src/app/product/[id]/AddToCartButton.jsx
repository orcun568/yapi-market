// app/products/[id]/AddToCartButton.jsx (Client Component)
"use client";

import { useState } from "react";

export default function AddToCartButton({ productId, stock }) {
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    setLoading(true);
    const res = await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);

    if (res.ok) {
      alert("Ürün sepete eklendi!");
    } else {
      alert("Lütfen giriş yapın!");
    }
  };

  return (
    <button
      onClick={addToCart}
      className="mt-8 px-6 py-3 bg-white text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition self-end md:self-start disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      disabled={stock === 0 || loading}
    >
      {loading ? "Ekleniyor..." : "Sepete Ekle"}
    </button>
  );
}
