"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
    <section className="flex gap-4 w-160 overflow-auto pb-4">
      {history.map((h) => {
        const info = videoInfo[h.video_id];
        return (
          <Link href={`/video/${h.video_id}`} key={h.id}>
            <div className="w-40 h-22 rounded-md overflow-hidden">
              <img
                src={
                  info?.snippet?.thumbnails?.medium?.url ||
                  `https://i.ytimg.com/vi/${h.video_id}/hqdefault.jpg`
                }
                alt=""
                className="size-full object-cover"
              />
            </div>
            <h1 className="font-semibold line-clamp-2">
              {info?.snippet?.title || h.video_id}
            </h1>
            <p  className="text-sm">{info?.snippet?.channelTitle || "Unknown Channel"}</p>
            {/* {info?.statistics?.viewCount ? (
              <div className="text-sm text-gray-500">
                {parseInt(info.statistics.viewCount).toLocaleString()} views
              </div>
            ) : null} */}
            <p className="text-sm font-semibold">
              {h.progress_percent ?? 0}%
              {/* ({h.progress_seconds}s / {h.duration_seconds}s) */}
            </p>
            {/* <p>Last played: {new Date(h.updated_at).toLocaleString()}</p> */}
            <Progress
              // value={progress}
              value={h.progress_percent}
              className=" transition-all duration-1000 bg-purple-50 [&>div]:bg-purple-800"
            />
          </Link>
        );
      })}
    </section>
  );
}
