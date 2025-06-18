import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json(
        { message: "Unable to Delete Product - Missing product_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", product_id)
      .select()
      .single(); // get the deleted row

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { message: "Unable to Delete Product - No matching record found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Product Removed", data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting Product: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
