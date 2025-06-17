"use client";
import styles from "@/app/ui/sellers/sellers.module.css";
import Swal from "sweetalert2";

export default function ContactForm() {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const storedIsLogged = localStorage.getItem("isLogged");
    const storedEmail = localStorage.getItem("userMail");

    if (!storedIsLogged || !storedEmail) {
      Swal.fire({
        icon: "info",
        title: "Please log in",
        text: "You need to be logged in to send a message.",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Thank you!",
      text: "Your message has been sent successfully.",
    });

    e.currentTarget.reset();
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <h2>Contact Me</h2>

      <label>First Name:</label>
      <input
        type="text"
        name="fname"
        placeholder="Enter your first name"
        required
      />

      <label>Last Name:</label>
      <input
        type="text"
        name="lname"
        placeholder="Enter your last name"
        required
      />

      <label>Email Address:</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        required
      />

      <label>Message: </label>
      <textarea
        name="message"
        placeholder="Write your message here..."
        required
      ></textarea>

      <button type="submit">Send Message</button>
    </form>
  );
}
