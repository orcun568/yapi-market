import Navbar from '../../../components/Navbar';
import prisma from '@/lib/prisma';

export default async function Hakkimizda() {
  const content = await prisma.content.findFirst();

  const data = content || {
    hakkimizda: "",
    telefon: "",
    email: "",
    calismaSaatleri: "",
    konumAdres: "",
    haritaUrl: ""
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <section className="max-w-4xl mx-auto p-6 space-y-12 font-sans">

        {/* Hakkımızda */}
        <div id="hakkimizda" className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Hakkımızda</h2>
          <p className="text-gray-700 leading-relaxed">{data.hakkimizda}</p>
        </div>

        {/* İletişim */}
        <div id="iletisim" className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-3xl font-bold text-green-600 mb-4">İletişim</h2>
          <ul className="text-gray-700 space-y-2">
            <li><span className="font-semibold text-green-600">Telefon:</span> {data.telefon}</li>
            <li><span className="font-semibold text-green-600">E-posta:</span> {data.email}</li>
            <li><span className="font-semibold text-green-600">Çalışma Saatleri:</span> {data.calismaSaatleri}</li>
          </ul>
        </div>

        {/* Konum */}
        <div id="konum" className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Konum</h2>
          <p className="text-gray-700 mb-4">{data.konumAdres}</p>
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
            <iframe
              className="w-full h-full"
              src={data.haritaUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Firma Konumu"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
