// 'product' prop should be passed to this component or function
interface Product {
  id: string;
  // diğer ürün özellikleri
}

// Eğer bu bir React component içindeyse, product'ı prop olarak alın
const handleAddToCart = async (product: Product) => {
  const userId = "abc123"; // Gerçek projede buraya giriş yapan kullanıcının ID’si gelecek
  const productId = product.id;

  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      productId,
      quantity: 1, // veya kullanıcı seçimine göre
    }),
  });

  const data = await res.json();
  console.log(data.message); // "Ürün sepete eklendi."
};
