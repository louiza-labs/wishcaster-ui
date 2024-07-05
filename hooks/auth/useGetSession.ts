"use client"

import { useEffect, useState } from "react"
import { useBoundStore } from "@/store"

import { getUserFromSessionsTable } from "@/app/actions"

const useGetSession = (user: any) => {
  const [session, setSession] = useState({})
  const setIsConnectedToNotion = useBoundStore(
    (state: any) => state.setIsConnectedToNotion
  )
  const setIsConnectedToLinear = useBoundStore(
    (state: any) => state.setIsConnectedToLinear
  )
  const setIsConnectedToTwitter = useBoundStore(
    (state: any) => state.setIsConnectedToTwitter
  )
  const fetchIdentities = async () => {
    const sessionRes = await getUserFromSessionsTable()
    if (sessionRes.notion_access_token) {
      setIsConnectedToNotion(true)
    }
    if (sessionRes.linear_access_token) {
      setIsConnectedToLinear(true)
    }
    if (sessionRes.twitter_access_token) {
      setIsConnectedToTwitter(true)
    }
    setSession(sessionRes)
  }

  useEffect(() => {
    if (user) {
      fetchIdentities()
    }
  }, [user])

  return {
    session,
  }
}

export default useGetSession
