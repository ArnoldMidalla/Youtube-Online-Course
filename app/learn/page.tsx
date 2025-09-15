"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Loading from "../loading";
import Statistics from "../components/statistics";
import Sidebar from "../components/sidebar";
import { ArrowRight } from "lucide-react";
import History from "../components/history";

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
  channelProfileImage: string;
}

export default function Learn() {
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

  // if (loading) return <div>Loading...</div>;
  if (loading) return <Loading />;
  if (history.length === 0)
    return <div>No watch history yet — play some videos!</div>;

  return (
    <>
      {/* <section className="px-30 flex flex-col gap-4 py-4">
        <h1 className="text-purple-800 text-3xl font-bold">
          Keep watching{" "}
          <span className="text-black">your previous tutorials</span>
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {history.map((h) => {
            const info = videoInfo[h.video_id];
            return (
              <Link href={`/video/${h.video_id}`} className="" key={h.id}>
                <div
                  // key={h.id}
                  className="flex flex-col gap-4 p-3 border rounded-lg shadow hover:shadow-lg duration-300 hover:-translate-y-1"
                >
                  <div className="w-full h-40 overflow-hidden rounded-md">
                    <img
                      src={
                        info?.snippet?.thumbnails?.high?.url ||
                        `https://i.ytimg.com/vi/${h.video_id}/hqdefault.jpg`
                      }
                      alt={`${info?.snippet?.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="">
                    <p className="font-semibold line-clamp-1">
                      {info?.snippet?.title || h.video_id}
                    </p>
                    <div className="flex gap-2 items-center">
                      <div className="rounded-full overflow-hidden h-8 w-8">
                        <img
                          src={info?.channelProfileImage}
                          alt={info?.snippet?.channelTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between gap-6">
                        <p className="text-sm text-gray-600">
                          {info?.snippet?.channelTitle || "Unknown Channel"}
                        </p>
                        {info?.statistics?.viewCount && (
                          <p className="text-sm text-gray-500">
                            {parseInt(
                              info.statistics.viewCount
                            ).toLocaleString()}{" "}
                            views
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      Progress: {h.progress_percent ?? 0}% ({h.progress_seconds}
                      s / {h.duration_seconds}s)
                    </div>
                    <div className="text-sm text-gray-500">
                      Last played: {new Date(h.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section> */}
      <section className="flex bg-gray-100">
        <Sidebar />
        <div className="flex-1  pl-48 pr-8 gap-8 mt-8 flex">
          <main className="flex-1 flex flex-col gap-8">
            <div className="bg-purple-800 w-full h-40 capitalize rounded-xl text-white flex flex-col justify-center pl-10">
              <p className="font-medium text-sm">Online course</p>
              <h1 className="text-3xl font-bold capitalize">
                Sharpen your skills with
                <br />
                professional online courses
              </h1>
              <Link
                href=''
                className="flex items-center gap-1 text-sm bg-black w-fit p-2 rounded-lg font-semibold"
              >
                Join now{" "}
                <ArrowRight className="size-5 text-black bg-white rounded-full p-1" />
              </Link>
            </div>

            <div className="bg-white py-8 h-120 flex flex-col items-center rounded-xl gap-2">
              <h1 className="font-bold text-xl">Continue watching</h1>
              <History />
            </div>
          </main>
          <Statistics />
        </div>
      </section>
    </>
  );
}
