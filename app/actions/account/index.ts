"use server"

import { createClient } from "@/clients/supabase/server"

const supabase = createClient()

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
  const { data, error } = await supabase.auth.getUserIdentities()
  return data
}

export async function getAuthUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user }
}

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
  } catch (e) {
    console.error("error trying to signout", e)
  }
}

export async function getUserSession() {
  try {
    const { data: userSession, error } = await supabase.auth.getSession()

    return userSession.session
  } catch (e) {}
}

export async function getUsersNotionAccessCode() {
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
  try {
    const { data: user, error } = await supabase.auth.getUser()

    const userId = user.user ? user.user.id : null
    console.log("the user id is nom", userId)

    if (userId) {
      const { data: userFromSessions, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", userId)
      console.log("the user sessions is nom", userFromSessions)

      return userFromSessions && userFromSessions.length
        ? userFromSessions[0]
        : null
    }
    return null
  } catch (e) {}
}

type providerType = "twitter" | "notion" | "linear"
