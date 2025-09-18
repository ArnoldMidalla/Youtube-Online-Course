"use client"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export function GoogleButton() {
  const supabase = createClient()

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, 
      },
    })
    if (error) console.error(error)
  }

  return (
    <Button
      onClick={signIn}
      className="px-4 py-2 border-1 rounded-md text-sm font-medium flex gap-2 items-center bg-white text-black hover:text-white hover:bg-black"
    >
      <img src="/GoogleIcon.svg" alt="" className="w-5" />Continue with Google
    </Button>
  )
}
