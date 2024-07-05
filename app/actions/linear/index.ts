"use server"

import { createClient } from "@/clients/supabase/server"
import { LinearClient } from "@linear/sdk"

export const getLinearOauthToken = async (email: string) => {
  const supabase = createClient()
  const userRes = await supabase
    .from("sessions")
    .select("linear_access_token")
    .eq("email", email)
  if (userRes && userRes.data && userRes.data.length) {
    let userId = userRes.data[0].linear_access_token
    return userId
  }
  return null
}

export const getLinearInfo = async (email: string) => {
  const accessToken = await getLinearOauthToken(email)
  if (!accessToken) return
  const linearC = new LinearClient({
    accessToken: accessToken,
  })
  const me = await linearC.viewer
  const myIssues = await me.assignedIssues()
  if (myIssues && myIssues.nodes && myIssues.nodes.length) {
    return myIssues.nodes
  } else {
    return []
  }
}

export const createLinearIssue = async (
  title: string,
  description: string,
  emailForLoggedInUser: string,
  priority = 0,
  projectId = ""
) => {
  try {
    const accessToken = await getLinearOauthToken(emailForLoggedInUser)

    if (!accessToken) return
    const linearC = new LinearClient({
      accessToken: accessToken,
    })

    const teams = await linearC.teams()

    const team = teams.nodes[0]
    if (team.id && title && title.length && description && description.length) {
      const result = await linearC.createIssue({
        teamId: team.id,
        title,
        description,
        priority: priority ? Number(priority) : undefined,
        projectId: projectId && projectId.length ? projectId : undefined,
      })

      return result.success
    }
  } catch (e) {
    console.error("error creating linear issue", e)
  }
}
