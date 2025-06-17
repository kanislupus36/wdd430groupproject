import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[3];

  try {
    const result = await query("SELECT * FROM users WHERE user_id = $1", [
      productId,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
