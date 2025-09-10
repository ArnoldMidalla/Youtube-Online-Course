// /app/api/update-streak/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { userId, videoId, title } = await req.json();

    if (!userId || !videoId) {
      return NextResponse.json({ error: "Missing userId or videoId" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    // 1. Get existing streak for user
    const { data: streak, error: fetchError } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error fetching streak:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let current = 1;
    let longest = 1;

    if (streak) {
      const lastDate = new Date(streak.last_date);
      const diff =
        Math.floor(
          (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

      if (diff === 1) {
        current = streak.current + 1;
        longest = Math.max(streak.longest, current);
      } else if (diff === 0) {
        current = streak.current;
        longest = streak.longest;
      } else {
        current = 1;
        longest = streak.longest;
      }
    }

    // 2. Update / insert streak
    const { error: updateError } = await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current,
          longest,
          last_date: today,
          last_video_id: videoId,
          last_video_title: title || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (updateError) {
      console.error("❌ Error updating streak:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log("✅ Streak updated:", { current, longest });

    return NextResponse.json({ success: true, current, longest });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
