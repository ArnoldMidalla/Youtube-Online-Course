"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function YouTubeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; title: string; thumbnail: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYouTubeResults = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `/api/youtube-search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        if (data.items) {
          setResults(
            data.items.map((item: any) => ({
              id: item.id.videoId || item.id.playlistId, // ✅ works for both
              type: item.id.kind?.includes("playlist") ? "playlist" : "video", // ✅ added type
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.default.url,
            }))
          );
        }
      } catch (err) {
        console.error("YouTube search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchYouTubeResults, 500); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Input */}
      <Input
        type="search"
        placeholder="Search YouTube..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Loading State */}
      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}

      {/* Results */}
      <div className="space-y-3">
        {results.length === 0 && !loading && query && (
          <p className="text-sm text-muted-foreground">No results found.</p>
        )}

        {results.map((video) => (
          <Link href={video.type === "playlist"
                  ? `/playlist/${video.id}`
                  : `/video/${video.id}`}
            key={`${video.type}-${video.id}`}
            className="flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-muted"
            // onClick={() => router.push(`/video/${video.id}`)}
            // onClick={() =>
            //   router.push(
            //     video.type === "playlist"
            //       ? `/playlist/${video.id}` // ✅ route for playlist
            //       : `/video/${video.id}` // ✅ route for video
            //   )
            // }
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 h-10 rounded object-cover"
            />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {video.type === "playlist" ? "📂 Playlist" : "▶ Video"}
              </span>
              <p className="text-sm font-medium line-clamp-2">{video.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
