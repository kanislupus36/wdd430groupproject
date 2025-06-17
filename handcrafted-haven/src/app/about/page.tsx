import styles from "../ui/site-info/SiteInfo.module.css";

export default function WhoWeArePage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Who We Are</h1>
      <div className={styles.profileInfo}>
        <p>
          At Handcrafted Haven, we believe in the power of creativity and the value of handmade goods. 
          Our platform was built to support artisans and crafters by giving them a space to share their 
          stories, showcase their unique creations, and connect with conscious consumers.
        </p>
        <br />
        <p>
          Our mission is to foster a vibrant and supportive community where craftsmanship is celebrated, 
          sustainability is encouraged, and the beauty of handmade products is shared with the world.
        </p>
      </div>
    </div>
  );
}
