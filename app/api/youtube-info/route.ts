// /app/api/youtube-info/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids"); // comma-separated video IDs

  if (!ids) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY!;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "YouTube API error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data.items); // return array of videos
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch YouTube API" }, { status: 500 });
  }
}
