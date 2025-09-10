"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const supabase = createClient();
  const [streak, setStreak] = useState<{
    current: number;
    longest: number;
    last_date: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch("/api/get-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await res.json();
      console.log("📊 Streak data:", result);

      if (result.streak) {
        setStreak(result.streak);
      }
    }

    fetchStreak();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔥 Your Streak</h2>
      {streak ? (
        <div>
          <p>Current streak: {streak.current} days</p>
          <p>Longest streak: {streak.longest} days</p>
          <p>Last watched: {new Date(streak.last_date).toDateString()}</p>
          <p>Last video watched: {streak.title || `no title`}</p>
        </div>
      ) : (
        <p>No streak data yet.</p>
      )}
    </div>
  );
}
