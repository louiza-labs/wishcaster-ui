"use client"

import { useEffect } from "react"
import { createClient } from "@/clients/supabase/client"
import { useBoundStore } from "@/store"
import { useNeynarContext } from "@neynar/react"

const useSubscribeToSessionChanges = () => {
  const { user: farcasterUser } = useNeynarContext()

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

  const isConnectedToGithub = useBoundStore(
    (state: any) => state.isConnectedToGithub
  )
  const setIsConnectedToGithub = useBoundStore(
    (state: any) => state.setIsConnectedToGithub
  )
  // This is meant to help update client state whenever there is a server-side change that would not be picked up via the farcaster connection so we don't need to ping a bunch of calls
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("realtime session updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
        },
        (payload) => {
          const update = payload.new
          const fidForUserWhoMadeUpdate = update.id
          // check if farcaster id matches logged in
          const loggedInFarcasterId = farcasterUser?.fid
          if (fidForUserWhoMadeUpdate === loggedInFarcasterId && update) {
            // now we want to get the access tokens and update state
            const {
              github_access_token,
              linear_access_token,
              notion_access_token,
              twitter_access_token,
            } = update
            if (notion_access_token) {
              setIsConnectedToNotion(true)
            } else if (!notion_access_token) {
              setIsConnectedToNotion(false)
            }
            if (linear_access_token) {
              setIsConnectedToLinear(true)
            } else if (!linear_access_token) {
              setIsConnectedToLinear(false)
            }
            if (twitter_access_token) {
              setIsConnectedToTwitter(true)
            } else if (!twitter_access_token) {
              setIsConnectedToTwitter(false)
            }
            if (github_access_token) {
              setIsConnectedToGithub(true)
            } else if (!github_access_token) {
              setIsConnectedToGithub(false)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [
    setIsConnectedToGithub,
    setIsConnectedToLinear,
    setIsConnectedToNotion,
    setIsConnectedToTwitter,
    farcasterUser?.fid,
  ])
}

export default useSubscribeToSessionChanges
