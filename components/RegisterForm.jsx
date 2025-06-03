"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl w-full py-18 px-12 border border-green-600 rounded-lg bg-white flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Kayıt Ol</h1>
        {error && <p className="text-green-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            name="name"
            type="text"
            placeholder="İsim"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-green-600 px-4 py-4 rounded text-green-600 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-green-600 px-4 py-4 rounded text-green-600 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-green-600 px-4 py-4 rounded text-green-600 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600  border-green-600 text-white py-3 rounded hover:bg-white hover:text-green-600 hover:border-2 duration-200"
          >
            Kayıt Ol
          </button>
          <div className="mt-8 text-center w-full">
          <span className="text-green-600 text-lg">Zaten hesabınız var mı? </span>
          <a
            href="/login"
            className="text-green-600 hover:underline font-semibold text-lg"
          >
            Giriş Yap
          </a>
          </div>
        </form>
      </div>
    </div>
  );
}
