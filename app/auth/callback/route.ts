"use server"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(request: Request) {
  const { searchParams, origin, pathname } = new URL(request.url)

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
    const authedUser = await supabase.auth.getUser()

    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const session = data.session
      if (session && session.provider_token) {
        const userMetadata = data.user.user_metadata
        const usersFID = userMetadata?.farcaster_id
        const providerToken = session.provider_token
        const refreshToken = session.provider_refresh_token
        const userEmail = data.user.email
        const provider =
          providerToken && providerToken.includes("secret_")
            ? "notion"
            : providerToken && providerToken.includes("gho_")
            ? "github"
            : "twitter"
        try {
          // first get id from sessions

          const buildSessionObject = (forNewAccount: boolean) => {
            let baseObject: any = {
              farcaster_id: usersFID,
              email: userEmail,
              id: usersFID,
            }
            if (forNewAccount) {
              baseObject.user_id = usersFID
            }

            if (provider === "notion") {
              baseObject.notion_access_token = providerToken || ""
              baseObject.notion_refresh_token = refreshToken || ""
            } else if (provider === "twitter") {
              baseObject.twitter_access_token = providerToken || ""
              baseObject.twitter_refresh_token = refreshToken || ""
            } else if (provider === "github") {
              baseObject.github_access_token = providerToken || ""
              baseObject.github_refresh_token = refreshToken || ""
            }

            baseObject.email = userEmail

            return baseObject
          }

          let sessionObject = buildSessionObject(false)
          const res = await supabase
            .from("sessions")
            .update(sessionObject)
            .eq("farcaster_id", usersFID)
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
