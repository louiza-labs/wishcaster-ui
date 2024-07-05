"use server"

import { createClient } from "@/clients/supabase/server"

export async function updateAccount(userId: string, accountInfo: any) {
  const supabase = createClient()

  try {
    const res = await supabase
      .from("users")
      .update(accountInfo)
      .eq("id", userId)
    return res
  } catch (e) {
    return { error: true, message: "Unable to update account" }
  }
}

export async function createAccount(
  name: string,
  email: string,
  authId: string
) {
  const supabase = createClient()

  try {
    const res = await supabase.from("users").insert({
      name,
      email,
      auth_user_id: authId,
    })
    return res
  } catch (e) {
    return { error: true, message: "Unable to create account" }
  }
}

export async function getAccount(userId: string) {
  const supabase = createClient()

  try {
    const res = await supabase.from("users").select().eq("auth_user_id", userId)
    if (res && res.data && res.data.length) {
      let accountObj = res.data[0]
      return accountObj
    }
    return {}
  } catch (e) {
    return { error: true, message: "Unable to create account" }
  }
}

export async function getUserSocialIdentities() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUserIdentities()
  return data
}

export async function getAuthUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user }
}

export async function logoutUser() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()
  } catch (e) {}
}

export async function getUserSession() {
  const supabase = createClient()

  try {
    const { data: userSession, error } = await supabase.auth.getSession()

    return userSession.session
  } catch (e) {}
}

export async function getUsersNotionAccessCode() {
  const supabase = createClient()

  try {
    const { data: user, error } = await supabase.auth.getUser()
    const userId = user.user ? user.user.id : null
    if (userId) {
      const { data: userFromSessions, error } = await supabase
        .from("sessions")
        .select("notion_access_token")
        .eq("user_id", userId)
      const accessCode =
        userFromSessions && userFromSessions.length
          ? userFromSessions[0].notion_access_token
          : null
      return accessCode
    }
    return null
  } catch (e) {}
}

export async function getUserFromSessionsTable() {
  const supabase = createClient()

  try {
    const { data: user, error } = await supabase.auth.getUser()

    const userId = user.user ? user.user.id : null

    if (userId) {
      const { data: userFromSessions, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", userId)

      return userFromSessions && userFromSessions.length
        ? userFromSessions[0]
        : null
    }
    return null
  } catch (e) {}
}

type providerType = "twitter" | "notion" | "linear"
