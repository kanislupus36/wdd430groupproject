import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json(
        { message: "Unable to Delete Product - Missing product_id" },
        { status: 400 }
      );
    }

    const sql = "DELETE FROM products WHERE product_id = $1 RETURNING *";

    const result = await pool.query(sql, [product_id]);

    if (result.rows.length === 0) {
      throw new Error("Unable to Delete Product - No matching record found");
    }

    return NextResponse.json(
      { message: "Product Removed", data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting Product: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}