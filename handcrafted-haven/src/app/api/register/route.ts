import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Supabase client using service role key for insert operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { username, email, password, role } = await request.json();

  if (!username || !email || !password || !role) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Supabase DB
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          password: hashedPassword,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      const msg =
        error.code === "23505"
          ? "Email or username already exists"
          : "Error creating user";

      console.error("Supabase insert error:", error);
      return NextResponse.json({ message: msg }, { status: 500 });
    }

    return NextResponse.json({ message: "User created", user: data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
