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
    request: async (val) => {
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
      //write the access_token to supabase
      const accessToken = account?.access_token
      const email = profile?.email
      let id = null
      try {
        const resForId = await supabase
          .from("users")
          .select("id")
          .eq("email", email)

        if (resForId && resForId.data && resForId.data.length) {
          id = resForId.data[0].id
        }
      } catch (e) {
        console.error("error trying to get user", e)
      }
      try {
        const res = await supabase.from("sessions").upsert({
          email,
          linear_access_token: accessToken,
          user_id: id,
        })
      } catch (e) {
        console.error("error trying to upsert", e)
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session(params) {
      const { token, session } = params
      session.user.id = token.id
      session.user.access_token = token.access_token
      return session
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
