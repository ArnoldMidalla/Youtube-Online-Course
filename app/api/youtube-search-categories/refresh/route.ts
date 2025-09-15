import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // 1. Find items older than 7 days
  const { data: oldItems, error } = await supabase
    .from("youtube_videos")
    .select("id, kind")
    .lte("updated_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  if (!oldItems || oldItems.length === 0) {
    return NextResponse.json({ refreshed: 0, message: "No old items" });
  }

  // split into videos and playlists
  const videoIds = oldItems.filter((it) => it.kind === "youtube#video").map((it) => it.id);

  let updated: any[] = [];

  // 2. Refresh video details
  if (videoIds.length) {
    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "snippet,contentDetails,statistics");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", API_KEY!);

    const res = await fetch(detailsUrl.toString());
    const data = await res.json();

    if (data.items) {
      updated = data.items.map((item: any) => ({
        id: item.id,
        kind: item.kind,
        title: item.snippet.title,
        description: item.snippet.description,
        channel_title: item.snippet.channelTitle,
        thumbnail_url: item.snippet.thumbnails?.medium?.url || "",
        duration: item.contentDetails?.duration || null,
        view_count: item.statistics?.viewCount || null,
        raw: item,
      }));
    }
  }

  // 3. Update DB
  if (updated.length > 0) {
    await supabase.from("youtube_videos").upsert(updated, { onConflict: "id" });
  }

  return NextResponse.json({ refreshed: updated.length });
}
