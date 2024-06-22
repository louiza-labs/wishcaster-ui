import { createClient } from "@/clients/supabase/server"

import AccountContainer from "@/components/account/"
import { getAccount } from "@/app/actions/account"

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const enrichedUser = user ? await getAccount(user.id) : {}
  return (
    <div className="p-10">
      {enrichedUser && enrichedUser.email ? (
        <AccountContainer user={enrichedUser} />
      ) : user ? (
        <p>{JSON.stringify(user)}</p>
      ) : (
        <p>waaat</p>
      )}
    </div>
  )
}
