import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.storage
      .from("items")
      .download(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the blob and convert to array buffer
    const arrayBuffer = await data.arrayBuffer();
    
    // Determine content type based on file extension
    const contentType = path.endsWith('.jpg') || path.endsWith('.jpeg') 
      ? 'image/jpeg' 
      : path.endsWith('.png') 
      ? 'image/png' 
      : 'image/jpeg'; // default

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (e) {
    console.error("Error in GET /api/image:", e);
    return NextResponse.json(
      { error: (e as Error).message }, 
      { status: 500 }
    );
  }
}