import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClosetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Update Your Closet</h1>
      <p className="text-muted-foreground">
        Add new items to your digital wardrobe here.
      </p>
      {/* Item upload form will go here */}
    </div>
  );
} 