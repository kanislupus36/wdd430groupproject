/* eslint-disable padded-blocks */
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = decodeURIComponent(url.pathname.split("/").pop() || "");
  console.log("email", email);
  console.log("url", url.pathname.split("/").pop() || "");

  if (!email) {
    return NextResponse.json({ error: "email not found" }, { status: 400 });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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
    const result = await pool.query(
      "DELETE FROM users WHERE email = $1 RETURNING *",
      [email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
