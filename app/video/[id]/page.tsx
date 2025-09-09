// /app/video/[id]/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

declare global {
  interface Window {
    YT: typeof YT | undefined;
  }
}

export default function VideoPlayerPage() {
  const params = useParams<{ id: string }>();
  const videoId = params?.id;
  const supabase = createClient();
  const router = useRouter();

  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // load current user (client-side)
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) {
        setUser(null);
        // router.push("/login"); // optional
      } else {
        setUser(data.user);
      }
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  // save progress (upsert by user+video)
  const saveProgress = async (status: string, progressSeconds: number) => {
    if (!user || !videoId) return;
    const duration = playerRef.current?.getDuration?.() ?? 0;
    const percent =
      duration > 0
        ? Math.round((progressSeconds / duration) * 100)
        : 0;

    const row = {
      user_id: user.id,
      video_id: videoId,
      status,
      progress_seconds: Math.floor(progressSeconds),
      duration_seconds: Math.floor(duration),
      progress_percent: percent,
      last_played_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("video_history")
      .upsert(row, { onConflict: "user_id,video_id" });

    if (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
    playerRef.current = event.target;
  };

  const startInterval = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      const current = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();

      saveProgress("playing", Math.floor(current));

      if (duration > 0 && current > duration * 0.5) {
        fetch("/api/update-streak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        }).catch((err) =>
          console.error("Failed to update streak", err)
        );

        stopInterval(); // fire once
      }
    }, 10000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onStateChange = (event: YouTubeEvent<YouTubePlayer>) => {
    const state = event.data;
    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;

    if (state === window.YT?.PlayerState?.PLAYING) {
      startInterval();
      saveProgress("started", Math.floor(currentTime));
    } else if (state === window.YT?.PlayerState?.PAUSED) {
      stopInterval();
      saveProgress("paused", Math.floor(currentTime));
    } else if (state === window.YT?.PlayerState?.ENDED) {
      stopInterval();
      saveProgress("completed", Math.floor(currentTime));
    }
  };

  // save on unload / navigate away
  useEffect(() => {
    const beforeUnload = () => {
      if (playerRef.current) {
        const t = playerRef.current.getCurrentTime();
        saveProgress("paused", Math.floor(t));
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      stopInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, videoId]);

  if (!videoId) return <div>No video id</div>;
  if (!user) return <div>Please log in to track watch history.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Watching {videoId}
      </h1>

      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "480",
          playerVars: { rel: 0 },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />

      <div className="mt-4 text-sm text-muted-foreground">
        Progress will be saved every 10s, on pause and on video end.
      </div>
    </div>
  );
}
