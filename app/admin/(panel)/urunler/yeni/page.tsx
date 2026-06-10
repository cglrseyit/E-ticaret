import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/urunler" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">Yeni Ürün</h1>
      </div>
      <ProductForm />
    </div>
  );
}
