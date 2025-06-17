import styles from "./Header_Footer.module.css";

import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Social Media Links */}
        
        <div className={styles.socialMedia}>
          <div>
            <h4>Handcrafted Haven</h4>
            <p>Connecting Artisans with Buyers</p>
            <p>© {year} Handcrafted Haven. All rights reserved.</p>
          </div>
          <div className={styles.socialMediaIcons}>
             <FaFacebookF />
             <FaLinkedinIn />
             <FaYoutube />
             <FaInstagram />
           </div>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <div>
            <h4>About</h4>
            <Link href="/about"> Who We Are</Link>
          </div>
          <div>
            <h4>Privacy</h4>
            <Link href="/terms">Terms And Conditions</Link>
            <Link href="/support">Support Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
