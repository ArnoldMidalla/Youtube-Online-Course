"use client";
import useSWR from "swr";

export default function StreakDisplay({ userId }: { userId: string }) {
  const { data } = useSWR(`/api/get-streak?userId=${userId}`, url => fetch(url).then(res => res.json()));

  console.log(data?.streak ?? 0)
  return (
    <div className="p-4 rounded-xl bg-yellow-100 text-yellow-800">
      🔥 Streak: {data?.streak ?? 0} days
    </div>
  );
}
