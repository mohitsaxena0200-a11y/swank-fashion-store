const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { orderId, paymentId, signature } =
      JSON.parse(event.body || "{}");

    if (!orderId || !paymentId || !signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ verified: false, error: "Missing payment details" })
      };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return {
        statusCode: 503,
        body: JSON.stringify({ verified: false, error: "Payment setup incomplete" })
      };
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");

    const verified =
      a.length === b.length &&
      crypto.timingSafeEqual(a, b);

    return {
      statusCode: verified ? 200 : 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified })
    };
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ verified: false, error: "Invalid request" })
    };
  }
};
