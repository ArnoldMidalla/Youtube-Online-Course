import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
    const supabase = await createClient()
    
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        redirect('/login')
      }
    return(
        <section>
        <h1>Welcome back {data.user.user_metadata.name}</h1>
        </section>
    )
}