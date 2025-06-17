import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    const sql = "UPDATE orders SET status = 'cancelled' WHERE order_id = $1 RETURNING *";
    const result = await pool.query(sql, [order_id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Unable to cancel order - No matching record found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order Cancelled", data: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error cancelling order: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}