/* eslint-disable */
import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  const { username, email, password, role } = await request.json();

  if (!username || !email || !password || !role) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
    );

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err: any) {
    const msg =
      err.code === "23505"
        ? "Email or username already exists"
        : "Error creating user";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
