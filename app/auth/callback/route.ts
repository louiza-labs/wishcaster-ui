"use server"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const session = data.session
      if (session && session.provider_token) {
        const providerToken = session.provider_token
        const refreshToken = session.provider_refresh_token
        const userId = data.user.id // or however you get the user's ID
        const userEmail = data.user.email
        const provider = data.user.user_metadata.iss.includes("notion")
          ? "notion"
          : "twitter"
        try {
          // first get id from sessions
          const resForId = await supabase
            .from("sessions")
            .select("id")
            .eq("user_id", userId)
          const id =
            resForId.data && resForId.data.length ? resForId.data[0].id : null
          const buildSessionObject = () => {
            let baseObject = {
              user_id: userId,
              notion_access_token: "",
              notion_refresh_token: "", // Add this line
              twitter_access_token: "",
              twitter_refresh_token: "", // Add this line
              email: userEmail,
              id: null,
            }
            if (id) {
              baseObject.id = id
            }
            if (provider === "notion") {
              baseObject.notion_access_token = providerToken || ""
              baseObject.notion_refresh_token = refreshToken || ""
            } else if (provider === "twitter") {
              baseObject.twitter_access_token = providerToken || ""
              baseObject.twitter_refresh_token = refreshToken || ""
            }
            baseObject.email = userEmail

            return baseObject
          }
          let sessionObject = buildSessionObject()
          if (!id) {
            const resForInsertingData = await supabase
              .from("sessions")
              .insert(sessionObject)
          } else {
            let sessionObject = buildSessionObject()
            const res = await supabase.from("sessions").upsert(sessionObject)
          }
        } catch (e) {
          // console.error("error updating sessions", e)
        }
      }

      // update the sessions
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
