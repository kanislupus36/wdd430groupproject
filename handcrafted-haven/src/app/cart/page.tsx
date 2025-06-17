"use client";

import CartList from "@/app/ui/cart/cartList";
import { calculateCartTotal } from "../ui/cart/actions";
import { useRouter } from "next/navigation";
import Loading from "../ui/products-page/loading";
import { useEffect, useState } from "react";
import styles from "../ui/cart/CartList.module.css";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  console.log(email);

  const fetchTotal = async () => {
    const total = await calculateCartTotal();
    setTotal(total);
  };

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    const storedEmail = localStorage.getItem("userMail");

    if (!storedIsLogged || !storedEmail) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "You need to log in to access your cart.",
      });
      router.push("/login");
      return;
    }

    setIsLogged(true);
    setEmail(storedEmail);
    setIsClient(true);

    fetchTotal();
  }, [router]);

  const deleteList = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete all items in your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      localStorage.setItem("haven-cart", JSON.stringify([]));
      setTotal(0);
      Swal.fire("Deleted!", "Your cart has been emptied.", "success");
    }
  };

  const confirmPurchase = async () => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will create a ticket in the database to process your purchase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm purchase!",
    });

    if (result.isConfirmed && email) {
      const cart = JSON.parse(localStorage.getItem("haven-cart") || "[]");

      console.log(cart);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, cart }),
      });

      if (res.ok) {
        localStorage.setItem("haven-cart", JSON.stringify([]));
        setTotal(0);
        Swal.fire(
          "Done!",
          "Your purchase has been created. Please check your email for the next steps!",
          "success"
        );
      } else {
        const data = await res.json();
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    }
  };

  if (!isClient || !isLogged) return <Loading />;

  if (total === 0) {
    return (
      <div className={styles.wrapper}>
        <h1>Your cart is empty</h1>
        <img
          src="/images/empty-cart.png"
          alt="Empty Cart"
          className={styles.emptyCartImage}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1>My Cart</h1>
      <CartList onCartUpdate={fetchTotal} />
      <div>
        <h3 className={styles.cartTotal}>Total: ${total.toFixed(2)}</h3>
        <div className={styles.buttonsContainer}>
          <button onClick={deleteList}>Delete List</button>
          <button onClick={confirmPurchase}>Confirm Purchase</button>
        </div>
      </div>
    </div>
  );
}
