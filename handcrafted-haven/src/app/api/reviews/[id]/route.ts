import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase server client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[3];

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("review_id, rating, comment, users(username)")
      .eq("product_id", productId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
