
export async function onRequestPost({ request, env }) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });

  if (!env.RAZORPAY_KEY_SECRET) {
    return json({ verified: false, error: "Payment setup incomplete" }, 503);
  }

  try {
    const body = await request.json();

    const orderId = body.orderId || body.razorpay_order_id;
    const paymentId = body.paymentId || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return json({ verified: false, error: "Missing payment details" }, 400);
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signed = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(`${orderId}|${paymentId}`)
    );

    const expected = Array.from(new Uint8Array(signed))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");

    const validFormat = /^[a-f0-9]{64}$/i.test(signature);
    let difference = expected.length ^ signature.length;

    if (validFormat && expected.length === signature.length) {
      for (let i = 0; i < expected.length; i++) {
        difference |= expected.charCodeAt(i) ^ signature.toLowerCase().charCodeAt(i);
      }
    } else {
      difference |= 1;
    }

    const verified = difference === 0;

    return json(
      { verified, ...(verified ? { orderId } : {}) },
      verified ? 200 : 400
    );
  } catch {
    return json({ verified: false, error: "Invalid request" }, 400);
  }
}
