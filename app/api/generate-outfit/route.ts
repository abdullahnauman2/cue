import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import _ from "lodash";
import { Item } from "@/lib/types";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_dirty", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tops = items.filter((item) => item.type === "top");
  const bottoms = items.filter((item) => item.type === "bottom");

  if (tops.length === 0 || bottoms.length === 0) {
    return NextResponse.json(
      { error: "Not enough clean items to generate an outfit." },
      { status: 400 },
    );
  }

  const randomTop = _.sample(tops);
  const randomBottom = _.sample(bottoms);

  // Function to generate public URLs for images
  const getPublicUrl = (item: Item) => {
    if (!item.image_front) return item;
    const { data } = supabase.storage
      .from("items")
      .getPublicUrl(item.image_front);
    return { ...item, image_front: data.publicUrl };
  };

  const outfit = {
    top: getPublicUrl(randomTop!),
    bottom: getPublicUrl(randomBottom!),
  };

  return NextResponse.json({ outfit });
} 