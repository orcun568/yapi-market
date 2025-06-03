// components/CheckoutAddressSelector.tsx
"use client";

import { useState } from "react";

// Address prop type for JS
export default function CheckoutAddressSelector({ addresses }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    // buraya kendi işlemini ekleyebilirsin
    console.log("Seçilen adres:", id);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold">Teslimat Adresi</h2>
      {addresses.length === 0 && <p>Adres bulunamadı.</p>}
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => handleSelect(address.id)}
          className={`border p-4 rounded-xl cursor-pointer transition ${
            selectedId === address.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <p>{address.label}</p>
          <p className="font-medium">{address.fullName}</p>
          <p>{address.openAddress}, {address.district}, {address.city}</p>
          <p>{address.phoneNumber}</p>
        </div>
      ))}
    </div>
  );
}
