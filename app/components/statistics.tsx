"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Statistics() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);
    }

    fetchData();
  }, [supabase]);
  return (
        <section className="w-70 flex flex-col items-center py-10 gap-4 bg-white rounded-xl">
      <div className="size-30 overflow-hidden rounded-full">

        <img
          src={user?.user_metadata?.picture}
          alt=""
                    className="object-cover size-full"

        />
      </div>
            <h1 className="text-sm font-medium flex flex-col items-center leading-1">

        Good morning
        <br />
         <span className="font-bold text-lg break-words max-w-full">{user?.user_metadata?.name}</span>
        <p className="text-center text-xs font-medium text-gray-500 mt-2">
          continue learning to achieve your goal
        </p>
      </h1>
    </section>
  );
}
