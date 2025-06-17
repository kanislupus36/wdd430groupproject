export async function fetchSellerInfo(user_id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/sellers/${user_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch seller info");
    }
    const sellerInfo = await res.json();
    return sellerInfo;
  } catch (error) {
    console.error("Error fetching seller info:", error);
    return [];
  }
}

export async function fetchSellersList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/sellers`);
    if (!res.ok) {
      throw new Error("Failed to fetch sellers list");
    }
    const sellersList = await res.json();
    return sellersList;
  } catch (error) {
    console.error("Error fetching sellers list:", error);
    return [];
  }
}

export async function fetchProductList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try{
    const res = await fetch(`${apiUrl}/products`);
    if(!res.ok) {
      throw new Error("Failed to fetch product list");
    }
    const productsList = await res.json();
    return productsList;
  } catch (error) {
    console.error("Error fetching products list:", error);
    return [];
  }
}
