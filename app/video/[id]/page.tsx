// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";

// declare namespace YT {
//   enum PlayerState {
//     UNSTARTED = -1,
//     ENDED = 0,
//     PLAYING = 1,
//     PAUSED = 2,
//     BUFFERING = 3,
//     CUED = 5,
//   }
// }

// declare global {
//   interface Window {
//     YT: typeof YT | undefined;
//   }
// }

// export default function VideoPlayerPage() {
//   const params = useParams<{ id: string }>();
//   const videoId = params?.id;
//   const supabase = createClient();
//   const router = useRouter();

//   const playerRef = useRef<YouTubePlayer | null>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const [user, setUser] = useState<any | null>(null);
//   const [videoDetails, setVideoDetails] = useState<{
//     title: string;
//     description: string;
//     channelTitle: string;
//     viewCount: string;
//     likeCount: string;
//     publishedAt: string;
//     vidDuration: string;
//   } | null>(null);

//   useEffect(() => {
//   if (!user || !videoDetails || !videoId) return;

//   if (!streakUpdatedRef.current) {
//     streakUpdatedRef.current = true; // prevent multiple calls
//     updateStreak(); // now it will actually run
//   }
// }, [user, videoDetails, videoId]);


//   // load current user (client-side)
//   useEffect(() => {
//     let mounted = true;
//     supabase.auth.getUser().then(({ data }) => {
//       if (!mounted) return;
//       if (!data.user) {
//         setUser(null);
//         // router.push("/login"); // optional
//       } else {
//         setUser(data.user);
//       }
//     });
//     return () => {
//       mounted = false;
//     };
//   }, [supabase]);

//   // fetch video details from YouTube Data API (client-side)
//   useEffect(() => {
//     async function fetchDetails() {
//       if (!videoId) return;
//       try {
//         const res = await fetch(
//           `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
//         );
//         const data = await res.json();
//         if (data.items && data.items.length > 0) {
//           setVideoDetails({
//             title: data.items[0].snippet.title,
//             description: data.items[0].snippet.description,
//             channelTitle: data.items[0].snippet.channelTitle,
//             viewCount: data.items[0].statistics.viewCount,
//             likeCount: data.items[0].statistics.likeCount,
//             publishedAt: data.items[0].snippet.publishedAt,
//             // vidDuration: data.items[0].contentDetails.duration,
//             vidDuration: formatYouTubeDuration(data.items[0].contentDetails.duration),
            

//           });
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch video details:", err);
//       }
//     }
//     fetchDetails();
//   }, [videoId]);

//   // save progress (upsert by user+video)
//   const saveProgress = async (status: string, progressSeconds: number) => {
//     if (!user || !videoId) return;
//     const duration = playerRef.current?.getDuration?.() ?? 0;
//     const percent =
//       duration > 0 ? Math.round((progressSeconds / duration) * 100) : 0;

//     const row = {
//       user_id: user.id,
//       video_id: videoId,
//       status,
//       progress_seconds: Math.floor(progressSeconds),
//       duration_seconds: Math.floor(duration),
//       progress_percent: percent,
//       last_played_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       title: videoDetails?.title ?? null,
//       description: videoDetails?.description ?? null,
//     };

//     const { error } = await supabase
//       .from("video_history")
//       .upsert(row, { onConflict: "user_id,video_id" });

//     if (error) {
//       console.error("❌ Failed to save progress:", error);
//     }
//   };

//   const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
//     playerRef.current = event.target;
//   };

//   const startInterval = () => {
//     if (intervalRef.current) return;

//     intervalRef.current = setInterval(() => {
//       if (!playerRef.current) return;
//       const current = playerRef.current.getCurrentTime();
//       const duration = playerRef.current.getDuration();

//       saveProgress("playing", Math.floor(current));
//     }, 10000);
//   };

//   const stopInterval = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   // save on unload / navigate away
//   useEffect(() => {
//     const beforeUnload = () => {
//       if (playerRef.current) {
//         const t = playerRef.current.getCurrentTime();
//         saveProgress("paused", Math.floor(t));
//       }
//     };
//     window.addEventListener("beforeunload", beforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", beforeUnload);
//       stopInterval();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, videoId, videoDetails]);

//   //to prevent multiple calls
//   const streakUpdatedRef = useRef(false);
//   // Add this function inside your component
// const updateStreak = async () => {
//     console.log("🔥 Updating streak...", { user, videoId, videoDetails });
//   if (!user || !videoId || !videoDetails) return;

//   fetch("/api/update-streak", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId: user.id,
//       videoId,
//       title: videoDetails.title || null,
//     }),
//   })
//     .then((res) => res.json())
//     .then((data) => console.log("🔥 Streak response:", data))
//     .catch((err) => console.error("❌ Failed to update streak:", err));
// };


//   if (!videoId) return <div>No video id</div>;
//   if (!user) return <div>Please log in to track watch history.</div>;


  
//   const onStateChange = (event: YouTubeEvent<YouTubePlayer>) => {
//   const state = event.data;
//   const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
//   const duration = playerRef.current?.getDuration?.() ?? 0;

//   // Only update streak once per video
//   if (!streakUpdatedRef.current) {
//     // Update streak after 10% watched
//     if (duration > 0 && currentTime >= duration * 0.1) {
//       streakUpdatedRef.current = true;
//       updateStreak();
//     }
//   }

//   if (state === window.YT?.PlayerState?.PLAYING) {
//     startInterval();
//     saveProgress("started", Math.floor(currentTime));
//   } else if (state === window.YT?.PlayerState?.PAUSED) {
//     stopInterval();
//     saveProgress("paused", Math.floor(currentTime));
//   } else if (state === window.YT?.PlayerState?.ENDED) {
//     stopInterval();
//     saveProgress("completed", Math.floor(currentTime));

//     // Fire streak update when video ends (if not already fired)
//     if (!streakUpdatedRef.current) {
//       streakUpdatedRef.current = true;
//       updateStreak();
//     }
//   }
// };


//   //format incoming video duration from youtube json api
//   function formatYouTubeDuration(duration: string): string {
//   const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//   if (!match) return "0:00";

//   const hours = parseInt(match[1] || "0", 10) || 0;
//   const minutes = parseInt(match[2] || "0", 10) || 0;
//   const seconds = parseInt(match[3] || "0", 10) || 0;

//   return hours
//     ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}`
//     : `${minutes}:${seconds.toString().padStart(2, "0")}`;
// }


//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">
//         {videoDetails?.title ?? `Watching ${videoId}`}
//         {`channel title is ${videoDetails?.channelTitle} and views are ${videoDetails?.viewCount}, like count is ${videoDetails?.likeCount} on ${videoDetails?.publishedAt} duration is ${videoDetails?.vidDuration}`}
//       </h1>

//       <YouTube
//         videoId={videoId}
//         opts={{
//           width: "100%",
//           height: "480",
//           playerVars: { rel: 0 },
//         }}
//         onReady={onReady}
//         onStateChange={onStateChange}
//       />

//       {videoDetails?.description && (
//         <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
//           {videoDetails.description}
//         </p>
//       )}

//       <div className="mt-4 text-sm text-muted-foreground">
//         Progress will be saved every 10s, on pause and on video end.
//       </div>
//     </div>
//   );
// }

//original code above

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
  const streakUpdatedRef = useRef(false);

  const [user, setUser] = useState<any | null>(null);
  const [videoDetails, setVideoDetails] = useState<{
    title: string;
    description: string;
    channelTitle: string;
    viewCount: string;
    likeCount: string;
    publishedAt: string;
    vidDuration: string;
  } | null>(null);

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
      if (!videoId) return;
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setVideoDetails({
            title: data.items[0].snippet.title,
            description: data.items[0].snippet.description,
            channelTitle: data.items[0].snippet.channelTitle,
            viewCount: data.items[0].statistics.viewCount,
            likeCount: data.items[0].statistics.likeCount,
            publishedAt: data.items[0].snippet.publishedAt,
            vidDuration: formatYouTubeDuration(data.items[0].contentDetails.duration),
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch video details:", err);
      }
    }
    fetchDetails();
  }, [videoId]);

  // Save progress
  const saveProgress = async (status: string, progressSeconds: number) => {
    if (!user || !videoId) return;
    const duration = playerRef.current?.getDuration?.() ?? 0;
    const percent = duration > 0 ? Math.round((progressSeconds / duration) * 100) : 0;

    const row = {
      user_id: user.id,
      video_id: videoId,
      status,
      progress_seconds: Math.floor(progressSeconds),
      duration_seconds: Math.floor(duration),
      progress_percent: percent,
      last_played_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: videoDetails?.title ?? null,
      description: videoDetails?.description ?? null,
    };

    const { error } = await supabase
      .from("video_history")
      .upsert(row, { onConflict: "user_id,video_id" });

    if (error) console.error("❌ Failed to save progress:", error);
  };

  const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
    playerRef.current = event.target;
  };

  const startInterval = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      const current = playerRef.current.getCurrentTime();
      saveProgress("playing", Math.floor(current));
    }, 10000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Save on unload
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
  }, [user, videoId, videoDetails]);

  // Update streak API
  const updateStreak = async () => {
    console.log("🔥 Attempting to update streak", { user, videoId, videoDetails });
    if (!user || !videoId || !videoDetails) {
      console.log("❌ updateStreak skipped because values missing");
      return;
    }

    const res = await fetch("/api/update-streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        videoId,
        title: videoDetails.title || null,
      }),
    });
    const data = await res.json();
    console.log("🔥 Streak response:", data);
  };

  // Call streak once both user and videoDetails are ready
  useEffect(() => {
    if (!user || !videoDetails || !videoId) return;

    if (!streakUpdatedRef.current) {
      streakUpdatedRef.current = true;
      updateStreak();
    }
  }, [user, videoDetails, videoId]);

  // Handle YouTube state changes
  const onStateChange = (event: YouTubeEvent<YouTubePlayer>) => {
    const state = event.data;
    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
    const duration = playerRef.current?.getDuration?.() ?? 0;

    // Optional: update streak after 10% watched
    if (!streakUpdatedRef.current && duration > 0 && currentTime >= duration * 0.1) {
      streakUpdatedRef.current = true;
      updateStreak();
    }

    if (state === window.YT?.PlayerState?.PLAYING) {
      startInterval();
      saveProgress("started", Math.floor(currentTime));
    } else if (state === window.YT?.PlayerState?.PAUSED) {
      stopInterval();
      saveProgress("paused", Math.floor(currentTime));
    } else if (state === window.YT?.PlayerState?.ENDED) {
      stopInterval();
      saveProgress("completed", Math.floor(currentTime));

      if (!streakUpdatedRef.current) {
        streakUpdatedRef.current = true;
        updateStreak();
      }
    }
  };

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

  if (!videoId) return <div>No video id</div>;
  if (!user) return <div>Please log in to track watch history.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {videoDetails?.title ?? `Watching ${videoId}`}
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

      {videoDetails?.description && (
        <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
          {videoDetails.description}
        </p>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        Progress will be saved every 10s, on pause and on video end.
      </div>
    </div>
  );
}
