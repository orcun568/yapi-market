// app/products/[id]/page.jsx (Server Component)
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Navbar from "../../../../components/Navbar";
import AddToCartButton from "./AddToCartButton";

const prisma = new PrismaClient();


export default async function ProductDetail({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });

  if (!product) return notFound();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="w-full py-10 px-4">
        <div className="flex flex-col md:flex-row items-start gap-8 w-full">

          <div className="relative w-full md:w-1/2 h-100 mb-6 md:mb-0">
            <img
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-contain border rounded"
            />
            {product.stock === 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                Tükendi
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col h-full">
            <h1 className="text-3xl font-bold mb-5 text-green-600">{product.name}</h1>
            <p className="font-semibold mb-5 text-green-600">
              Kategori: {product.category?.name}
            </p>
            
            <div className="h-38">
              <p
                className="text-gray-600 mb-4"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </p>
            </div>
            <p className="text-xl font-semibold text-green-600 mt-5">
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
            <div className="flex-grow"></div>
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
