"use server"

import { Octokit } from "octokit"

import { connectGithubAccount, getUserFromSessionsTable } from "@/app/actions"

export const createGithubRepoForUser = async (
  farcaster_custody_address: string,
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
    const resForLinkingAccount = await connectGithubAccount(
      farcaster_custody_address
    )
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

export const fetchGithubReposBySearch = async (
  searchTerm: string,
  maxResults: number = 20
) => {
  const octokit = new Octokit()
  const splitSearchTerm = searchTerm.split(" ")
  try {
    const query = `${searchTerm}`
    const queryString = `q=${encodeURIComponent(
      searchTerm
    )}&sort=stars&order=desc&per_page=${maxResults}`

    const response = await octokit.request(
      `GET /search/repositories?${queryString}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    )

    // Extracting repository data
    const repositories = response.data.items.map((repo: any) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
      owner: repo.owner.login,
    }))

    return repositories
  } catch (error) {
    console.error("Error fetching top repositories:", error)
    throw error
  }
}
