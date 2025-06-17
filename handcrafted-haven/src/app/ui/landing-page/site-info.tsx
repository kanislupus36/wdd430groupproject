'use client';

import { CircleHelp, CircleUser, Globe, Lock } from "lucide-react";
import styles from "./site-info.module.css";

export default function SiteInfoWrapper() {
  const cards = [
    {
      icon: <CircleUser strokeWidth={1.5} />,
      title: "About",
      description:
        "Handcrafted Haven connects artisans with buyers who value unique, handmade goods. More than a marketplace, it’s a community that celebrates craftsmanship and creativity.",
    },
    {
      icon: <Globe strokeWidth={1.5} />,
      title: "Services",
      description:
        "We provide artisans with easy-to-use storefronts, secure transactions, and branding tools. Buyers can discover one-of-a-kind products while supporting independent creators.",
    },
    {
      icon: <CircleHelp strokeWidth={1.5} />,
      title: "Support",
      description:
        "Our team is here to help, whether you're setting up a shop or making a purchase. From technical assistance to marketing tips, we ensure a smooth experience.",
    },
    {
      icon: <Lock strokeWidth={1.5} />,
      title: "Privacy",
      description:
        "We prioritize your privacy with secure transactions and data protection. Your information is safe with us, and we never share it without consent.",
    },
  ];

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>Site Info</h2>
      <div className={styles.container}>
        {cards.map((card, index) => (
          <SiteInfoCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            delay={index}
          />
        ))}
      </div>
    </section>
  );
}

function SiteInfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className={styles.card}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.details}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}