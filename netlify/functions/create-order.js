const Razorpay = require("razorpay");

const products = {
  "swk-001": 1299,
  "swk-002": 1899,
  "swk-003": 1599,
  "swk-004": 2199
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  if (!process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "Payment setup incomplete" })
    };
  }

  try {
    const { productId } = JSON.parse(event.body || "{}");
    const price = products[productId];

    if (!price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid product" })
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
      receipt: `swank_${Date.now()}`
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create order" })
    };
  }
};
