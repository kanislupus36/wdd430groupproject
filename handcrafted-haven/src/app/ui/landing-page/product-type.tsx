import Image from "next/image";
import styles from "./ProductType.module.css";

export default async function ProductTypesWrapper() {
  return (
    <section className={styles.wrapper}>
      <h2>Categories</h2>
      <ProductTypeCard
        imageUrl="/images/artwork.jpg"
        title="Artwork"
        description="Discover stunning, one-of-a-kind artwork crafted to inspire and captivate."
      />
      <ProductTypeCard
        imageUrl="/images/ceramic.jpg"
        title="Ceramics"
        description="Beautifully designed pieces that blend artistry and everyday utility."
      />
      <ProductTypeCard
        imageUrl="/images/bench.jpg"
        title="Furniture"
        description="Unique pieces handcrafted to suit your unique style."
      />
    </section>
  );
}

function ProductTypeCard({
  imageUrl,
  title,
  description,
}: {
  imageUrl: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Image
        className={styles.image}
        src={imageUrl}
        alt={title + "Image"}
        width={300}
        height={200}
        objectFit="cover"
      />
    </div>
  );
}
