"use client"

import { useState } from "react"
import { useBoundStore } from "@/store"
import { NeynarAuthButton, useNeynarContext } from "@neynar/react"
import { signIn, signOut, useSession } from "next-auth/react"

import useGetUser from "@/hooks/auth/useGetUser"
import { connectNotionAccount } from "@/app/actions"

const useIntegrations = () => {
  const [linearRes, setLinearRes] = useState({})
  const { data: session, status } = useSession()
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn)
  const { userFromAuth } = useGetUser()

  const handleConnectNotion = async () => {
    const res = isLoggedIn ? logoutUser() : await connectNotionAccount()
  }
  const handleConnectLinear = async () => {
    const res =
      session && session.user ? await signOut() : await signIn("linear")
  }
  // FarcasterIntegration
  const { logoutUser, isAuthenticated } = useNeynarContext()
  console.log("the user from auth", userFromAuth)
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

      onClick: handleConnectNotion,
      description: "Connect your Notion account",
      isConnected: userFromAuth.role === "authenticated",
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
