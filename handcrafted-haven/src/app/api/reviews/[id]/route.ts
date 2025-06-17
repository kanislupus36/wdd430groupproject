import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[3];

  try {
    const result = await query(
      "SELECT r.review_id, r.rating, r.comment, u.username FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = $1",
      [productId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
