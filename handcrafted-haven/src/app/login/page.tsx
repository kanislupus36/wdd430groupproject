/* eslint-disable */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../ui/login/Login.module.css";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Login successful",
        text: "You have successfully logged in!",
        timer: 2000,
        showConfirmButton: false,
      });

      localStorage.setItem("isLogged", "true");
      localStorage.setItem("userMail", email);
      window.location.href = "/account";
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Welcome back!</h1>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="test@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="test01"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Log In</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Dont have an account? <Link href="/register">Create Account</Link>
        </p>
      </form>
    </div>
  );
}
