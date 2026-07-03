import ProductBreadcrumb from "./productBreadcrumb";

export default function ProductsPageHeader() {
  return (
    <div className="mb-6">
      <ProductBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
        All Products
      </h1>
      <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
        High-quality battery raw materials, components and accessories for
        every stage of your battery projects.
      </p>
    </div>
  );
}
