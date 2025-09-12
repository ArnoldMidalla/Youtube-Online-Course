// /app/api/youtube-info/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids"); // comma-separated video IDs

  if (!ids) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "YouTube API error" }, { status: res.status });
    }

    const data = await res.json();

//extra insert for channel image profile pic
  // 🔹 collect channelIds from the video response
    const channelIds = [...new Set(data.items.map((v: any) => v.snippet.channelId))].join(",");

    // 🔹 fetch channel details
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    // 🔹 build a lookup for channel profile images
    const channelMap: Record<string, string> = {};
    channelData.items.forEach((c: any) => {
      channelMap[c.id] = c.snippet.thumbnails?.high?.url || "";
    });

    // 🔹 inject channel profile pic into each video item
    data.items.forEach((v: any) => {
      v.channelProfileImage = channelMap[v.snippet.channelId] || null;
    });
//end of insert


    return NextResponse.json(data.items); // return array of videos
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch YouTube API" }, { status: 500 });
  }
}
