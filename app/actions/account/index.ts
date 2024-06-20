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

export async function createAccount(name: string, email: string) {
  const supabase = createClient()

  try {
    const res = await supabase.from("users").insert({
      name,
      email,
    })
    return res
  } catch (e) {
    return { error: true, message: "Unable to create account" }
  }
}
