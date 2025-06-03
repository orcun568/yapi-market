"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";


export default function CategoryPage() {
  const { data: session } = useSession()
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editId, setEditId] = useState(null);

    useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    const url = editId ? `/api/categories/${editId}` : "/api/categories";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setSuccessMessage(editId ? "Kategori güncellendi." : "Kategori başarıyla eklendi.");
      setName("");
      setEditId(null);
      fetchCategories();
    } else {
      alert(editId ? "Kategori güncellenemedi." : "Kategori eklenemedi.");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchCategories();
    } else {
      alert("Kategori silinemedi.");
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditId(category.id);
    setSuccessMessage("");
  };

  const cancelEdit = () => {
    setName("");
    setEditId(null);
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {/* Kategori Tablosu */}
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-6">Kategoriler</h1>
            <div className="overflow-x-auto shadow-sm rounded-xl border border-green-300">
              <table className="min-w-full text-sm text-left rounded-xl">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="py-3 px-5">#</th>
                    <th className="py-3 px-5">Kategori Adı</th>
                    <th className="py-3 px-5">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-400 italic">
                        Henüz kategori eklenmemiş.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat, index) => (
                      <tr
                        key={cat.id}
                        className="border-t border-green-100 hover:bg-green-50 transition-all"
                      >
                        <td className="py-3 px-5 font-medium text-gray-700">{index + 1}</td>
                        <td className="py-3 px-5 font-semibold text-green-800 text-base">{cat.name}</td>
                        <td className="py-3 px-5 space-x-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="px-3 py-1 text-sm rounded-md text-white bg-blue-500 hover:bg-blue-600 transition"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="px-3 py-1 text-sm rounded-md text-white bg-red-500 hover:bg-red-600 transition"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form */}
          <div className="pt-6 border-t border-green-200 text-black">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              {editId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kategori adı girin..."
                className="border border-green-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                required
              />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (editId ? "Güncelleniyor..." : "Ekleniyor...") : (editId ? "Güncelle" : "Ekle")}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-gray-600 underline text-sm"
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>

            {successMessage && (
              <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2 text-sm">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
