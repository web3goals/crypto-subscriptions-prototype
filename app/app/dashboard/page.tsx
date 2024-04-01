import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Products you offer to Web3 users
        </p>
      </div>
      <Separator className="my-6" />
      <Link href="/dashboard/products/new">
        <Button>Create Product</Button>
      </Link>
    </div>
  );
}
