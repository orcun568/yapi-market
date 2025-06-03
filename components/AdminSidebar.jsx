import React from "react";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

const AdminSidebar = () => (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen">
        <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
        <nav className="flex flex-col space-y-4 flex-1">
            <Link href="/adminpanel" className="text-gray-700 hover:text-green-600">Kullanıcı Yönetimi</Link>
            <Link href="/categories" className="text-gray-700 hover:text-green-600">Kategori İşlemleri</Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600">Ürün İşlemleri</Link>
            <Link href="/paint-colors" className="text-gray-700 hover:text-green-600">Boya Renk İşlemleri</Link>
            <Link href="/all-order" className="text-gray-700 hover:text-green-600">Siparişler</Link>
            <Link href="/all-appointment" className="text-gray-700 hover:text-green-600">Randevular</Link>
            <Link href="/slider" className="text-gray-700 hover:text-green-600">Slider Ayarları</Link>
            <Link href="/admin/hakkimizda" className="text-gray-700 hover:text-green-600">Hakkında Ayarları</Link>
        </nav>
        <SignOutButton />
    </aside>
);

export default AdminSidebar;