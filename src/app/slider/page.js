"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";



export default function AdminSliderPage() {
  
  const { data: session } = useSession()  

  const [slider, setSlider] = useState({
    image1: "",
    title1: "",
    image2: "",
    title2: "",
    image3: "",
    title3: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  
    useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);

  useEffect(() => {
    fetch("/api/slider")
      .then((res) => res.json())
      .then((data) => {
        if (data) setSlider(data);
      });
  }, []);

  const handleChange = (key, value) => {
    setSlider((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slider),
      });
      if (res.ok) {
        setSuccessMessage("Slider başarıyla güncellendi.");
      } else {
        alert("Slider güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      alert("Slider güncellenirken bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Slider Yönetimi</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-8"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="flex-1 w-full">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Slide {i} Görsel URL
                  </label>
                  <input
                    type="text"
                    value={slider[`image${i}`] ?? ""}
                    onChange={(e) => handleChange(`image${i}`, e.target.value)}
                    placeholder={`Slide ${i} için görsel URL girin`}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />

                 
                </div>

                {slider[`image${i}`] && (
                  <img
                    src={slider[`image${i}`]}
                    alt={slider[`title${i}`] || `Slide image ${i}`}
                    className="w-40 h-28 object-cover rounded border border-gray-200 shadow"
                  />
                )}
              </div>
            ))}

            <div className="flex items-center gap-4 justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50`}
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>

            {successMessage && (
              <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2 text-sm">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}
