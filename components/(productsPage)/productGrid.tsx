import type { PublicProductSummary } from "@/lib/public/productTypes";
import ProductCard from "./productCard";

interface ProductGridProps {
  products: PublicProductSummary[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
