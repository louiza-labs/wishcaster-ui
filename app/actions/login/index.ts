"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/clients/supabase/server"

export async function connectTwitterAccount() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo: `${process.env.API_URL}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}

export async function connectNotionAccount(farcaster_custody_address: string) {
  const supabase = createClient()

  const userIsAuthed = await checkIfUserIsAuthed()
  if (!userIsAuthed) {
    const resultFromReAuthing = await reAuthUser(farcaster_custody_address)
  }

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "notion",
    options: {
      redirectTo: `${process.env.API_URL}/auth/callback`,
    },
  })
  if (error) {
    console.log("error trying to link account", error)
  }
  if (data.url) {
    redirect(`${data.url}`) // use the redirect API for your server framework
  }
}

export async function checkIfUserIsAuthed() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user !== null
}

export async function reAuthUser(custodyAddress: string) {
  const supabase = createClient()
  if (custodyAddress) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${custodyAddress}@email.com`,
        password: custodyAddress,
      })
      return data
    } catch (e) {
      console.log("error trying reauth user", e)
    }
  }
}

export async function connectGithubAccount(farcaster_custody_address: string) {
  const supabase = createClient()

  const userIsAuthed = await checkIfUserIsAuthed()
  if (!userIsAuthed) {
    const resultFromReAuthing = await reAuthUser(farcaster_custody_address)
  }

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "github",
    options: {
      redirectTo: `${process.env.API_URL}/auth/callback`,
      scopes: `repo user`,
    },
  })
  if (error) {
    console.log("error trying to connect github", error)
  }
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}
