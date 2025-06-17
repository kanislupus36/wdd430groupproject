import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      className="not-found-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        padding: "50px",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{ color: "#000", textDecoration: "underline", marginTop: "20px" }}
      >
        Return to Home Page
      </Link>
    </div>
  );
}
