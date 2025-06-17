"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../ui/details-page/ProductsPageDetails.module.css";
import Loading from "../../ui/products-page/loading";
import { addProductToCart } from "@/app/ui/cart/actions";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Swal from "sweetalert2";

interface Product {
  product_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  user_id?: string;
}

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  username: string;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userMail");
    setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          notFound();
        }
      })
      .catch((error) => console.error("Error fetching product:", error));

    fetchReviews();
  }, [params.id]);

  const fetchReviews = () => {
    fetch(`/api/reviews/${params.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  };

  async function addToCart(product: Product) {
    const storedIsLogged = localStorage.getItem("isLogged");

    if (!storedIsLogged || !userEmail) {
      await Swal.fire({
        icon: "info",
        title: "Please log in",
        text: "You need to be logged in to add an item to the cart.",
      });
      return;
    }

    try {
      addProductToCart(product);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    } catch (error) {
      console.log("Unable to add Product to cart", error);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      await Swal.fire({
        icon: "info",
        title: "Please log in",
        text: "You need to be logged in to leave a review.",
      });
      return;
    }

    try {
      const userRes = await fetch(
        `/api/login/${encodeURIComponent(userEmail)}`
      );
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();
      const userId = userData.user_id;

      const reviewData = {
        product_id: product?.product_id,
        user_id: userId,
        rating,
        comment,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        setRating(5);
        setComment("");
        fetchReviews();
        await Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your review has been submitted.",
        });
      } else {
        throw new Error("Failed to submit review.",userData);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong submitting your review.",
      });
    }
  };

  if (!product) return <Loading />;

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.arrowContainer}>
          <Link href="/products" className={styles.backLink}>
            <IoChevronBackCircleOutline style={{ marginRight: "8px" }} />
          </Link>
          <h1>{product.title}</h1>
        </div>
        <br />
        <p>{product.description}</p>
        <p>
          Price: <strong>${product.price}</strong>
        </p>
        <p>Category: {product.category}</p>
        <br />
        {product.images.map((image, index) => (
          <img
            className={styles.productImage}
            key={index}
            src={image}
            alt={product.title}
          />
        ))}
      </div>

      <div>
        <br />
        <button
          className={styles.cartButton}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>

      {showPopup && <div className={styles.popup}>Product added to cart!</div>}

      <br />
      <br />
      <h1>Reviews</h1>
      {reviews.length > 0 ? (
        <ul className={styles.reviewList}>
          {reviews.map((review, index) => (
            <li key={index}>
              <p className={styles.reviewRating}>Rating: {review.rating} ⭐</p>
              <p className={styles.reviewComment}>{review.comment}</p>
              <p style={{ fontStyle: "italic", color: "#555" }}>
                – {review.username}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Loading />
      )}

      <h1 className={styles.title}>Leave a Review</h1>
      <form onSubmit={handleSubmitReview} className={styles.contactForm}>
        <h2>Share your opinion</h2>
        <label htmlFor="rating">Rating (1 to 5)</label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          required
        />

        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
