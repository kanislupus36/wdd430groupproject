"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/ui/products-page/loading";
import ProductsWrapper from "@/app/ui/account/products";
import AddProductForm from "@/app/ui/account/ProductForm";
import OrdersWrapper from "@/app/ui/account/orders";
import styles from "../ui/account/Account.module.css";

type User = {
  user_id: number;
  username: string;
  email: string;
  role: "seller" | "buyer";
};

export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");
    const email = localStorage.getItem("userMail");

    if (!isLogged || !email) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/login/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("user not found");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error while loading the user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Log Out?",
      text: "You are about to log out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      localStorage.removeItem("isLogged");
      localStorage.removeItem("userMail");
      window.location.href = "/login";
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete Account?",
      text: "This action is permanent. Are you sure you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const email = localStorage.getItem("userMail");
      if (!email) return;

      try {
        const res = await fetch(`/api/login/${encodeURIComponent(email)}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("failed to delete");

        await Swal.fire(
          "Account Deleted",
          "Your account was successfully deleted.",
          "success"
        );

        localStorage.removeItem("isLogged");
        localStorage.removeItem("userMail");
        router.push("/login");
      } catch (err) {
        console.error("Error deleting account:", err);
        Swal.fire(
          "Error",
          "There was a problem deleting your account.",
          "error"
        );
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.wrapper}>
      <h1>Bienvenido, {userData?.username}</h1>
      <p>Correo: {userData?.email}</p>
      <p>Rol: {userData?.role === "seller" ? "Seller" : "Buyer"}</p>

      <div className={styles.buttonsContainer}>
        <button onClick={handleLogout}>Log Out</button>
        <button onClick={handleDelete}>Delete Account</button>
        <br />
      </div>

      {userData?.role === "seller" && (
        <div>
          <br />
          <br />
          <h2>Product Management</h2>
          <br />
          <br />
          <ProductsWrapper user_id={userData?.user_id || 0} />
          <AddProductForm user_id={userData?.user_id || 0} />
        </div>
      )}
      {userData?.role === "buyer" && (
        <div>
          <br />
          <br />
          <br />
          <h2>Your Purchase History</h2>
          <OrdersWrapper
            params={{
              buyer_id: userData?.user_id || 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
