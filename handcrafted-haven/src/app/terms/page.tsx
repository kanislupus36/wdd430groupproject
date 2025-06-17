import styles from "../ui/site-info/SiteInfo.module.css";

export default function TermsAndConditionsPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Terms and Conditions</h1>
      <div className={styles.profileInfo}>
        <p>
          By using Handcrafted Haven, you agree to our terms and conditions. All sellers are responsible 
          for the authenticity and quality of their products. Buyers must review listings carefully before purchase.
        </p>
        <p>
          Handcrafted Haven reserves the right to remove listings or suspend accounts that violate our community 
          guidelines. All users must act respectfully and in good faith.
        </p>
      </div>
    </div>
  );
}
