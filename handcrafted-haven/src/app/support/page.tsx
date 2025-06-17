import styles from "../ui/site-info/SiteInfo.module.css";

export default function SupportTeamPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Support Team</h1>
      <div className={styles.profileInfo}>
        <p>
          Our dedicated support team is here to help you. Whether you are a
          seller needing assistance with your shop or a buyer with questions
          about an order, we are just a message away.
        </p>
        <br />
        <p>
          Contact us anytime through our support form or email, and we will do our
          best to assist you promptly.
        </p>
        <br />
        <strong>handcraftedheaven@support.co</strong>
        <br />
        <br />
        <strong>217 714-2769 x6570</strong>
      </div>
    </div>
  );
}
