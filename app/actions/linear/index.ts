"use server"

import { createClient } from "@/clients/supabase/server"
import { LinearClient } from "@linear/sdk"

export const getLinearOauthToken = async () => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  const userMetatada = user ? user.user_metadata : {}
  const farcaster_id = userMetatada.farcaster_id
  const userRes = await supabase
    .from("sessions")
    .select("linear_access_token")
    .eq("farcaster_id", farcaster_id)
  if (userRes && userRes.data && userRes.data.length) {
    let userId = userRes.data[0].linear_access_token
    return userId
  }
  return null
}

export const getLinearInfo = async () => {
  const accessToken = await getLinearOauthToken()
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
    const accessToken = await getLinearOauthToken()

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
      const issue = await result.issue
      if (issue) {
        const { url, title, description, priority, project } = issue
        const fetchedProject = await project
        const projectId = fetchedProject?.id
        return { url, title, description, priority, projectId }
      }
    }
  } catch (e) {
    console.error("error creating linear issue", e)
  }
}
