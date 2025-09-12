// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const q = searchParams.get("q");
//   const type = searchParams.get("type") || "video" // default: video

//   if (!q) {
//     return NextResponse.json({ items: [] });
//   }

//   const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
//   // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=15&q=${encodeURIComponent(
//   //   q
//   // )}&key=${apiKey}`;
//     const url = `https://www.googleapis.com/youtube/v3/search?part=snippet,contentDetails&maxResults=6&q=${encodeURIComponent(
//     q
//   )}&key=${apiKey}`

//   const res = await fetch(url);
//   const data = await res.json();

//   return NextResponse.json(data);
// }

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "video,playlist"; // can be "video", "playlist", or "" for all

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;

  // 1️⃣ Search (type can be empty to include both videos and playlists)
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=${type}&maxResults=6&q=${encodeURIComponent(
    q
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const items = data.items;

  // 2️⃣ Separate videos and playlists
  const videoItems = items.filter((item: any) => item.id.kind === "youtube#video");
  const playlistItems = items.filter((item: any) => item.id.kind === "youtube#playlist");

  const videoIds = videoItems.map((item: any) => item.id.videoId).join(",");

  // 3️⃣ Fetch video details only if there are videoIds
  let videos: any[] = [];
  if (videoIds) {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
    const videoRes = await fetch(videoUrl);
    const videoData = await videoRes.json();

    // 4️⃣ Fetch channel profile images
    const channelIds = [...new Set(videoData.items.map((v: any) => v.snippet.channelId))].join(",");
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    const channelMap: Record<string, string> = {};
    channelData.items.forEach((c: any) => {
      channelMap[c.id] = c.snippet.thumbnails?.high?.url || "";
    });

    // 5️⃣ Merge video details + channel profile images
    videos = videoData.items.map((v: any) => ({
      id: v.id,
      type: "video",
      title: v.snippet.title,
      description: v.snippet.description,
      thumbnails: v.snippet.thumbnails,
      duration: v.contentDetails.duration,
      viewCount: v.statistics.viewCount,
      channelTitle: v.snippet.channelTitle,
      channelProfileImage: channelMap[v.snippet.channelId] || null,
    }));
  }

  // 6️⃣ Include playlists (snippet only)
  const playlists = playlistItems.map((p: any) => ({
    id: p.id.playlistId,
    type: "playlist",
    title: p.snippet.title,
    description: p.snippet.description,
    thumbnails: p.snippet.thumbnails,
    channelTitle: p.snippet.channelTitle,
    channelProfileImage: null, // optional: you could fetch this too if needed
  }));

  // 7️⃣ Merge videos + playlists
  const results = [...videos, ...playlists];

  return NextResponse.json(data);
}