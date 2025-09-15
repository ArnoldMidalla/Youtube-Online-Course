import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // adjust import path

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "tutorial";
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const supabase = await createClient();

  // 1) check cached videos first
  const { data: cached } = await supabase
    .from("youtube_videos")
    .select("*")
    .ilike("title", `%${query}%`)
    .limit(6);

  if (cached && cached.length > 0) {
    return NextResponse.json({ items: cached, cached: true });
  }

  // 2) fetch fresh from YouTube
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video,playlist");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "6");
  url.searchParams.set("key", API_KEY!);

  const ytRes = await fetch(url.toString());
  const ytData = await ytRes.json();

  if (ytData.error) {
    return NextResponse.json({ error: ytData.error }, { status: 500 });
  }

  const searchItems: any[] = ytData.items ?? [];

  // filter videos
  const videoIds = searchItems
    .filter((it) => it.id.kind === "youtube#video")
    .map((it) => it.id.videoId);

  let detailedVideos: any[] = [];
  if (videoIds.length) {
    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "snippet,contentDetails,statistics");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", API_KEY!);

    const detailsRes = await fetch(detailsUrl.toString());
    const detailsData = await detailsRes.json();
    detailedVideos = detailsData.items ?? [];
  }

  const playlists = searchItems.filter((it) => it.id.kind === "youtube#playlist");
  const combined = [...detailedVideos, ...playlists];

  // 3) store results in Supabase
  const toInsert = combined.map((item) => ({
    id: item.id.videoId || item.id.playlistId || item.id,
    kind: item.kind || item.id.kind,
    title: item.snippet.title,
    description: item.snippet.description,
    channel_title: item.snippet.channelTitle,
    thumbnail_url:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    duration: item.contentDetails?.duration || null,
    view_count: item.statistics?.viewCount || null,
    raw: item,
  }));

  if (toInsert.length > 0) {
    await supabase.from("youtube_videos").upsert(toInsert, { onConflict: "id" });
  }

  return NextResponse.json({ items: toInsert, cached: false });
}
