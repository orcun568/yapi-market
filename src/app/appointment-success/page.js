import Navbar from "../../../components/Navbar";
import Link from "next/link";

export default function OrderSuccess() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                    <svg
                        className="w-16 h-16 text-green-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4"
                        />
                    </svg>
                    <h1 className="text-2xl font-bold text-green-600 mb-2">Randevunuz Başarıyla Alındı!</h1>
                    <p className="text-gray-700 mb-6 text-center">
                        Teşekkür ederiz. Randevunuz başarıyla oluşturuldu.
                    </p>
                    <Link href="/">Anasayfa</Link>
                </div>
            </div>
        
        </div>
    );
}