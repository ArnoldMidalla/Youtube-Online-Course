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
  return (<>
  <h1>Good morning {user?.user_metadata?.name}</h1>
  </>);
}
