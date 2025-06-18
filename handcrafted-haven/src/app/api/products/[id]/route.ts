import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[3]; // or use params if using dynamic routes

  if (!productId) {
    return NextResponse.json({ message: "Missing product ID" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", productId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
