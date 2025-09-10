"use client"

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  
  const supabase = await createClient()
  const streaks = await supabase.from('streaks').select(`
      current,
    `)
  
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        redirect('/login')
      }
    return(
        <section>
        <h1>Welcome back {data.user.user_metadata.name}</h1>
        current streak is 
        </section>
    )
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";

// export default function ProfilePage() {
//   const supabase = createClient();
//   const [user, setUser] = useState<any | null>(null);
//   const [streak, setStreak] = useState<{ current: number; longest: number; last_date: string } | null>(null);

//   // ✅ Load user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       if (data.user) {
//         setUser(data.user);

//         // fetch streak for this user
//         fetch("/api/get-streak", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: data.user.id }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.streak) setStreak(data.streak);
//           })
//           .catch((err) => console.error("❌ Failed to fetch streak:", err));
//       }
//     });
//   }, [supabase]);

//   if (!user) return <div>Please log in to view your profile</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">👤 {user.email}</h1>

//       {streak ? (
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-lg">🔥 Current Streak: <strong>{streak.current} days</strong></p>
//           <p className="text-lg">🏆 Longest Streak: <strong>{streak.longest} days</strong></p>
//           <p className="text-sm text-gray-500">Last watched: {streak.last_date}</p>
//         </div>
//       ) : (
//         <p className="text-gray-500">No streak data yet.</p>
//       )}
//     </div>
//   );
// }
