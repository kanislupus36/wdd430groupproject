import Image from "next/image";
import Link from "next/link"
import { fetchProductList } from "./actions";
import styles from "@/app/ui/sellers/sellers.module.css";

interface Product {
  product_id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: [string];
}

export default async function ProductsWrapper(props: { params: Promise<{ user_id: string }> }) {

    const params =  await props.params;
    const id = params.user_id;
    
    const allProductsList = await fetchProductList();
    console.log(allProductsList)
    const userProductsList: Product[] = [];
    allProductsList.forEach((product: Product) => {
        if(product.user_id == id){
            userProductsList.push(product)
        }
    });
    console.log (userProductsList)

    return (
        <>
        {userProductsList?.map((product) => {
            return <Product key={product.product_id} product={product} />;
        })}
        </>
    );
}

export function Product({ product }: { product: Product }) {
  const imageAlt = `${product.description}`;

  return (
    <div  className={styles.productCard}>
      <Image
        src={product.images[0]}
        alt={imageAlt}
        height={400}
        width={200}
      />
      <h2>{product.title}</h2>
      <Link href={`/products/${product.product_id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}
