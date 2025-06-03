// components/CartSummary.tsx
"use client";

// Remove TypeScript types for .jsx compatibility

export default function CartSummary({ cartItems }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sepetiniz</h2>
      {cartItems.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {item.product.price}₺
                </p>
              </div>
              <p className="font-semibold">
                {item.quantity * item.product.price}₺
              </p>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Toplam:</span>
            <span>{total}₺</span>
          </div>
        </div>
      )}
    </div>
  );
}
