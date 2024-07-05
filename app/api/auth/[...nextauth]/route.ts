// app/api/auth/[...nextauth]/route.ts

import { LinearClient } from "@linear/sdk"
import { createClient } from "@supabase/supabase-js"
import NextAuth from "next-auth"
import { OAuthConfig } from "next-auth/providers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const redirect_uri = "http://localhost:3000/api/auth/callback/linear"
const linearUrl = "https://linear.app/oauth/authorize"
interface LinearProfile {
  id: string
  name: string
  email: string
  avatarUrl: string
}

const LinearProvider = {
  id: "linear",
  name: "Linear",
  type: "oauth",
  version: "2.0",
  scope: "read,write",
  params: { grant_type: "authorization_code" },
  token: `https://api.linear.app/oauth/token`,
  authorization: `${linearUrl}?response_type=code&client_id=${process.env.LINEAR_CLIENT_ID}&redirect_uri=${redirect_uri}&actor=user&state=SECURE_RANDOM&scope=read,write`,
  // userinfo: "https://api.linear.app/me",
  userinfo: {
    request: async (val: any) => {
      const client = new LinearClient({ accessToken: val.tokens.access_token })
      let viewer = await client.viewer
      return viewer
    },
  },
  clientId: process.env.LINEAR_CLIENT_ID,
  clientSecret: process.env.LINEAR_CLIENT_SECRET,
  async profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.avatarUrl,
      accessToken: profile.access_token,
    }
  },
} as OAuthConfig<any>

const handler = NextAuth({
  providers: [LinearProvider],
  callbacks: {
    async signIn(params) {
      const { user, account, profile, credentials } = params
      try {
        const accessToken = account?.access_token
        const userId = user?.id
        const email = profile?.email

        const resForId = await supabase
          .from("sessions")
          .select("user_id")
          .eq("email", email)
        const id =
          resForId.data && resForId.data.length
            ? resForId.data[0].user_id
            : null

        const buildSessionObject = () => {
          let baseObject: {
            user_id?: string
            linear_access_token?: string
            email?: string
          } = {
            user_id: userId,
            linear_access_token: accessToken as string,
            email: email as string,
          }
          // if (id) {
          //   baseObject.id = id
          // }
          baseObject["linear_access_token"] = accessToken as string
          baseObject["email"] = email as string

          return baseObject
        }
        let sessionObject = buildSessionObject()
        if (!id) {
          const resForInsertingData = await supabase
            .from("sessions")
            .insert(sessionObject)
        } else {
          const res = await supabase
            .from("sessions")
            .update(sessionObject)
            .eq("email", email)
        }
      } catch (e) {
        console.error("error trying to update sessions for linear", e)
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session(params) {
      const { token, session } = params
      let typedSession: any = session
      typedSession.user.id = token.id as string

      return typedSession
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }
