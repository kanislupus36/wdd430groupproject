import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Update the order status to 'cancelled'
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("order_id", order_id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No matching record found
        return NextResponse.json(
          { error: "Unable to cancel order - No matching record found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Order Cancelled", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error cancelling order: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
