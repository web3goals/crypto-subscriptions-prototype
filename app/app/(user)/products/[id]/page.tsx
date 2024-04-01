import { Product } from "@/components/product";

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10 lg:px-80">
      <Product product={params.id} />
    </div>
  );
}
