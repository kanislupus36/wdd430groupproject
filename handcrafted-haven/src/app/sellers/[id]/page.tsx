import ContactForm from "@/app/ui/sellers/contact-form";
import SellerInfo from "@/app/ui/sellers/seller-info";
import ProductsWrapper from "@/app/ui/sellers/products";
import styles from '@/app/ui/sellers/sellers.module.css';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <div>
    <div className={styles.profileDetail}>
      <SellerInfo user_id={id} />
    </div>
      <div className={styles.productsList}>
        <h2>Products</h2>
        <ProductsWrapper params={Promise.resolve({ user_id: id })} />
      </div>
      <ContactForm />
    </div>
  );
}
