"use client"

import { useNeynarContext } from "@neynar/react"
import { useSession } from "next-auth/react"

import useGetUser from "@/hooks/auth/useGetUser"

const useAccount = () => {
  const { data: userLinearSession } = useSession()
  const { user: farcasterUserSession } = useNeynarContext()
  const { userFromAuth } = useGetUser()

  return {
    userAccount: {
      linear: userLinearSession,
      farcaster: farcasterUserSession,
      auth: userFromAuth,
    },
  }
}

export default useAccount
