import Image from "next/image";
import styles from "./Hero.module.css";
import Link from "next/link";

const Hero = () => {
  const imageUrl = "/images/landing-hero-one.webp";

  return (
    <div className={styles.heroContainer}>
      <Image
        src={imageUrl}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className={styles.overlay}>
        <h1 className={styles.title}>Handcrafted Haven</h1>
        <p className={styles.subheading}>
          Revolutionize the way handcrafted items are discovered, appreciated,
          and acquired connecting talented creators with potential customers.
        </p>
        <Link href="/products">
          <button className={styles.button}>Explore Products</button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
