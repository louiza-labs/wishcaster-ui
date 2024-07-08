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

export async function connectNotionAccount() {
  const supabase = createClient()

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

export async function connectGithubAccount() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "github",
    options: {
      redirectTo: `${process.env.API_URL}/auth/callback`,
    },
  })
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}
