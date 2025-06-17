import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM reviews");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { product_id, user_id, rating, comment } = await req.json();

  if (!product_id || !user_id || !rating || !comment) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const insertQuery = `
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await query(insertQuery, [
      product_id,
      user_id,
      rating,
      comment,
    ]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting review:", error);
    return NextResponse.json(
      { error: "Failed to insert review" },
      { status: 500 }
    );
  }
}
