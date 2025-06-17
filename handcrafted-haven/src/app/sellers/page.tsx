import ProfilesWrapper from "../ui/sellers/profiles";
import styles from "../ui/sellers/sellers.module.css";

export default async function Page() {
  return (
    <div className={styles.main}>
      <h1>Artists</h1>
      <ProfilesWrapper />
    </div>
  );
}
