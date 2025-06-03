"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "admin") {
        router.push("/adminpanel");
      } else {
        router.push("/");
      }
    } else {
      setError("Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl w-full py-18 px-12 border border-green-600 rounded-lg bg-white flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8 text-green-600 text-center">Giriş Yap</h1>
        {error && <p className="text-green-600 mb-4 text-lg text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-green-600 p-4 rounded text-green-600 placeholder-green-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full border border-green-600 p-4 rounded text-green-600 placeholder-green-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="border border-green-600 bg-green-600 text-white px-6 py-3 rounded w-full font-semibold text-lg transition-colors duration-200 hover:bg-white hover:text-green-600"
            type="submit"
          >
            Giriş Yap
          </button>
        </form>
        <div className="mt-8 text-center w-full">
          <span className="text-green-600 text-lg">Hesabınız yok mu? </span>
          <a
            href="/register"
            className="text-green-600 hover:underline font-semibold text-lg"
          >
            Kayıt Ol
          </a>
        </div>
      </div>
    </div>
  );
}