"use client"

import { useEffect, useState } from "react"

import { fetchGithubReposBySearch } from "@/app/actions"

const useFetchGithubRepos = (searchTerm: string[]) => {
  const [githubRepos, setGithubRepos] = useState<any>([])
  const [fetchingGithubRepos, setFetchingGithubRepos] = useState(false)

  const fetchAndSetGithubRepos = async () => {
    if (!searchTerm || searchTerm.length === 0) return

    try {
      setFetchingGithubRepos(true)
      const batchSize = 5 // Define the batch size to control the number of simultaneous requests
      const repos: any[] = []
      for (let i = 0; i < searchTerm.length; i += batchSize) {
        const batch = searchTerm.slice(i, i + batchSize)
        const fetchPromises = batch.map((term) =>
          fetchGithubReposBySearch(term)
        )

        const batchResults = await Promise.all(fetchPromises)
        batchResults.forEach((result: any) => {
          repos.push(...result)
        })
      }
      setGithubRepos(repos)
    } catch (e) {
      console.error("Failed to fetch GitHub repositories:", e)
    } finally {
      setFetchingGithubRepos(false)
    }
  }
  useEffect(() => {
    fetchAndSetGithubRepos()
  }, [searchTerm])
  return {
    githubRepos,
    fetchingGithubRepos,
  }
}

export default useFetchGithubRepos
