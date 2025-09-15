"use client";
import React, { useEffect, useState } from "react";

interface CourseComponentsProps {
  title: string;
  description?: string;
  number?: string;
  categoryId?: string;
  query: string;
}

export default function YouTubeCategoryVideos({
  title,
  categoryId,
  query,
}: CourseComponentsProps) {
  const [items, setItems] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const QUERY = query || "tutorial";

  function formatDuration(iso?: string) {
    if (!iso) return "0:00";
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";
    const [, h = "0", m = "0", s = "0"] = match;
    const hh = parseInt(h, 10);
    const mm = String(parseInt(m, 10)).padStart(2, "0");
    const ss = String(parseInt(s, 10)).padStart(2, "0");
    return hh ? `${hh}:${mm}:${ss}` : `${parseInt(m, 10)}:${ss}`;
  }

  // helper to produce a stable id for mixed items
  function getItemId(item: any) {
    // videos from videos.list: item.id (string)
    if (typeof item.id === "string") return item.id;
    // search results: item.id.{videoId|playlistId}
    if (item.id?.videoId) return item.id.videoId;
    if (item.id?.playlistId) return item.id.playlistId;
    // fallback
    return JSON.stringify(item).slice(0, 24);
  }

  async function fetchVideos(pageToken?: string) {
    setLoading(true);
    setError(null);

    if (!API_KEY) {
      setError("Missing NEXT_PUBLIC_YOUTUBE_API_KEY in your environment.");
      setLoading(false);
      return;
    }

    try {
      // 1) search for videos + playlists
      const searchUrl = new URL(
        "https://www.googleapis.com/youtube/v3/search"
      );
      searchUrl.searchParams.set("part", "snippet");
      // comma-separated allowed: video,playlist (default includes channel too)
      searchUrl.searchParams.set("type", "video,playlist");
      // videoCategoryId applies only to videos (playlists will be ignored)
    //   if (categoryId) searchUrl.searchParams.set("videoCategoryId", categoryId);
      searchUrl.searchParams.set("q", QUERY);
      searchUrl.searchParams.set("maxResults", "6");
      searchUrl.searchParams.set("key", API_KEY);
      if (pageToken) searchUrl.searchParams.set("pageToken", pageToken);

    //   const searchRes = await fetch(searchUrl.toString());
    //   const searchData = await searchRes.json();
    //   console.log("YouTube search response:", searchData);
//instead of calling directly, now were using route and saving in supabase to be more efficient on api usage
const res = await fetch(`/api/youtube-search-categories?query=${QUERY}`);
const searchData = await res.json();


      if (searchData.error) {
        // API returned an error object
        setError(
          `YouTube API error: ${searchData.error.message || "unknown error"}`
        );
        setLoading(false);
        return;
      }

      const searchItems: any[] = searchData.items ?? [];
      if (!searchItems.length) {
        // nothing returned
        setNextPage(searchData.nextPageToken || null);
        setLoading(false);
        // append nothing but keep UI informative
        if (items.length === 0) setError("No results found.");
        return;
      }

      // 2) pull out video ids from search results to fetch details
      const videoIdArray = searchItems
        .filter((it) => it.id?.kind === "youtube#video")
        .map((it) => it.id.videoId)
        .filter(Boolean);

      // 3) fetch details only for videos (duration, stats)
      let detailedVideos: any[] = [];
      if (videoIdArray.length) {
        const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        detailsUrl.searchParams.set("part", "snippet,contentDetails,statistics");
        detailsUrl.searchParams.set("id", videoIdArray.join(","));
        detailsUrl.searchParams.set("key", API_KEY);

        const detailsRes = await fetch(detailsUrl.toString());
        const detailsData = await detailsRes.json();
        console.log("YouTube videos.list response:", detailsData);

        if (detailsData.error) {
          setError(`YouTube videos.list error: ${detailsData.error.message}`);
          setLoading(false);
          return;
        }

        detailedVideos = detailsData.items ?? [];
      }

      // 4) keep playlist search results as-is (they are search resources)
      const playlistSearchResults = searchItems.filter(
        (it) => it.id?.kind === "youtube#playlist"
      );

      // 5) merge results and dedupe by id (videos from videos.list and playlist search results)
      const combined = [...detailedVideos, ...playlistSearchResults];
      const map = new Map<string, any>();
      combined.forEach((it) => {
        map.set(getItemId(it), it);
      });

      // append while avoiding duplicates across pages
      const newList = [...items];
      map.forEach((v, k) => {
        if (!newList.some((x) => getItemId(x) === k)) newList.push(v);
      });

      setItems(newList);
      setNextPage(searchData.nextPageToken || null);
    } catch (err: any) {
      console.error("fetchVideos error:", err);
      setError(err.message || "Unknown fetch error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // reset when category/query changes
    setItems([]);
    setNextPage(null);
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, query]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{title}</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
          <div className="text-xs text-gray-500 mt-1">
            Check console (Network & Console) for raw API responses.
          </div>
        </div>
      )}

      {!error && items.length === 0 && !loading && (
        <div className="mb-4 text-sm text-gray-600">No results yet.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => {
          // detection: videos.list items have item.kind === 'youtube#video'
          // search playlist results have item.id.kind === 'youtube#playlist'
          const isVideo =
            item.kind === "youtube#video" || item.id?.kind === "youtube#video";
          const id = getItemId(item);
          const thumb =
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            "";

          return (
            <div key={id} className="border rounded-lg shadow p-2">
              {thumb ? (
                <img src={thumb} alt={item.snippet?.title} className="w-full rounded-md" />
              ) : (
                <div className="w-full h-28 bg-gray-100 rounded-md" />
              )}

              <h2 className="mt-2 font-semibold text-sm line-clamp-2">
                {item.snippet?.title}
              </h2>
              <p className="text-xs text-gray-600">{item.snippet?.channelTitle}</p>

              {isVideo ? (
                <p className="text-xs mt-1">
                  ⏱ {formatDuration(item.contentDetails?.duration)} • 👀{" "}
                  {item.statistics?.viewCount
                    ? parseInt(item.statistics.viewCount).toLocaleString()
                    : "—"}
                </p>
              ) : (
                <p className="text-xs mt-1">📂 Playlist</p>
              )}
            </div>
          );
        })}
      </div>

      {nextPage && (
        <div className="mt-4">
          <button
            onClick={() => fetchVideos(nextPage)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
