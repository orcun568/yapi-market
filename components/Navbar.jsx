'use client';
import { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-green-600 text-white">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          <div className="text-xl font-bold">IŞIK YAPI</div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              ☰
            </button>
          </div>

          <div className={`hidden md:flex space-x-6`}>
            <Link href="/" className="hover:no-underline">Ana Sayfa</Link>
            <Link href="/store" className="hover:no-underline">Satış</Link>
            <Link href="/appointment" className="hover:no-underline">Boya Randevu</Link>
            <Link href="/about" className="hover:no-underline">Hakkımızda</Link>
          </div>

          <div className="flex space-x-4">
            <Link href="/basket" className="flex items-center">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/login" className="flex items-center">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <Link href="/" className="text-white hover:underline">Ana Sayfa</Link>
            <Link href="/sales" className="text-white hover:underline">Satış</Link>
            <Link href="/contact" className="text-white hover:underline">İletişim</Link>
            <Link href="/about" className="text-white hover:underline">Hakkımızda</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
