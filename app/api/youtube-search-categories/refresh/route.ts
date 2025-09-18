import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // find stale videos
  const { data: oldItems } = await supabase
    .from("youtube_videos")
    .select("id, kind")
    .lte("updated_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (!oldItems || oldItems.length === 0) {
    return NextResponse.json({ refreshed: 0, message: "No old items" });
  }

  const videoIds = oldItems
    .filter((it) => it.kind === "youtube#video")
    .map((it) => it.id);

  let updated: any[] = [];

  if (videoIds.length) {
    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "snippet,contentDetails,statistics");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", API_KEY!);

    const res = await fetch(detailsUrl.toString());
    const data = await res.json();

    updated = data.items.map((item: any) => ({
      id: item.id,
      kind: item.kind,
      title: item.snippet.title,
      description: item.snippet.description,
      channel_title: item.snippet.channelTitle,
      thumbnail_url: item.snippet.thumbnails?.medium?.url || "",
      duration: item.contentDetails?.duration || null,
      view_count: item.statistics?.viewCount || null,
      updated_at: new Date().toISOString(),
      raw: item,
    }));
  }

  if (updated.length > 0) {
    await supabase.from("youtube_videos").upsert(updated, { onConflict: "id" });
  }

  return NextResponse.json({ refreshed: updated.length });
}
