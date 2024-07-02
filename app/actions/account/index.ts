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

type providerType = "twitter" | "notion" | "linear"
export async function updateUserSessionInfoInDB(
  provider: providerType,
  accessToken: string,
  refreshToken: string,
  user_id: string
) {
  try {
    const buildSessionObject = () => {
      let baseObject = {
        user_id: BigInt(user_id),
      }
      if (provider === "linear") {
        baseObject.linear_access_token = accessToken
        baseObject.linear_refresh_token = refreshToken
      } else if (provider === "notion") {
        baseObject.notion_access_token = accessToken
        baseObject.notion_refresh_token = refreshToken
      } else if (provider === "twitter") {
        baseObject.twitter_access_token = accessToken
        baseObject.twitter_refresh_token = refreshToken
      }
      return baseObject
    }
    let sessionObject = buildSessionObject()
    const res = await supabase.from("sessions").upsert(sessionObject)
    return res
  } catch (e) {
    console.error("error updating sessions", e)
  }
}
