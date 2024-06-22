"use client"

import { useState } from "react"
import { NeynarAuthButton, useNeynarContext } from "@neynar/react"
import { signIn, signOut, useSession } from "next-auth/react"

import useGetUser from "@/hooks/auth/useGetUser"
import IntegrationsCard from "@/components/account/integrations/IntegrationsCard"
import { connectNotionAccount, connectTwitterAccount } from "@/app/actions"

const Integrations = () => {
  const [linearRes, setLinearRes] = useState({})
  const { data: session, status } = useSession()
  console.log("the session", session)

  const { userFromAuth } = useGetUser()
  console.log("the user from auth", userFromAuth)
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
      image: "",
      onClick: isAuthenticated ? logoutUser : () => {},
      description: "Connect your Farcaster account",
      customButton: NeynarAuthButton,
      isConnected: isAuthenticated,
    },
    {
      label: "Twitter",
      image: "",
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
      image: "",

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
      image: "",

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

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-10 ">
      <div className=" flex  w-full flex-wrap justify-center lg:grid-cols-3 lg:gap-10">
        {integrationOptions.map((integration: any) => (
          <IntegrationsCard
            title={integration.label}
            description={integration.description}
            image={integration.image}
            handleClick={integration.onClick}
            isConnected={integration.isConnected}
            key={integration.label}
          />
        ))}
      </div>
    </div>
  )
}

export default Integrations
