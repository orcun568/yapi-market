"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";

export default function ProductAdminPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
      useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);

    const [form, setForm] = useState({
        id: null,
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
        image: "",
        isFeatured: false,
    });

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = form.id ? "PUT" : "POST";
        const res = await fetch("/api/products", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setForm({
                id: null,
                name: "",
                price: "",
                stock: "",
                categoryId: "",
                description: "",
                image: "",
                isFeatured: false,
            });
            fetchProducts();
        }
    };

    const handleEdit = (product) => {
        setForm({
            id: product.id,
            name: product.name || "",
            price: product.price?.toString() || "",
            stock: product.stock?.toString() || "",
            categoryId: product.categoryId?.toString() || "",
            description: product.description || "",
            image: product.image || "",
            isFeatured: product.isFeatured || false,
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm("Silmek istediğinizden emin misiniz?");
        if (!confirmDelete) return;
        await fetch("/api/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchProducts();
    };

    const navbarHeight = 64;

    // 3. products'u filtrele
    const filteredProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6 ml-32 mr-32 mt-6">
                    <h1 className="text-2xl font-bold mb-4 text-green-600">Ürün Yönetimi</h1>

                    <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-2 gap-4 text-green-600">
                        <input
                            type="text"
                            name="name"
                            placeholder="Ürün Adı"
                            value={form.name}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Fiyat"
                            value={form.price}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stok"
                            value={form.stock}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <select
                            name="categoryId"
                            value={form.categoryId || ""}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Kategori Seçin</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="image"
                            placeholder="Görsel URL"
                            value={form.image}
                            onChange={handleChange}
                            className="border p-2 rounded col-span-2"
                        />
                        {form.image && (
                            <div className="col-span-2">
                                <img src={form.image} alt="Ürün Görseli" className="w-50 h-50 object-cover border" />
                            </div>
                        )}

                        <textarea
                            name="description"
                            placeholder="Açıklama"
                            value={form.description}
                            onChange={handleChange}
                            className="border p-2 rounded col-span-2"
                        />
                        <label className="flex items-center col-span-2 space-x-2">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded"
                            />
                            <span>Öne Çıkan Ürün</span>
                        </label>
                        <button
                            type="submit"
                            className="bg-green-600 border border-green-600 text-white hover:bg-white hover:text-green-600 py-2 px-4 rounded col-span-2"
                        >
                            {form.id ? "Güncelle" : "Ekle"}
                        </button>
                    </form>
                    <h1 className="text-2xl font-bold mb-4 text-green-600">Ürünler</h1>
                    {/* Arama inputu - ürün listesinin üstünde */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Ürün ismine göre ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 rounded w-1/3 text-green-600"
                        />
                    </div>

                    <table className="w-full table-auto border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-green-600 text-white text-left text-sm uppercase tracking-wider">
                                <th className="p-3 border border-gray-200">Ad</th>
                                <th className="p-3 border border-gray-200">Fiyat</th>
                                <th className="p-3 border border-gray-200">Stok</th>
                                <th className="p-3 border border-gray-200">Kategori</th>
                                <th className="p-3 border border-gray-200 text-center">Öne Çıkan</th>
                                <th className="p-3 border border-gray-200 text-center">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {filteredProducts.map((prod) => (
                                <tr
                                    key={prod.id}
                                    className="hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="p-3 border border-gray-200">{prod.name}</td>
                                    <td className="p-3 border border-gray-200">{prod.price} ₺</td>
                                    <td className="p-3 border border-gray-200">{prod.stock}</td>
                                    <td className="p-3 border border-gray-200">
                                        {prod.category?.name || prod.categoryId}
                                    </td>
                                    <td className="p-3 border border-gray-200 text-center">
                                        {prod.isFeatured ? "✅" : "❌"}
                                    </td>
                                    <td className="p-3 border border-gray-200 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(prod)}
                                                className="bg-green-600 text-white border border-green-600 hover:bg-white hover:text-green-600 px-3 py-1 rounded text-xs"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prod.id)}
                                                className=" bg-red-600 hover:bg-white  text-white hover:text-red-600 px-3 py-1 rounded text-xs"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
