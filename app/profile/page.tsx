"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Loading from "../loading";

export default function Dashboard() {
  const supabase = createClient();
  const [streak, setStreak] = useState<{
    current: number;
    longest: number;
    last_date: string;
    title: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      // Fetch streak data
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

    fetchData();
  }, [supabase]);

  //tweaking date
  // Function to get the correct ordinal suffix for a day number
  function getDaySuffix(day: number) {
    if (day === 1 || day === 21 || day === 31) {
      return "st";
    } else if (day === 2 || day === 22) {
      return "nd";
    } else if (day === 3 || day === 23) {
      return "rd";
    } else {
      return "th";
    }
  }

  //date edit
  // Step 1: Parse the ISO string into a Date object
  const date = new Date(user?.created_at);
  // Step 2: Extract the components
  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[date.getMonth()];
  // Step 3: Format the string
  // const formattedDate = `${day}${getDaySuffix(day)} ${monthName}, ${year}`;

  const formattedDate = `${monthName}, ${year}`;

  return (
    <section className=" flex flex-col items-center">
      <section>
        <div className="h-50 w-140 overflow-hidden rounded-lg">
          <img
            src="/Default@1080x-100.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight ">
            {user?.user_metadata?.name}
          </h1>
          <p className="text-sm font-medium text-gray-800">{user?.email}</p>
          <p className="text-sm font-medium text-gray-800">
            Joined {formattedDate}
          </p>
        </div>
        <h2 className="font-semibold">Statistics</h2>
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-purple-50 border-2 border-purple-900 rounded-md py-2 px-4">
            <h2 className="font-extrabold text-2xl text-purple-900">{streak?.current}</h2>
            <p className="font-semibold text-sm text-purple-900">Day Streak</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-900 rounded-md py-2 px-4">
            <h2 className="font-extrabold text-2xl text-purple-900">{streak?.longest}</h2>
            <p className="font-semibold text-sm text-purple-900">Longest Streak</p>
          </div>
          {/* <div>
            <h1></h1>
            <p>Hours watched</p>
          </div> */}
        </div>
      </section>
    </section>
  );
}
