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
    const userId = user.user ? user.user.user_metadata.farcaster_id : null
    if (userId) {
      const { data: userFromSessions, error } = await supabase
        .from("sessions")
        .select("notion_access_token")
        .eq("farcaster_id", userId)
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
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    const usersFID = user ? user.user_metadata.farcaster_id : null

    if (usersFID) {
      const { data: userFromSessions, error } = await supabase
        .from("sessions")
        .select()
        .eq("farcaster_id", usersFID)
      return userFromSessions && userFromSessions.length
        ? userFromSessions[0]
        : null
    }
    return null
  } catch (e) {}
}

type providerType = "twitter" | "notion" | "linear"

export async function unlinkUsersSocialAccount(
  socialAccount: "github" | "notion" | "linear"
) {
  const supabase = createClient()

  if (socialAccount === "linear") return

  try {
    // retrieve all identites linked to a user
    const { data: identities } = await supabase.auth.getUserIdentities()
    const identitiesArray = identities?.identities
    if (!identitiesArray || !Array.isArray(identitiesArray)) return
    // find the google identity
    const identityToUnlink = identitiesArray.find(
      (identity) => identity.provider === socialAccount
    )
    if (!identityToUnlink) return

    // unlink the google identity
    const { error, data } = await supabase.auth.unlinkIdentity(identityToUnlink)
    return { error, data }
  } catch (e) {
    console.error("error trying to unlink an identity", e)
  }
}

export async function removeUsersSocialAccessTokenFromTable(
  socialAccount: "github" | "notion" | "linear",
  usersFID: number
) {
  const supabase = createClient()

  const userObjectToUpdate:
    | {
        github_access_token: string | undefined
        linear_access_token: string | undefined
        notion_access_token: string | undefined
      }
    | any = {}

  if (socialAccount === "github") {
    userObjectToUpdate.github_access_token = ""
  } else if (socialAccount === "linear") {
    userObjectToUpdate.linear_access_token = ""
  } else if (socialAccount === "notion") {
    userObjectToUpdate.notion_access_token = ""
  }

  try {
    const { data, error } = await supabase
      .from("sessions")
      .update(userObjectToUpdate)
      .eq("farcaster_id", usersFID)
    return { data, error }
  } catch (e) {
    console.error("error updating user session", e)
  }
}

export async function disconnectUsersSocialAccountFromDB(
  socialAccount: "notion" | "github" | "linear",
  usersFID: number
) {
  if (socialAccount && usersFID) {
    // first unlink the acccount from auth settings

    const resForUnlinkingAccount = await unlinkUsersSocialAccount(socialAccount)

    const resForRemovingUsersAccessTokenFromSessions =
      await removeUsersSocialAccessTokenFromTable(socialAccount, usersFID)

    return {
      resultForUnlinkingAccount: resForUnlinkingAccount,
      resultForRemovingUsersAccessTokens:
        resForRemovingUsersAccessTokenFromSessions,
    }
    // then remove the stored data in the sessions table
  }
}
