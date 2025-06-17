/* eslint-disable */
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export async function GET() {
  try {
    const result = await query("SELECT * FROM products");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { user_id, 
    title, 
    price, 
    category, 
    description,
    images } = await request.json();
  
  if (!user_id || !title || !price || !category || !description || !images) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const sql = "INSERT INTO products (user_id, title, price, category, description, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
  
  try {
    const result = await pool.query(sql,
      [user_id, title, price, category, description, images]
    );
    
    if (!result){
      throw new Error ("Unable to add product")
    }
    return NextResponse.json({ message: "Product Added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding Product" }, { status: 500 });
  }
}
