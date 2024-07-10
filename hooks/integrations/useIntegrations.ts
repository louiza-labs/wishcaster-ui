"use client"

import { useEffect, useMemo } from "react"
import { useBoundStore } from "@/store"
import { useNeynarContext } from "@neynar/react"
import { signIn, signOut } from "next-auth/react"

import {
  connectGithubAccount,
  connectNotionAccount,
  disconnectUsersSocialAccountFromDB,
  getUserFromSessionsTable,
} from "@/app/actions"

const useIntegrations = () => {
  const {
    isLoggedIn,
    isConnectedToNotion,
    isConnectedToLinear,
    isConnectedToTwitter,
    isConnectedToGithub,
  } = useBoundStore((state: any) => state)
  const {
    logoutUser,
    isAuthenticated,
    user: farcasterUser,
  } = useNeynarContext()

  const setIsConnectedToNotion = useBoundStore(
    (state: any) => state.setIsConnectedToNotion
  )

  const setIsConnectedToLinear = useBoundStore(
    (state: any) => state.setIsConnectedToLinear
  )

  const setIsConnectedToTwitter = useBoundStore(
    (state: any) => state.setIsConnectedToTwitter
  )

  const setIsConnectedToGithub = useBoundStore(
    (state: any) => state.setIsConnectedToGithub
  )

  const updateIdentities = async () => {
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
      if (sessionRes.github_access_token) {
        setIsConnectedToGithub(true)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (farcasterUser && farcasterUser.fid) {
      updateIdentities()
    }
  }, [farcasterUser])

  const handleSignIntoGithub = async () => {
    if (farcasterUser && farcasterUser.custody_address) {
      try {
        const signInRes = await connectGithubAccount(
          farcasterUser?.custody_address
        )
      } catch (e) {}
    } else {
    }
  }

  const handleSignIntoNotion = async () => {
    if (farcasterUser && farcasterUser.custody_address) {
      try {
        const signInRes = await connectNotionAccount(
          farcasterUser.custody_address
        )
      } catch (e) {}
      // first sign in
      // if successfull
      // get the users access token and refresh token from the session
      // update the DB with the session info
    } else {
      return
    }
  }
  const handleConnectLinear = async () => {
    try {
      const signInRes = await signIn("linear", undefined, {
        farcaster_id: String(farcasterUser?.fid),
      })
      const resForUpdatingUserState = await updateIdentities()
    } catch (e) {
      // console.log("error trying to connect ot linear", e)
    }
  }

  const handleDisconnectLinear = async () => {
    if (isConnectedToLinear && farcasterUser && farcasterUser.fid) {
      try {
        // first remove users data
        const resForDisconnectingDBData =
          await disconnectUsersSocialAccountFromDB("linear", farcasterUser.fid)

        if (
          resForDisconnectingDBData &&
          resForDisconnectingDBData?.resultForRemovingUsersAccessTokens &&
          resForDisconnectingDBData?.resultForRemovingUsersAccessTokens
            .error === null
        ) {
          setIsConnectedToLinear(false)
        }
        // then destroy login session
        const resForDestroyingSession = await signOut()
        const resForUpdatingUserState = await updateIdentities()
      } catch (e) {}
    }
  }

  const handleDisconnectNotion = async () => {
    try {
      if (!(farcasterUser && farcasterUser.fid)) return
      const resForRemovingUserSessionFromDB =
        await disconnectUsersSocialAccountFromDB("notion", farcasterUser.fid)

      if (
        resForRemovingUserSessionFromDB &&
        resForRemovingUserSessionFromDB?.resultForRemovingUsersAccessTokens &&
        resForRemovingUserSessionFromDB?.resultForRemovingUsersAccessTokens
          .error === null
      ) {
        setIsConnectedToNotion(false)
      }
      const resForUpdatingUserState = await updateIdentities()
    } catch (e) {}
  }

  const handleDisconnectGithub = async () => {
    try {
      if (!(farcasterUser && farcasterUser.fid)) return
      const resForRemovingUserSessionFromDB =
        await disconnectUsersSocialAccountFromDB("github", farcasterUser.fid)
      if (
        resForRemovingUserSessionFromDB &&
        resForRemovingUserSessionFromDB?.resultForRemovingUsersAccessTokens &&
        resForRemovingUserSessionFromDB?.resultForRemovingUsersAccessTokens
          .error === null
      ) {
        setIsConnectedToGithub(false)
      }
      const resForUpdatingUserState = await updateIdentities()
    } catch (e) {}
  }

  // FarcasterIntegration
  const integrationOptions = useMemo(() => {
    if (!(farcasterUser && farcasterUser.fid)) return []
    return [
      // {
      //   label: "Farcaster",
      //   image: "/social-account-logos/farcaster-purple-white.png",
      //   onClick: isAuthenticated ? logoutUser : () => {},
      //   description: "Connect your Farcaster account",
      //   customButton: NeynarAuthButton,
      //   isConnected: isAuthenticated,
      //   features: [
      //     { label: "See your casts and reactions", status: "live" },
      //     {
      //       label: "Filter on users you are followed by & follow",
      //       status: "live",
      //     },
      //     { label: "Create bounties using Bountycaster", status: "live" },
      //   ],
      // },
      {
        label: "Notion",
        image: "/social-account-logos/notion-logo.png",

        onClick: isConnectedToNotion
          ? handleDisconnectNotion
          : handleSignIntoNotion,
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

        onClick: isConnectedToLinear
          ? handleDisconnectLinear
          : handleConnectLinear,
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
      {
        label: "Github",
        image: "/social-account-logos/github-mark.png",

        onClick: isConnectedToGithub
          ? handleDisconnectGithub
          : handleSignIntoGithub,
        description: "Connect your Github account",
        isConnected:
          // userFromAuth &&
          // userFromAuth.role === "authenticated" &&
          isConnectedToGithub,
        features: [
          { label: "Create a repo for a post", status: "pending" },
          { label: "Create a project for posts", status: "pending" },
        ],
      },
    ]
  }, [
    isConnectedToLinear,
    isConnectedToNotion,
    isConnectedToGithub,
    isConnectedToTwitter,
    farcasterUser,
  ])
  const connectedIntegrationImages = integrationOptions
    .filter((integration: any) => integration.isConnected)
    .map((integrationOption) => integrationOption.image)

  return {
    integrationOptions,
    connectedIntegrationImages,
  }
}

export default useIntegrations
