"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface VideoInfo {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
}

export default function History() {
  const supabase = createClient();
  const [history, setHistory] = useState<any[]>([]);
  const [videoInfo, setVideoInfo] = useState<Record<string, VideoInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("video_history")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setHistory(data || []);

      // collect unique video IDs
      const uniqueIds = Array.from(
        new Set((data || []).map((h) => h.video_id))
      );

      if (uniqueIds.length > 0) {
        // batch fetch in chunks of 50
        const chunkSize = 50;
        const chunks = [];
        for (let i = 0; i < uniqueIds.length; i += chunkSize) {
          chunks.push(uniqueIds.slice(i, i + chunkSize));
        }

        const allResults: VideoInfo[] = [];
        for (const chunk of chunks) {
          const res = await fetch(`/api/youtube-info?ids=${chunk.join(",")}`);
          if (res.ok) {
            const info = await res.json();
            allResults.push(...info);
          }
        }

        // map by videoId
        const infoMap: Record<string, VideoInfo> = {};
        allResults.forEach((item) => {
          infoMap[item.id] = item;
        });

        setVideoInfo(infoMap);
      }

      setLoading(false);
    };

    fetchHistory();
  }, [supabase]);

  if (loading) return <div>Loading...</div>;
  if (history.length === 0)
    return <div>No watch history yet — play some videos!</div>;

  return (
    // <ul className="space-y-4">
    //   {history.map((h) => {
    //     const info = videoInfo[h.video_id];
    //     return (
    //       <li key={h.id} className="flex gap-4 p-3 border rounded-lg shadow-sm">
    //         <img
    //           src={
    //             info?.snippet?.thumbnails?.medium?.url ||
    //             `https://i.ytimg.com/vi/${h.video_id}/hqdefault.jpg`
    //           }
    //           alt="thumb"
    //           width={160}
    //           className="rounded"
    //         />
    //         <div className="flex-1">
    //           <div className="font-semibold">
    //             {info?.snippet?.title || h.video_id}
    //           </div>
    //           <div className="text-sm text-gray-600">
    //             {info?.snippet?.channelTitle || "Unknown Channel"}
    //           </div>
    //           {info?.statistics?.viewCount && (
    //             <div className="text-sm text-gray-500">
    //               {parseInt(info.statistics.viewCount).toLocaleString()} views
    //             </div>
    //           )}
    //           <div className="text-sm">
    //             Progress: {h.progress_percent ?? 0}% ({h.progress_seconds}s /{" "}
    //             {h.duration_seconds}s)
    //           </div>
    //           <div className="text-sm text-gray-500">
    //             Last played: {new Date(h.updated_at).toLocaleString()}
    //           </div>
    //           <Link
    //             href={`/video/${h.video_id}`}
    //             className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded"
    //           >
    //             Resume
    //           </Link>
    //         </div>
    //       </li>
    //     );
    //   })}
    // </ul>
    <section className="flex gap-4 w-160 overflow-auto">
      {history.map((h) => {
        const info = videoInfo[h.video_id];
        return (
          <Link href={`/video/${h.video_id}`} key={h.id}>
            <div className="w-40 h-22 rounded overflow-hidden">
              <img
                src={
                  info?.snippet?.thumbnails?.medium?.url ||
                  `https://i.ytimg.com/vi/${h.video_id}/hqdefault.jpg`
                }
                alt=""
                className="size-full object-cover"
              />
            </div>
            <h1 className="font-semibold line-clamp-2">{info?.snippet?.title || h.video_id}</h1>
            <p>{info?.snippet?.channelTitle || "Unknown Channel"}</p>
            {info?.statistics?.viewCount ? (
              <div className="text-sm text-gray-500">
                {parseInt(info.statistics.viewCount).toLocaleString()} views
              </div>
            ) : null}
            <p>
              {h.progress_percent ?? 0}% ({h.progress_seconds}s /
              {h.duration_seconds}s)
            </p>
            <p>Last played: {new Date(h.updated_at).toLocaleString()}</p>
          </Link>
        );
      })}
    </section>
  );
}
