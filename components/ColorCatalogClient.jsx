"use client";

import React, { useEffect, useState } from "react";

export default function ColorCatalogClient() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchColors() {
      try {
        const res = await fetch("/api/paint-color", );
        if (!res.ok) throw new Error("Renkler getirilemedi");
        const data = await res.json();
        setColors(data);
      } catch (err) {
        setError(err.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    }
    fetchColors();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>Hata: {error}</p>;
  

  return (
    <div className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Renk Kataloğu</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {colors.map((color) => (
        <div
          key={color.id}
          className="border rounded-xl shadow p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition"
        >
          <div
            className="w-20 h-20 rounded-full border"
            style={{ backgroundColor: color.hexCode }}
          />
          <div className="text-center">
            <h3 className="text-sm font-medium text-black">{color.name}</h3>
            <p className="text-xs text-gray-500">
              Stok: {color.stock > 0 ? color.stock : "Stokta yok"}
            </p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
