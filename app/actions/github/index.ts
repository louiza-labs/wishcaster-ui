"use server"

import { Octokit } from "octokit"

import { connectGithubAccount, getUserFromSessionsTable } from "@/app/actions"

export const createGithubRepoForUser = async (
  repoName: string,
  repoDescription: string,
  homepage = "",
  isPrivate: boolean
) => {
  const sessionRes = await getUserFromSessionsTable()
  const githubAccessToken = sessionRes.github_access_token
  if (githubAccessToken) {
    try {
      const octokit = new Octokit({
        auth: githubAccessToken,
      })
      const response = await octokit.request("POST /user/repos", {
        name: repoName,
        description: repoDescription,
        homepage: homepage && homepage.length ? homepage : undefined,
        private: isPrivate,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      return response
    } catch (e) {
      console.error("error trying to create github repo", e)
    }
  } else {
    // connect account
    const resForLinkingAccount = await connectGithubAccount()
    const sessionRes = await getUserFromSessionsTable()
    const githubAccessToken = sessionRes.github_access_token
    try {
      const octokit = new Octokit({
        auth: githubAccessToken,
      })
      const response = await octokit.request("POST /user/repos", {
        name: repoName,
        description: repoDescription,
        homepage: homepage && homepage.length ? homepage : undefined,
        private: isPrivate,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      return response
    } catch (e) {
      console.error("error trying to create github repo", e)
    }
  }
}
