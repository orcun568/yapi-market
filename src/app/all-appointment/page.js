"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { data: session } = useSession();

    useEffect(() => {
    if (session && session.user.role !== "admin") {
      redirect("/");
    }
  }, [session]);
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/admin-appointment");
        if (!res.ok) throw new Error("Randevular alınamadı");
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    if (!confirm("Randevuyu silmek istediğine emin misin?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin-appointment/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silme işlemi başarısız oldu");

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      alert(error.message);
    } finally {
      setDeletingId(null);
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
        <div className="flex-1 p-4 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green-600">Randevu Listesi</h1>

          {appointments.length === 0 ? (
            <p>Henüz randevu yok.</p>
          ) : (
            <>
            {/* Masaüstü Görünüm */}
            <div className="hidden md:flex w-full">
                <div className="flex-1 overflow-x-auto rounded-md text-black">
                    <table className="min-w-full border border-green-600 shadow-lg rounded-lg overflow-hidden text-sm">
                        <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white text-left">
                            <tr>
                                <th className="py-3 px-5">İsim</th>
                                <th className="py-3 px-5">Email</th>
                                <th className="py-3 px-5">Telefon</th>
                                <th className="py-3 px-5">Adres</th>
                                <th className="py-3 px-5">Boyanacak Alan</th>
                                <th className="py-3 px-5">Renk</th>
                                <th className="py-3 px-5">Tarih</th>
                                <th className="py-3 px-5">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a) => (
                                <tr
                                    key={a.id}
                                    className={`border-t border-green-200 hover:bg-green-50 transition-colors duration-200 ${
                                        deletingId === a.id ? "opacity-50" : ""
                                    }`}
                                >
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.fullName}>
                                            {a.fullName}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.email}>
                                            {a.email}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.phoneNumber}>
                                            {a.phoneNumber}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.address}>
                                            {a.address}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.paintAreaDescription}>
                                            {a.paintAreaDescription}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={a.paintColor?.name || "-"}>
                                            {a.paintColor?.name || "-"}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 max-w-xs">
                                        <div className="truncate" title={new Date(a.appointmentDate).toLocaleString()}>
                                            {new Date(a.appointmentDate).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 flex flex-col gap-2">
                                        <button
                                            disabled={deletingId === a.id}
                                            onClick={() => deleteAppointment(a.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed mb-1"
                                        >
                                            İptal Et
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobil Görünüm */}
              <div className="md:hidden space-y-4">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className={`border rounded-md p-4 bg-white shadow-sm ${
                      deletingId === a.id ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <strong>İsim:</strong> {a.fullName}
                    </div>
                    <div>
                      <strong>Email:</strong> {a.email}
                    </div>
                    <div>
                      <strong>Telefon:</strong> {a.phoneNumber}
                    </div>
                    <div>
                      <strong>Adres:</strong> {a.address}
                    </div>
                    <div>
                      <strong>Boyanacak Alan:</strong> {a.paintAreaDescription}
                    </div>
                    <div>
                      <strong>Renk:</strong> {a.paintColor?.name || "-"}
                    </div>
                    <div>
                      <strong>Tarih:</strong> {new Date(a.appointmentDate).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <button
                        disabled={deletingId === a.id}
                        onClick={() => deleteAppointment(a.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sil
                      </button>
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
