interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // Add more product details here
}

const products: Product[] = [];

export { Product, products };
