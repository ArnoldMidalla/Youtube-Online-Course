import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "video" // default: video

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
  // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=15&q=${encodeURIComponent(
  //   q
  // )}&key=${apiKey}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet,contentDetails&maxResults=6&q=${encodeURIComponent(
    q
  )}&key=${apiKey}`

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
