import Image from "next/image";
import { fetchSellerInfo } from "./actions";
import styles from "@/app/ui/sellers/sellers.module.css";

interface Profile{
    user_id: number,
    username: string,
    email: string,
    password: string,
    role: string
}

export default async function SellerInfo({user_id}: {user_id: string}){
    const profile: Profile = await fetchSellerInfo(user_id)
    const imageAlt = `Picture of ${profile.username}`
    
    return (
        <>
        <section className={styles.profileInfo}>
            <h1> {profile.username} </h1>
            <p>This is an example Bio for a seller. They are from somewhere. Got into craft because blank. Enjoy these hobbies: biking, swimming, photography</p>
        </section>
        <Image
            className={styles.profileImage}
            src={'/images/profile.jpg'}
            alt={imageAlt}
            height={400}
            width={200} 
            objectFit="contain"/>
        </>
    )
}
