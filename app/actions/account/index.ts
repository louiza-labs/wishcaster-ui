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

export async function logoutUser() {
  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signOut()
  } catch (e) {
    console.error("error trying to signout", e)
  }
}
