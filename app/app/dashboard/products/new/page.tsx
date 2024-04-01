import { ProductCreateForm } from "@/components/product-create-form";
import { Separator } from "@/components/ui/separator";

export default function DashboardNewProductPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Product</h2>
        <p className="text-muted-foreground">
          What do you want to offer Web3 users?
        </p>
      </div>
      <Separator className="my-6" />
      <ProductCreateForm />
    </div>
  );
}
