import ProductForm from "@/components/(admin)/(formSection)/productForm";
import AdminBreadcrumb from "@/components/(admin)/(shared)/adminBreadcrumb";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminBreadcrumb
        items={[
          { label: "Products", href: "/admin/products" },
          { label: "Add Product" },
        ]}
      />

      <ProductForm mode="create" />
    </div>
  );
}
