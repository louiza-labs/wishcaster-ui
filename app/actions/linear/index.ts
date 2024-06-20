"use server"

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { LinearClient } from "@linear/sdk"

export const getLinearOauthToken = async () => {
  const userId = null
  const user = await currentUser()
  const provider = "oauth_linear"
  if (!userId) return
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    userId,
    provider
  )
  if (!clerkResponse || !(clerkResponse && clerkResponse.data.length)) return
  const accessToken = clerkResponse.data[0].token
  return accessToken
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
    myIssues.nodes.map((issue) =>
      console.log(`${me.displayName} has issue: ${issue.title}`)
    )
  } else {
    console.log(`${me.displayName} has no issues`)
  }
}

export const createLinearIssue = async (
  title: string,
  description: string,
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
      console.log("the result ", result)
      return result.success
    }
  } catch (e) {
    console.error("error creating linear issue", e)
  }
}
