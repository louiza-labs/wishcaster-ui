"use client"

import { useCallback, useEffect, useState } from "react"
import { useBoundStore } from "@/store"

import { getUserFromSessionsTable } from "@/app/actions"

const useGetSession = (user: any, intervalDuration = 1000) => {
  const [session, setSession] = useState({})
  const [isFetching, setIsFetching] = useState(true)

  const isConnectedToNotion = useBoundStore(
    (state: any) => state.isConnectedToNotion
  )
  const setIsConnectedToNotion = useBoundStore(
    (state: any) => state.setIsConnectedToNotion
  )

  const isConnectedToLinear = useBoundStore(
    (state: any) => state.isConnectedToLinear
  )
  const setIsConnectedToLinear = useBoundStore(
    (state: any) => state.setIsConnectedToLinear
  )

  const setIsConnectedToTwitter = useBoundStore(
    (state: any) => state.setIsConnectedToTwitter
  )

  const fetchIdentities = useCallback(async () => {
    try {
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
    } catch (error) {}
  }, [setIsConnectedToNotion, setIsConnectedToLinear, setIsConnectedToTwitter])

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchIdentities()

        // Stop fetching if both connections are established
        if (isConnectedToNotion && isConnectedToLinear) {
          setIsFetching(false)
          clearInterval(interval)
        }
      }, intervalDuration)

      return () => clearInterval(interval)
    }
  }, [
    user,
    isConnectedToNotion,
    isConnectedToLinear,
    fetchIdentities,
    intervalDuration,
  ])

  return {
    session,
    isFetching,
  }
}

export default useGetSession
