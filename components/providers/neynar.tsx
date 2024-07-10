"use client"

import { createClient } from "@/clients/supabase/client"
import { NeynarContextProvider, Theme } from "@neynar/react"

import "@neynar/react/dist/style.css"

export default function NeynarProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // functions for creating a userSession table row
  // 1. Fetch users fid from table
  const fetchUserFIDFromSessionsTable = async (fid: Number) => {
    const supabase = createClient()
    const resForId = await supabase
      .from("sessions")
      .select("farcaster_id")
      .eq("farcaster_id", fid)
    const fidFromDB =
      resForId.data && resForId.data.length
        ? resForId.data[0].farcaster_id
        : null
    return fidFromDB
  }
  // 2. Create session row with fid

  const createUserSessionRowInSessionsTable = async (fid: Number) => {
    const supabase = createClient()

    let baseObject: any = {
      notion_access_token: "",
      notion_refresh_token: "", // Add this line
      twitter_access_token: "",
      twitter_refresh_token: "", // Add this line
      github_access_token: "",
      github_refresh_token: "",
      farcaster_id: fid,
      email: "",
      id: fid,
    }
    const resForInsertingData = await supabase
      .from("sessions")
      .insert(baseObject)
  }

  // 3. create user via auth
  const createAuthUser = async (fid: Number, address: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: `${address}@email.com`,
      password: address,
      options: {
        data: {
          farcaster_id: fid,
        },
      },
    })

    if (error) {
      // login instead
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${address}@email.com`,
        password: address,
      })
    }
  }

  return (
    <>
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
          defaultTheme: Theme.Light,
          eventsCallbacks: {
            onAuthSuccess: async (params) => {
              const { user } = params
              // create a user session table row
              const userFID = user.fid
              const userCustodyAddress = user.custody_address

              const resForAuthingUser = await createAuthUser(
                userFID,
                userCustodyAddress
              )
              // check if user already is in db
              const userFromDB = await fetchUserFIDFromSessionsTable(userFID)
              // if user is not in the db
              if (!userFromDB) {
                const resForCreatingUser =
                  await createUserSessionRowInSessionsTable(userFID)
              }
            },

            onSignout() {},
          },
        }}
      >
        {children}
      </NeynarContextProvider>
    </>
  )
}
