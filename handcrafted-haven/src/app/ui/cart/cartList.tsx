"use client";

import { useEffect, useState } from "react";
import styles from "./CartList.module.css";

interface cartItem {
  product_id: string;
  qty: number;
}

interface Product {
  product_id: string;
  title: string;
  description: string;
  price: string;
  category: string;
}

export default function CartList({
  onCartUpdate,
}: {
  onCartUpdate: () => void;
}) {
  const [cartList, setCartList] = useState<cartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const cart: cartItem[] = JSON.parse(
      localStorage.getItem("haven-cart") || "[]"
    );
    setCartList(cart);

    const fetchProducts = async () => {
      const productPromises = cart.map(async (item) => {
        const res = await fetch(`/api/products/${item.product_id}`);
        const data = await res.json();
        return data;
      });
      const results = await Promise.all(productPromises);
      setProducts(results);
    };

    fetchProducts();
  }, []);

  const handleDelete = (product_id: string) => {
    const updatedCart = cartList.filter(
      (item) => item.product_id !== product_id
    );
    setCartList(updatedCart);
    setProducts(products.filter((p) => p.product_id !== product_id));
    localStorage.setItem("haven-cart", JSON.stringify(updatedCart));
    onCartUpdate();
  };

  return (
    <ul className={styles.cartList}>
      {products.map((product) => {
        const cartItem = cartList.find(
          (item) => item.product_id === product.product_id
        );
        const qty = cartItem ? cartItem.qty : 0;

        return (
          <li key={product.product_id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: {qty}</p>
            <button onClick={() => handleDelete(product.product_id)}>
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
