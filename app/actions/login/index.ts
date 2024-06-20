"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/clients/supabase/server"

import { createAccount } from "@/app/actions/account"

export async function login(
  prevState: {
    message: string
  },
  formData: FormData
) {
  const supabase = createClient()

  let email = formData.get("email") as string
  let password = formData.get("password") as string
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  }
  if (!(email && email.length) || !(password && password.length)) {
    return { message: "Error logging in" }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { message: "Error logging in" }
  }

  revalidatePath("/", "layout")
  return { message: `Yalla` }

  // redirect("/account")
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  let name = formData.get("name") as string
  let email = formData.get("email") as string
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error, data: sessionData } = await supabase.auth.signUp(data)
  if (!error) {
    const res = await createAccount(name, email)
    if (res) {
    }
  }

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/account")
}
