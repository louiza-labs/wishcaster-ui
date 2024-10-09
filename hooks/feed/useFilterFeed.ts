"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { NormalizedPostType } from "@/types"

import {
  searchPostsForCategories,
  searchPostsForTerm,
  sortPostsByProperty,
} from "@/lib/helpers"

const useFilterFeed = (posts: NormalizedPostType[], topic = "") => {
  const searchParams = useSearchParams()

  // Extract search parameters
  const searchTermFromParams = searchParams.getAll("search").join(",")
  const categoriesFromParams = searchParams.getAll("topics").join(",")
  const filtersFromParams = searchParams.getAll("filters").join(",")
  const sortFieldFromParams = searchParams.getAll("sort").join(",")

  // Memoize filters to prevent unnecessary recalculations
  const filterFlags = useMemo(
    () => ({
      priorityBadgeFilter: filtersFromParams.includes("priority-badge"),
      likedFilter: filtersFromParams.includes("liked"),
      followingFilter: filtersFromParams.includes("following"),
      recastedFilter: filtersFromParams.includes("recasted"),
      hideFarcasterFilter: filtersFromParams.includes("hide-farcaster"),
      hideTwitterFilter: filtersFromParams.includes("hide-twitter"),
    }),
    [filtersFromParams]
  )

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    result = result.filter(
      (post) => post.tagline !== "No product request provided"
    )

    // Apply filters based on flags
    if (filterFlags.priorityBadgeFilter) {
      result = result.filter((post) => post.author?.verified)
    }
    if (filterFlags.hideFarcasterFilter) {
      result = result.filter((post) => post.platform !== "farcaster")
    }
    if (filterFlags.hideTwitterFilter) {
      result = result.filter((post) => post.platform !== "twitter")
    }

    // Filter by search term
    if (searchTermFromParams) {
      result = searchPostsForTerm(result, searchTermFromParams)
    }

    // Filter by categories
    if (categoriesFromParams) {
      result = searchPostsForCategories(result, categoriesFromParams)
    }

    // Filter by topic page
    if (topic) {
      result = searchPostsForCategories(result, topic)
    }

    // Sort by field if specified
    if (sortFieldFromParams) {
      result = sortPostsByProperty(result, sortFieldFromParams)
    }

    return result
  }, [
    posts,
    searchTermFromParams,
    categoriesFromParams,
    sortFieldFromParams,
    topic,
    filterFlags,
  ])

  return { filteredPosts }
}

export default useFilterFeed
