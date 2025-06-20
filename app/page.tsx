import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { createClient } from "@/lib/supabase/server";
import { Camera, Shirt, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/today");
  }

  return (
    <>
      <section className="container flex flex-col items-center justify-center text-center pt-20 md:pt-32 pb-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Rediscover Your Wardrobe
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Aura is your personal AI stylist. It learns your style, tracks your
          outfits, and helps you get dressed with confidence every day.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/auth/login">
            <Button size="lg">Create Your Closet</Button>
          </Link>
        </div>
      </section>
      <section className="container pt-4 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={Camera}
            title="Snap Your Closet"
            description="A couple of pictures of every clothing item is all you need to get started."
          />
          <FeatureCard
            icon={Sparkles}
            title="Unlock Your Style"
            description="Our AI automatically learns your style and understands how your items go together."
          />
          <FeatureCard
            icon={Shirt}
            title="Meet Your Aura"
            description="Get daily outfit suggestions, ensuring you never repeat and always look your best."
          />
        </div>
      </section>
    </>
  );
}
