"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface PlaylistVideos {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const playlistId = params?.id;
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [playlistDetails, setPlaylistDetails] = useState<{
    title: string;
    description: string;
    thumbnails: string;
    publishedAt: string;
    channelTitle: string;
    itemCount: string;
    id: string;
  } | null>(null);

  const [playlistVideos, setPlaylistVideos] = useState<PlaylistVideos[]>([]);

  // Load current user
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user || null);
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Fetch video details
  useEffect(() => {
    async function fetchDetails() {
      if (!playlistId) return;
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        const res2 = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=25&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data2 = await res2.json();

        if (data.items) {
          setPlaylistDetails({
            title: data.items[0].snippet.title,
            description: data.items[0].snippet.description,
            thumbnails: data.items[0].snippet.thumbnails.medium.url,
            channelTitle: data.items[0].snippet.channelTitle,
            publishedAt: data.items[0].snippet.publishedAt,
            itemCount: data.items[0].contentDetails.itemCount,
            id: data.items[0].id,
          });
        }
        if (data2.items) {
          setPlaylistVideos(data2.items);
        }
      } catch (err) {
        console.error("❌ Failed to fetch playlist details:", err);
      }
    }
    fetchDetails();
  }, [playlistId]);

  function formatYouTubeDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";
    const hours = parseInt(match[1] || "0", 10) || 0;
    const minutes = parseInt(match[2] || "0", 10) || 0;
    const seconds = parseInt(match[3] || "0", 10) || 0;
    return hours
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (!playlistId) return <div>No playlist id</div>;
  if (!user) return <div>Please log in to track watch history.</div>;

  return (
    <section className="px-30 flex gap-4 border">
      <section className="w-70 border flex flex-col items-center gap-2">
        <div className="w-60 h-35 overflow-hidden rounded-xl">
          <img
            src={playlistDetails?.thumbnails}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className=" font-bold">{playlistDetails?.title}</h1>
          <h1 className="text-xs font-semibold text-gray-600">
            {playlistDetails?.channelTitle}
          </h1>
        </div>
        <p className="text-xs text-gray-600 text-center line-clamp-3">
          {playlistDetails?.description}
        </p>
        {/* <p>published at {playlistDetails?.publishedAt}</p> */}
        <p className="text-sm">
          <span className="font-bold">{playlistDetails?.itemCount}</span> videos
        </p>
      </section>
      <section className="flex-1 border">
        {playlistVideos.length ? (
          playlistVideos.map((video) => (
            <Link href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`} key={video.id} className="flex justify-between">
              <div className="w-15 h-8 rounded overflow-hidden">
                <img
                  src={video.snippet.thumbnails.default?.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{video.snippet.title}</h3>
                {/* <a
                href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
                >
                Watch
                </a> */}
              </div>
            </Link>
          ))
        ) : (
          <p>No videos here</p>
        )}
      </section>
    </section>
  );
}
