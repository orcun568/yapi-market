// src/app/appointments/page.jsx

"use client";

import { useEffect, useState } from "react";
import SignOutButton from "../../../components/SignOutButton";
import Navbar from "../../../components/Navbar";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const res = await fetch("/api/appointment");
      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    }

    fetchAppointments();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

return (
    <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex">
            <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen">
                <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
                <nav className="flex flex-col space-y-4 flex-1">
                    <a href="/profile" className="text-gray-700 hover:text-green-600">Profilim</a>
                    <a href="/order-list" className="text-gray-700 hover:text-green-600">Siparişlerim</a>
                    <a href="/appointment-list" className="text-gray-700 hover:text-green-600">Randevularım</a>
                    <a href="/change-password" className="text-gray-700 hover:text-green-600">Şifre Yenileme</a>
                </nav>
                <SignOutButton />
            </aside>
            <div className="flex-1 p-6 text-black">
                <h1 className="text-2xl font-bold mb-4 text-green-600">Randevularım</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-green-600 shadow-lg rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white text-left">
                        <tr>
                        <th className="py-3 px-5">Ad Soyad</th>
                        <th className="py-3 px-5">E-posta</th>
                        <th className="py-3 px-5">Telefon</th>
                        <th className="py-3 px-5">Adres</th>
                        <th className="py-3 px-5">Alan Açıklaması</th>
                        <th className="py-3 px-5">Renk</th>
                        <th className="py-3 px-5">Tip</th>
                        <th className="py-3 px-5">Tarih</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center py-6 text-gray-500">
                            Henüz bir randevunuz bulunmamaktadır.
                            </td>
                        </tr>
                        ) : (
                        appointments.map((appt) => (
                            <tr
                            key={appt.id}
                            className="hover:bg-green-50 transition-colors duration-200 border-t border-green-200"
                            >
                            <td className="py-3 px-5">{appt.fullName}</td>
                            <td className="py-3 px-5">{appt.email}</td>
                            <td className="py-3 px-5">{appt.phoneNumber}</td>
                            <td className="py-3 px-5">{appt.address}</td>
                            <td className="py-3 px-5">{appt.paintAreaDescription}</td>
                            <td className="py-3 px-5">{appt.paintColor?.name || "-"}</td>
                            <td className="py-3 px-5">{appt.paintType}</td>
                            <td className="py-3 px-5">
                                {new Date(appt.appointmentDate).toLocaleDateString()}
                            </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
);
}
