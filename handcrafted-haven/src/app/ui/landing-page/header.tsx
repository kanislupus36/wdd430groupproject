"use client";

import Link from "next/link";
import styles from "./Header_Footer.module.css";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const loggedValue = localStorage.getItem("isLogged");
      setIsLogged(loggedValue === "true");
    }
  }, []);

  const loginString = isLogged ? "My account" : "Login";

  return (
    <header>
      <nav className={styles.Nav}>
        <div className={styles.NavLeft}>
          <Link href="/">Handcrafted Haven</Link>
        </div>

        <div className={styles.NavRight}>
          <NavLink name="Seller Profiles" href="/sellers" />
          <NavLink name="Product Listings" href="/products" />
          <NavLink name="My cart" href="/cart" />
          <Link href="/account" className={styles.LoginButton}>
            {loginString}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function NavLink({ name, href }: { name: string; href: string }) {
  const pathname = usePathname();
  return (
    <Link
      key={name}
      href={href}
      className={clsx(styles.NavLink, {
        [styles.Active]: pathname === href,
      })}
    >
      {name}
    </Link>
  );
}
