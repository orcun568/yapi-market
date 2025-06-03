"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";

const statusOptions = ["Sipariş Alındı", "Kargoya Verildi", "Teslim Edildi", "İptal Edildi"];

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { data: session } = useSession();

    useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin-order");
        if (!res.ok) throw new Error("Siparişler alınamadı");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin-order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Durum güncellenemedi");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;

return (
    <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <AdminSidebar />
            </div>
            {/* Main Content */}
            <div className="flex-1 p-4 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-green-600">Tüm Siparişler</h1>

                {orders.length === 0 ? (
                    <p>Henüz sipariş yok.</p>
                ) : (
                    <>
                        {/* Masaüstü Görünüm */}
                        <div className="hidden md:flex w-full">
                            <div className="flex-1 overflow-x-auto rounded-md text-black">
                                <table className="min-w-full border border-green-600 shadow-lg rounded-lg overflow-hidden text-sm">
                                    <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white text-left">
                                        <tr>
                                            <th className="py-3 px-5">#</th>
                                            <th className="py-3 px-5">Sipariş ID</th>
                                            <th className="py-3 px-5">Kullanıcı</th>
                                            <th className="py-3 px-5">Toplam Tutar</th>
                                            <th className="py-3 px-5">Durum</th>
                                            <th className="py-3 px-5">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                                    Henüz sipariş yok.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order, index) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-green-50 transition-colors duration-200 border-t border-green-200"
                                                >
                                                    <td className="py-3 px-5">{index + 1}</td>
                                                    <td className="py-3 px-5 font-mono text-xs">{order.id}</td>
                                                    <td className="py-3 px-5">{order.user?.name || "Bilinmiyor"}</td>
                                                    <td className="py-3 px-5 font-semibold text-green-700">
                                                        {order.totalAmount.toFixed(2)} ₺
                                                    </td>
                                                    <td className="py-3 px-5">
                                                        <select
                                                            disabled={updatingId === order.id}
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            className={`border text-xs rounded px-2 py-1 w-full
                                                                ${
                                                                    order.status === "Sipariş Alındı"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : order.status === "Kargoya Verildi"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : order.status === "Teslim Edildi"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }
                                                            `}
                                                        >
                                                            {statusOptions.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-5">{new Date(order.createdAt).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobil Görünüm */}
                        <div className="md:hidden space-y-4">
                            {orders.map((order, index) => (
                                <div key={order.id} className="border rounded-md p-4 bg-white shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">#{index + 1}</div>
                                    <div className="text-xs font-mono break-all mb-1">
                                        <strong>ID:</strong> {order.id}
                                    </div>
                                    <div className="mb-1">
                                        <strong>Kullanıcı:</strong> {order.user?.name || "Bilinmiyor"}
                                    </div>
                                    <div className="mb-1">
                                        <strong>Tutar:</strong> {order.totalAmount.toFixed(2)} ₺
                                    </div>
                                    <div className="mb-1">
                                        <strong>Durum:</strong>{" "}
                                        <select
                                            disabled={updatingId === order.id}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
);
}
