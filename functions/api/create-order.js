
const PRODUCTS = {
  "swk-001": 1299,
  "swk-002": 1899,
  "swk-003": 1599,
  "swk-004": 2199
};

export async function onRequestPost({ request, env }) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return json({ error: "Payment setup incomplete" }, 503);
  }

  try {
    const { productId } = await request.json();
    const price = PRODUCTS[productId];

    if (!price) {
      return json({ error: "Invalid product" }, 400);
    }

    const credentials = btoa(
      `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`
    );

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: price * 100,
        currency: "INR",
        receipt: `swank_${Date.now()}`
      })
    });

    const order = await response.json();

    if (!response.ok) {
  return json({
    error: "Could not create payment order",
    details: order.error?.description || order.error?.reason || "Razorpay API request failed"
  }, 502);
}

    return json({
      keyId: env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
}
