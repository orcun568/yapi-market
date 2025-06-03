"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import AdminSidebar from "../../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";

export default function AdminHakkimizda() {
  const [form, setForm] = useState({
    hakkimizda: "",
    telefon: "",
    email: "",
    calismaSaatleri: "",
    konumAdres: "",
    haritaUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
    useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);

  useEffect(() => {
    fetch("/api/content/hakkimizda")
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/content/hakkimizda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) alert("İçerik kaydedildi.");
    else alert("Hata oluştu.");
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64  ">
          <AdminSidebar />
        </div>

        {/* Form alanı ortalanmış */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
              Hakkımızda İçerik Yönetimi
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "hakkimizda", label: "Hakkımızda Metni", type: "textarea" },
                { name: "telefon", label: "Telefon", type: "text" },
                { name: "email", label: "E-posta", type: "email" },
                { name: "calismaSaatleri", label: "Çalışma Saatleri", type: "text" },
                { name: "konumAdres", label: "Konum Adresi", type: "text" },
                { name: "haritaUrl", label: "Harita URL (iframe src)", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-medium text-green-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
