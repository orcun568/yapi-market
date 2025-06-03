"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import SignOutButton from "../../../components/SignOutButton";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(session?.user?.phoneNumber || "");

  // Telefon güncelleme için ek state'ler
  const [editPhone, setEditPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(session?.user?.phoneNumber || "");
  const router = useRouter();
 
 
  useEffect(() => {
    if (status === "loading") return; 

    if (session?.user?.role === "admin") {
      router.push("/adminpanel");
    }
  }, [session, status, router]);

  const handlePhoneUpdate = async () => {
  setLoading(true);
  const res = await fetch("/api/user/update-phone", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber: phoneInput }),
  });

  if (res.ok) {
  const userRes = await fetch("/api/user/me");
  if (userRes.ok) {
    const updatedUser = await userRes.json();
    setPhone(updatedUser.phoneNumber || "");
    setPhoneInput(updatedUser.phoneNumber || "");
    
    // Session'ı güncelle
    await update({
      phoneNumber: updatedUser.phoneNumber,
    });
    
  }
  setEditPhone(false);
  alert("Telefon numarası güncellendi");
  window.location.reload();
}

  setLoading(false);
};




  // Form durumu
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    label: "",
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    openAddress: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!session) return;

    async function fetchAddresses() {
      setLoading(true);
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
      setLoading(false);
    }

    fetchAddresses();
  }, [session]);

  if (status === "loading") return <div>Yükleniyor...</div>;
  if (!session) return <div>Lütfen giriş yapın</div>;

  
  if (status === "loading" || session?.user?.role === "admin") {
    return <div className="bg-white min-h-screen"></div>
  }
  if (!session) return <div>Lütfen giriş yapın</div>;


  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.id ? "PUT" : "POST";
    const url = "/api/addresses";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedAddress = await res.json();
      if (method === "POST") {
        setAddresses((prev) => [updatedAddress, ...prev]);
      } else {
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
        );
      }
      setShowForm(false);
      setFormData({
        id: "",
        label: "",
        fullName: "",
        phoneNumber: "",
        city: "",
        district: "",
        openAddress: "",
        postalCode: "",
      });
    } else {
      alert("Adres kaydı sırasında hata oluştu.");
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      id: "",
      label: "",
      fullName: "",
      phoneNumber: "",
      city: "",
      district: "",
      openAddress: "",
      postalCode: "",
    });
  };

  const handleDelete = async (id) => {
  if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

  const res = await fetch(`/api/addresses?id=${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  } else {
    alert("Adres silme sırasında hata oluştu.");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen">
          <h2 className="text-xl font-bold mb-6 text-green-600">Menü</h2>
          <nav className="flex flex-col space-y-4 flex-1">
            <a href="/profile" className="text-gray-700 hover:text-green-600">Profilim</a>
            <a href="/order-list" className="text-gray-700 hover:text-green-600">Siparişlerim</a>
            <a href="/appointment-listnpm" className="text-gray-700 hover:text-green-600">Randevularım</a>
            <a href="/change-password" className="text-gray-700 hover:text-green-600">Şifre Yenileme</a>
          </nav>
          <SignOutButton />
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-green-600">Profil Bilgileri</h1>
          <div className="bg-white p-6 rounded-lg shadow space-y-4 mb-10">
            <div className="text-black"><strong className="text-green-600">Ad Soyad:</strong> {session?.user?.name || "-"}</div>
            <div className="text-black"><strong className="text-green-600">E-posta:</strong> {session?.user?.email || "-"}</div>
            <div className="text-black">
                  <strong className="text-green-600">Telefon:</strong>{" "}
                  {editPhone ? (
                    <div>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button onClick={handlePhoneUpdate} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-white hover:text-green-600 border border-green-600 transition duration-300 ml-2">
                        Kaydet
                      </button>
                      <button onClick={() => setEditPhone(false)} className="text-red-600 ml-2 hover:text-red-800">
                        İptal
                      </button>
                      
                    </div>
                    
                  ) : (
                    <span>
                      {session.user.phoneNumber || "Belirtilmemiş"}{" "}
                      <button onClick={() => setEditPhone(true)} className="text-sm bg-white text-gren-600 border border-green-600 ml-2 hover:bg-green-600 hover:text-white px-2 py-1 rounded">
                        Güncelle
                      </button>
                    </span>
                  )}
                </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-green-600 flex justify-between items-center">
            Adresler
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-white hover:text-green-600 border border-green-600 transition duration-300"
            >
              Adres Ekle
            </button>
          </h2>

          {loading ? (
            <p className="text-green-600">Adresler yükleniyor...</p>
          ) : addresses.length === 0 ? (
            <p className="text-green-600">Adres bulunamadı.</p>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border-b last:border-none pb-4 flex justify-between items-start"
                >
                  <div>
                    <p className="text-green-600"><strong>{address.label || "Adres"}</strong></p>
                    <p className="text-black">{address.fullName}</p>
                    <p className="text-black">{address.phoneNumber || "-"}</p>
                    <p className="text-black">{address.city} / {address.district}</p>
                    <p className="text-black">{address.openAddress}</p>
                    <p className="text-black">{address.postalCode || "-"}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-green-600 "
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 ml-2"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Adres Ekle/Güncelle Formu */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow max-w-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                {formData.id ? "Adres Güncelle" : "Yeni Adres Ekle"}
              </h3>

              <label className="block mb-2 text-green-600 ">
                Etiket (ör: Ev, İş)
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block mb-2 text-green-600">
                Ad Soyad *
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block mb-2 text-green-600">
                Telefon
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block mb-2 text-green-600">
                Şehir *
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block mb-2 text-green-600">
                İlçe *
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block mb-2  text-green-600">
                Açık Adres *
                <textarea
                  name="openAddress"
                  required
                  value={formData.openAddress}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </label>

              <label className="block mb-4 text-green-600">
                Posta Kodu
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-white hover:text-green-600 border border-green-600 transition duration-300"
                >
                  {formData.id ? "Güncelle" : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white text-green-600 border border-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition duration-300"
                >
                  İptal
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
