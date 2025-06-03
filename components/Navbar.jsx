'use client';
import { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react'; // İkonlar için lucide-react kullanıyoruz.

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
                <a href="/" className="hover:no-underline">Ana Sayfa</a>
                <a href="/store" className="hover:no-underline">Satış</a>
                <a href="/appointment" className="hover:no-underline">Boya Randevu</a>
                <a href="/about" className="hover:no-underline">Hakkımızda</a>
              </div>

                
          <div className="flex space-x-4">
            <a href="/basket" className="flex items-center">
              <ShoppingCart className="h-6 w-6" />
            </a>
            <a href="/login" className="flex items-center">
              <User className="h-6 w-6" />
            </a>
          </div>
        </div>
      </nav>

 
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <a href="/" className="text-white hover:underline">Ana Sayfa</a>
            <a href="/sales" className="text-white hover:underline">Satış</a>
            <a href="/contact" className="text-white hover:underline">İletişim</a>
            <a href="/about" className="text-white hover:underline">Hakkımızda</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
