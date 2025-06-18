import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!; // use service role key for server

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = decodeURIComponent(url.pathname.split("/").pop() || "");

  if (!email) {
    return NextResponse.json({ error: "email not found" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json({ error: "user not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const email = decodeURIComponent(url.pathname.split("/").pop() || "");

  if (!email) {
    return NextResponse.json({ error: "email not found" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("email", email)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "user not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "user deleted successfully", user: data });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
