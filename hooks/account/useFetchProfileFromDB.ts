"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/clients/supabase/client"
import { type User } from "@supabase/supabase-js"

const useFetchProfileFromDB = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({})
  const [errorLoading, setErrorLoading] = useState(false)

  const getProfile = useCallback(async () => {
    const supabase = createClient()
    try {
      setLoading(true)
      setErrorLoading(false)

      const { data, error, status } = await supabase
        .from("users")
        .select(`name, email`)
        .eq("id", user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      setErrorLoading(true)

      console.log("the err", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  return {
    profile,
    loading,
  }
}

export default useFetchProfileFromDB
