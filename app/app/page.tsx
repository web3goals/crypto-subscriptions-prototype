import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 lg:h-[calc(100vh-4rem)]">
      {/* Text with button */}
      <section className="flex flex-col items-center py-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-center max-w-[820px] md:text-5xl">
          Enable subscriptions for Web3 users in your Web2 product
        </h1>
        <h2 className="text-2xl font-normal tracking-tight text-center text-muted-foreground mt-4">
          A platform to manage crypto subscriptions in a few clicks
        </h2>
        <Link href="/dashboard">
          <Button className="mt-6" size="lg">
            Open Dashboard
          </Button>
        </Link>
      </section>
      {/* Image */}
      <section className="flex flex-col items-center max-w-[480px]">
        <Image
          src="/images/subscriptions.png"
          alt="Subscriptions"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full"
        />
      </section>
    </div>
  );
}
