"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Products.module.css";

interface Product {
  product_id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

interface ProductsWrapperProps {
  user_id: number;
}

export default function ProductsWrapper({ user_id }: ProductsWrapperProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const allProducts: Product[] = await res.json();
        const userProducts = allProducts.filter(
          (product) => product.user_id === user_id
        );
        setProducts(userProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUserProducts();
  }, [user_id]);

  const handleDelete = async (product_id: number) => {
    try {
      const res = await fetch(`/api/products/${product_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== product_id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className={styles.gallery}>
      {products.length === 0 ? (
        <p className={styles.noProducts}>You have no published products.</p>
      ) : (
        products.map((product) => (
          <div key={product.product_id} className={styles.card}>
            <Image
              src={product.images[0]}
              alt={product.description}
              width={200}
              height={400}
              className={styles.image}
            />
            <h2 className={styles.title}>{product.title}</h2>
            <button
              className={styles.button}
              onClick={() => handleDelete(product.product_id)}
            >
              Delete Product
            </button>
          </div>
        ))
      )}
    </div>
  );
}
