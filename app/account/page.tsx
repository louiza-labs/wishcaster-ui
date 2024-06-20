import { createClient } from "@/clients/supabase/server"

import AccountContainer from "@/components/account/"

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountContainer user={user} />
}
