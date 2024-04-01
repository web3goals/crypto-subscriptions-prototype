import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10 lg:px-80">
      <Skeleton className="h-4" />
    </div>
  );
}
