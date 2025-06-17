import Image from "next/image";
import Link from "next/link"
import { fetchSellersList } from "./actions";
import styles from "./sellers.module.css";

interface Profile {
  user_id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export default async function ProfilesWrapper() {
  const sellerList: [Profile] = await fetchSellersList();
  return (
    <>
      {sellerList?.map((profile) => {
        return <Profile key={profile.user_id} profile={profile} />;
      })}
    </>
  );
}

export function Profile({ profile }: { profile: Profile }) {
  const imageAlt = `Picture of ${profile.username}`;

  return (
    <div  className={styles.profileLink}>
      <Image
        className={styles.profileImg}
        src={"/images/profile.jpg"}
        alt={imageAlt}
        height={400}
        width={200}
      />
      <h2>{profile.username}</h2>
      <Link href={`/sellers/${profile.user_id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}
