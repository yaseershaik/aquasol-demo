export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface PricingSummary {
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  totalAmount: number;
}

export function calculateOrderTotals(
  items: Array<{ price: number; quantity: number; gstPercent: number }>,
  siteConfig: { shippingFlatFee: number; freeShippingAbove: number }
): PricingSummary {
  let subtotal = 0;
  let gstAmount = 0;

  for (const item of items) {
    const lineTotal = item.price * item.quantity;
    const lineGst = (lineTotal * (item.gstPercent || 18)) / 100;
    subtotal += lineTotal;
    gstAmount += lineGst;
  }

  const shippingFee =
    subtotal === 0 || subtotal >= siteConfig.freeShippingAbove
      ? 0
      : siteConfig.shippingFlatFee;

  const totalAmount = subtotal + gstAmount + shippingFee;

  return {
    subtotal: Math.round(subtotal),
    gstAmount: Math.round(gstAmount),
    shippingFee: Math.round(shippingFee),
    totalAmount: Math.round(totalAmount),
  };
}
