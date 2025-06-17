/* eslint-disable padded-blocks */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../ui/login/Login.module.css";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Register successful",
        text: "You have successfully registered your account! Please log in to access your new account.",
        confirmButtonText: "Go to login",
      });     
      router.push("/account");
    } else {
      setError(data.message || "Registration failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}> Join our community</h1>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Register</button>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <Link href="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
