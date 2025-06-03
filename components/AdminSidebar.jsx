import React from "react";
import SignOutButton from "./SignOutButton";

const AdminSidebar = () => (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen">
        <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
        <nav className="flex flex-col space-y-4 flex-1">
            <a href="/adminpanel" className="text-gray-700 hover:text-green-600">Kullanıcı Yönetimi</a>
            <a href="/categories" className="text-gray-700 hover:text-green-600"> Kategori İşlemleri</a>
            <a href="/products" className="text-gray-700 hover:text-green-600">Ürün İşlemleri</a>
            <a href="/paint-colors" className="text-gray-700 hover:text-green-600">Boya Renk İşlemleri</a>
            <a href="/all-order" className="text-gray-700 hover:text-green-600">Siparişler</a>
            <a href="/all-appointment" className="text-gray-700 hover:text-green-600">Randevular</a>
            <a href="/slider" className="text-gray-700 hover:text-green-600">Slider Ayarları</a>
            <a href="/admin/hakkimizda" className="text-gray-700 hover:text-green-600">Hakkında Ayarları</a>
        </nav>
        <SignOutButton />
    </aside>
);

export default AdminSidebar;