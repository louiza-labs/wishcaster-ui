"use client"

import { useMemo } from "react"
import { useBoundStore } from "@/store"
import { NeynarAuthButton, useNeynarContext } from "@neynar/react"
import { signIn } from "next-auth/react"

import useGetUser from "@/hooks/auth/useGetUser"
import { connectNotionAccount } from "@/app/actions"

const useIntegrations = () => {
  const {
    isLoggedIn,
    isConnectedToNotion,
    isConnectedToLinear,
    isConnectedToTwitter,
  } = useBoundStore((state: any) => state)
  const { userFromAuth } = useGetUser()

  const handleConnectNotion = async () => {
    const res = isLoggedIn ? logoutUser() : await connectNotionAccount()
  }

  const handleSignIntoNotion = async () => {
    try {
      const signInRes = await connectNotionAccount()
    } catch (e) {}
    // first sign in
    // if successfull
    // get the users access token and refresh token from the session
    // update the DB with the session info
  }
  const handleConnectLinear = async () => {
    try {
      const res = await signIn("linear")
    } catch (e) {
      console.log("error trying to connect ot linear", e)
    }
  }
  // FarcasterIntegration
  const { logoutUser, isAuthenticated } = useNeynarContext()
  const integrationOptions = useMemo(() => {
    return [
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
        isConnected:
          // userFromAuth &&
          // userFromAuth.role === "authenticated" &&
          isConnectedToNotion,
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
        isConnected:
          // userFromAuth &&
          // userFromAuth.role === "authenticated" &&
          isConnectedToLinear,
        features: [
          { label: "Create issues for posts", status: "pending" },
          { label: "Create a project for posts", status: "pending" },
        ],
      },
    ]
  }, [isConnectedToLinear, isConnectedToNotion, isConnectedToTwitter])
  const connectedIntegrationImages = integrationOptions
    .filter((integration: any) => integration.isConnected)
    .map((integrationOption) => integrationOption.image)

  return {
    integrationOptions,
    connectedIntegrationImages,
  }
}

export default useIntegrations
