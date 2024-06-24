'use client'


import { NeynarAuthButton, useNeynarContext } from "@neynar/react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"

import { connectNotionAccount, connectTwitterAccount } from "@/app/actions"
import useGetUser from "@/hooks/auth/useGetUser"


const useIntegrations = () => {
  const [linearRes, setLinearRes] = useState({})
  const { data: session, status } = useSession()

  const { userFromAuth } = useGetUser()
  const handleConnectTwitter = async () => {
    const res = await connectTwitterAccount()
  }
  const handleConnectNotion = async () => {
    const res = await connectNotionAccount()
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
    },
    {
      label: "Twitter",
      image: "/social-account-logos/twitter-logo-black.png",
      onClick: handleConnectTwitter,
      description: "Connect your Twitter account",
      isConnected:
        userFromAuth &&
        userFromAuth.user_metadata &&
        userFromAuth.user_metadata.iss &&
        userFromAuth.user_metadata.iss.includes("twitter"),
    },
    {
      label: "Notion",
      image: "/social-account-logos/notion-logo.png",

      onClick: handleConnectNotion,
      description: "Connect your Notion account",
      isConnected:
        userFromAuth &&
        userFromAuth.user_metadata &&
        userFromAuth.user_metadata.iss &&
        userFromAuth.user_metadata.iss.includes("notion"),
    },
    {
      label: "Linear",
      image: "/social-account-logos/linear-company-icon.svg",

      onClick: handleConnectLinear,
      description: "Connect your Linear account",
      isConnected: session && session.user,
    },
    // {
    //   label: "Github",
    //   image: "",

    //   onClick: () => {},
    //   description: "Connect your Github account",
    // },
    // {
    //   label: "Slack",
    //   image: "",

    //   onClick: () => {},
    //   description: "Connect your Slack account",
    // },
    // {
    //   label: "Google",
    //   image: "",

    //   onClick: () => {},
    //   description: "Connect your Google account",
    // },
  ]
  const connectedIntegrationImages = integrationOptions
    .filter((integration: any) => integration.isConnected)
    .map((integrationOption) => integrationOption.image)


    return {
      integrationOptions, 
      connectedIntegrationImages
    }
}

export default useIntegrations