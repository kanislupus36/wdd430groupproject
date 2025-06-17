"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../ui/products-page/ProductsPage.module.css";

interface Product {
  product_id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`/api/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories from products
        const uniqueCategories = [
          ...new Set(productsData.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // 🔍 **Filter products based on user selections**
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPrice, products]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Product Listings</h1>

      {/* 🔹 Filter Section */}
      <div className={styles.filters}>
        {/* Category Filter */}
        <label>Category:</label>
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <label>Price:</label>
        <select onChange={(e) => setSelectedPrice(e.target.value)}>
          <option value="">All</option>
          <option value="0-50">Under $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-500">$100 - $500</option>
          <option value="500-1000">$500 - $1000</option>
          <option value="1000-9999">Over $1000</option>
        </select>
      </div>

      {/* 🔹 Product List */}
      <ul className={styles.productList}>
        {filteredProducts.map((product) => (
          <li key={product.product_id} className={styles.productItem}>
            <h2>{product.title}</h2>
            {/* <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p> */}
            <div>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${product.product_id} image`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <Link href={`/products/${product.product_id}`}>
              <button className={styles.button}>View Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
