import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CartItem = {
  product_id: number;
  title: string;
  price: string;
  qty: number;
};

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const buyer_id = searchParams.get("buyer_id");

  if (!buyer_id) {
    return NextResponse.json(
      { error: "buyer_id is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("buyer_id", buyer_id);

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, cart }: { email: string; cart: CartItem[] } = await req.json();

    // Get buyer_id by email
    const { data: buyer, error: buyerError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email)
      .single();

    if (buyerError) {
      if (buyerError.code === "PGRST116") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw buyerError;
    }
    const buyer_id = buyer.user_id;

    // Get seller_id for each product in the cart
    const productIds = cart.map((item) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("product_id, user_id")
      .in("product_id", productIds);

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Map product_id to seller_id
    const productSellerMap: Record<number, number> = {};
    products.forEach((product) => {
      productSellerMap[product.product_id] = product.user_id;
    });

    // Group cart items by seller_id
    const sellerOrders: Record<number, CartItem[]> = {};
    cart.forEach((item) => {
      const seller_id = productSellerMap[item.product_id];
      if (!seller_id) return; // skip if seller_id not found

      if (!sellerOrders[seller_id]) {
        sellerOrders[seller_id] = [];
      }
      sellerOrders[seller_id].push(item);
    });

    // Create orders for each seller
    const createdOrders = [];

    for (const seller_id_str in sellerOrders) {
      const seller_id = parseInt(seller_id_str);
      const items = sellerOrders[seller_id];
      const total = items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.qty,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id,
          seller_id,
          total_amount: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }

      createdOrders.push(order);
    }

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
