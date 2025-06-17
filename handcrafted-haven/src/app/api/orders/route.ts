/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

type CartItem = {
  product_id: number;
  title: string;
  price: string;
  qty: number;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const buyer_id = searchParams.get("buyer_id");

  if (!buyer_id) {
    return NextResponse.json(
      { error: "buyer_id is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM orders WHERE buyer_id = $1",
      [buyer_id]
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, cart }: { email: string; cart: CartItem[] } =
      await req.json();

    const buyerRes = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    if (buyerRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const buyer_id = buyerRes.rows[0].user_id;

    const productIds = cart.map((item) => item.product_id);
    const placeholders = productIds.map((_, i) => `$${i + 1}`).join(", ");
    const productRes = await pool.query(
      `SELECT product_id, user_id AS seller_id FROM products WHERE product_id IN (${placeholders})`,
      productIds
    );

    const productSellerMap: Record<number, number> = {};
    productRes.rows.forEach((row) => {
      productSellerMap[row.product_id] = row.seller_id;
    });

    const sellerOrders: Record<number, any[]> = {};

    cart.forEach((item: any) => {
      const seller_id = productSellerMap[item.product_id];
      if (!seller_id) return;

      if (!sellerOrders[seller_id]) {
        sellerOrders[seller_id] = [];
      }
      sellerOrders[seller_id].push(item);
    });

    const createdOrders = [];

    for (const seller_id in sellerOrders) {
      const items = sellerOrders[seller_id];
      const total = items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.qty,
        0
      );

      const orderRes = await pool.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [buyer_id, seller_id, total, "pending"]
      );

      createdOrders.push(orderRes.rows[0]);
    }

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
