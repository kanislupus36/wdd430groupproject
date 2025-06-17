interface Product {
  product_id: string;
  title: string;
  description: string;
  price: number; 
  category: string;
  images: string[];
  user_id?: string;
}


interface cartItem {
  product_id: string;
  qty: number;
  title: string;
  price: number;
}

export function fetchCartList() {
  try {
    const cartList = JSON.parse(localStorage.getItem("haven-cart") || "[]");
    return cartList;
  } catch (error) {
    console.error("Error parsing cart list:", error);
    return [];
  }
}

export function deleteItemFromCart(product_id: string) {
  let cartList: cartItem[] = JSON.parse(
    localStorage.getItem("haven-cart") || "[]"
  );
  cartList = cartList.filter((item) => item.product_id !== product_id);
  localStorage.setItem("haven-cart", JSON.stringify(cartList));
}

export function addProductToCart(product: Product): void {
  let cartList: cartItem[] = JSON.parse(
    localStorage.getItem("haven-cart") || "[]"
  );

  let productExists = false;

  cartList = cartList.map((item) => {
    if (item.product_id === product.product_id) {
      productExists = true;
      return { ...item, qty: item.qty + 1 };
    } else {
      return item;
    }
  });

  if (!productExists) {
    const cartItem: cartItem = {
      product_id: product.product_id,
      title: product.title,
      price: product.price,
      qty: 1,
    };
    cartList.push(cartItem);
  }

  localStorage.setItem("haven-cart", JSON.stringify(cartList));
}

export function changeProductQty(product_id: string, qty: number) {
  const cartList: cartItem[] = JSON.parse(
    localStorage.getItem("haven-cart") || "[]"
  );
  cartList.forEach((item) => {
    if (item.product_id === product_id) {
      item.qty = qty;
    }
  });
  localStorage.setItem("haven-cart", JSON.stringify(cartList));
}

export async function calculateCartTotal() {
  const cartList: cartItem[] = JSON.parse(
    localStorage.getItem("haven-cart") || "[]"
  );
  let total: number = 0;
  for (const item of cartList) {
    const product: Product = await fetchProductInfo(item.product_id);
    const price = product.price;
    const subtotal = price * item.qty;
    total += subtotal;
  }

  return total;
}

export async function fetchProductInfo(product_id: string) {
  try {
    const res = await fetch(`api/products/${product_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch product list");
    }
    const product = await res.json();
    return product;
  } catch (error) {
    console.error("Error fetching products list:", error);
    return undefined;
  }
}
