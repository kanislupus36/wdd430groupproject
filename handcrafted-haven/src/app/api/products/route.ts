import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase server client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch all products
export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(request: Request) {
  const { user_id, title, price, category, description, images } =
    await request.json();

  // Validate input
  if (!user_id || !title || !price || !category || !description || !images) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          user_id,
          title,
          price,
          category,
          description,
          images,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ message: "Error adding Product" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Product Added", product: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Error adding Product" }, { status: 500 });
  }
}
