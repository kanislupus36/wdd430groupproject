/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import styles from "./Order.module.css";

interface Order {
  order_id: number;
  buyer_id: number;
  total_amount: number;
  status: string;
}

export default function OrdersWrapper(props: { params: { buyer_id: number } }) {
  const id = props.params.buyer_id;
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?buyer_id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrderList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (orderList.length === 0) {
    return <p>No orders found.</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <br />
      {orderList?.map((order) => (
        <Order key={order.order_id} order={order} />
      ))}
    </>
  );
}

export function Order({ order }: { order: Order }) {
  return (
    <ul className={styles.orderList}>
      <li className={styles.orderCard}>
        <h2 className={styles.orderTitle}>Order #: {order.order_id}</h2>
        <p className={styles.orderAmount}>Total: ${order.total_amount}</p>
      </li>
    </ul>
  );
}
