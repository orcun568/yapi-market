import React, { Suspense } from "react";

const PaymentClient = React.lazy(() => import("./PaymentClient"));

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PaymentClient />
    </Suspense>
  );
}
