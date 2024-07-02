"use client"

import { useState } from "react"
import { useBoundStore } from "@/store"
import { NeynarAuthButton, useNeynarContext } from "@neynar/react"
import { signIn, signOut, useSession } from "next-auth/react"

import useGetUser from "@/hooks/auth/useGetUser"
import {
  connectNotionAccount,
  getUserSession,
  updateUserSessionInfoInDB,
} from "@/app/actions"

const useIntegrations = () => {
  const [linearRes, setLinearRes] = useState({})
  const { data: session, status } = useSession()
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn)
  const { userFromAuth } = useGetUser()

  const handleConnectNotion = async () => {
    const res = isLoggedIn ? logoutUser() : await connectNotionAccount()
  }

  const handleSignIntoNotion = async () => {
    try {
      const signInRes = await connectNotionAccount()
      // get users session
      const currentSession = await getUserSession()
      if (currentSession && currentSession.provider_token) {
        const providerToken = currentSession.provider_token
        const refreshToken = currentSession.provider_refresh_token
        const userId = userFromAuth.id
        alert("pizza")
        const updateSessionRes = await updateUserSessionInfoInDB(
          "notion",
          providerToken,
          refreshToken,
          userId
        )
        console.log(updateSessionRes)
      }
    } catch (e) {}
    // first sign in
    // if successfull
    // get the users access token and refresh token from the session
    // update the DB with the session info
  }
  const handleConnectLinear = async () => {
    const res =
      session && session.user ? await signOut() : await signIn("linear")
  }
  // FarcasterIntegration
  const { logoutUser, isAuthenticated } = useNeynarContext()
  const integrationOptions = [
    {
      label: "Farcaster",
      image: "/social-account-logos/farcaster-purple-white.png",
      onClick: isAuthenticated ? logoutUser : () => {},
      description: "Connect your Farcaster account",
      customButton: NeynarAuthButton,
      isConnected: isAuthenticated,
      features: [
        { label: "See your casts and reactions", status: "live" },
        {
          label: "Filter on users you are followed by & follow",
          status: "live",
        },
        { label: "Create bounties using Bountycaster", status: "live" },
      ],
    },
    {
      label: "Notion",
      image: "/social-account-logos/notion-logo.png",

      onClick: handleSignIntoNotion,
      description: "Connect your Notion account",
      isConnected: userFromAuth && userFromAuth.role === "authenticated",
      features: [
        { label: "Create pages for posts", status: "pending" },
        { label: "Add a post to a DB", status: "pending" },
      ],
    },
    {
      label: "Linear",
      image: "/social-account-logos/linear-company-icon.svg",

      onClick: handleConnectLinear,
      description: "Connect your Linear account",
      isConnected: isLoggedIn,
      features: [
        { label: "Create issues for posts", status: "pending" },
        { label: "Create a project for posts", status: "pending" },
      ],
    },
  ]
  const connectedIntegrationImages = integrationOptions
    .filter((integration: any) => integration.isConnected)
    .map((integrationOption) => integrationOption.image)

  return {
    integrationOptions,
    connectedIntegrationImages,
  }
}

export default useIntegrations
