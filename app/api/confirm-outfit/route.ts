import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { top, bottom } = await req.json();

  if (!top || !bottom) {
    return NextResponse.json(
      { error: "Missing item IDs" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  // Mark items as dirty
  const { error: updateError } = await supabase
    .from("items")
    .update({ is_dirty: true })
    .in("id", [top.id, bottom.id]);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Increment wear_count for bottom
  const { error: wearCountError } = await supabase
    .from("items")
    .update({ wear_count: bottom.wear_count + 1 })
    .eq("id", bottom.id);

  if (wearCountError) {
    // Note: this won't roll back the dirty status. For a real app, use a transaction.
    return NextResponse.json({ error: wearCountError.message }, { status: 500 });
  }

  // Create outfit record
  const { error: outfitError } = await supabase
    .from("outfits")
    .insert({ user_id: user.id, item_ids: [top.id, bottom.id] });

  if (outfitError) {
    return NextResponse.json({ error: outfitError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 