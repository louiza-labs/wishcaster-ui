"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/clients/supabase/client"

const useGetUser = () => {
  const [userFromAuth, setUserFromAuth] = useState<any>({})

  const fetchUserFromSupabase = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUserFromAuth(user)
  }

  useEffect(() => {
    fetchUserFromSupabase()
  }, [])
  return {
    userFromAuth,
  }
}

export default useGetUser
