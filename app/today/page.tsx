import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Check, Loader, Shuffle } from "lucide-react";
import Image from "next/image";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Later, this will fetch real items
  const { data: items, error } = await supabase.from("items").select("*");

  // Placeholder outfit data
  const outfit = {
    top: {
      id: "1",
      name: "White T-Shirt",
      image_front: "https://picsum.photos/id/1025/400/600",
    },
    bottom: {
      id: "2",
      name: "Blue Jeans",
      image_front: "https://picsum.photos/id/1062/400/600",
    },
    shoes: {
      id: "3",
      name: "White Sneakers",
      image_front: "https://picsum.photos/id/21/400/600",
    },
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today's Outfit</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Shuffle className="mr-2 size-4" />
            Regenerate
          </Button>
          <Button>
            <Check className="mr-2 size-4" />
            Wear this today
          </Button>
          <Button variant="secondary">
            <Loader className="mr-2 size-4" />
            Laundry Day
          </Button>
        </div>
      </div>

      {items && items.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.values(outfit).map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] w-full overflow-hidden rounded-md">
                  <Image
                    src={item.image_front!}
                    alt={item.name}
                    width={400}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">Your closet is empty!</h2>
          <p className="mt-2 text-muted-foreground">
            Add items to your digital closet to start generating outfits.
          </p>
          <Button className="mt-4">Add Your First Item</Button>
        </div>
      )}
    </section>
  );
}
