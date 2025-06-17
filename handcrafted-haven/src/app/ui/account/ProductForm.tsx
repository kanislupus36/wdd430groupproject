/*eslint-disable */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.css";

interface AddProductFormProps {
  user_id: number;
}

export default function AddProductForm({ user_id }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    images: [] as string[],
    category: "",
    description: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, e.currentTarget.value.trim()],
      }));
      e.currentTarget.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const productData = {
      ...formData,
      user_id,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add product");
      }

      router.push("/account");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <h2>Add a Product</h2>

      <label>
        Product Name:
        <input onChange={handleChange} name="title" type="text" required />
      </label>

      <label>
        Price:
        <input onChange={handleChange} name="price" type="number" required />
      </label>

      <label>
        Image URL:
        <input name="image" type="url" onKeyUp={handleImageInput} />
      </label>
      <ul>
        {formData.images.map((image, index) => (
          <li key={index}>{image}</li>
        ))}
      </ul>

      <label>
        Category:
        <select onChange={handleChange} name="category" required>
          <option value="">Choose a Category</option>
          <option value="Art">Artwork</option>
          <option value="Furniture">Furniture</option>
          <option value="Ceramics">Ceramics</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Textiles">Textiles</option>
        </select>
      </label>

      <label>
        Description:
        <input
          onChange={handleChange}
          name="description"
          type="textarea"
          required
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Add Product</button>
    </form>
  );
}
