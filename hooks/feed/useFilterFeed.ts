"use client"

import { useParams, usePathname, useSearchParams } from "next/navigation"
import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  searchCastsForCategories,
  searchCastsForTerm,
  sortCastsByProperty,
} from "@/lib/helpers"

const useFilterFeed = (posts: CastType[], topic = "") => {
  const searchParams = useSearchParams()

  // Extract search parameters
  const searchTermFromParams = searchParams.getAll("search").join(",")
  const categoriesFromParams = searchParams.getAll("topics").join(",")
  const filtersFromParams = searchParams.getAll("filters").join(",")
  const sortFieldFromParams = searchParams.getAll("sort").join(",")
  // Determine filter flags
  const priorityBadgeFilter = filtersFromParams.includes("priority-badge")
  const likedFilter = filtersFromParams.includes("liked")
  const followingFilter = filtersFromParams.includes("following")
  const recastedFilter = filtersFromParams.includes("recasted")
  const hideFarcasterFilter = filtersFromParams.includes("hide-farcaster")
  const hideXFilter = filtersFromParams.includes("hide-twitter")

  const params = useParams()
  const path = usePathname()

  // Start with the initial set of casts
  let filteredPosts = [...posts]

  // Apply priority badge filter
  if (priorityBadgeFilter) {
    filteredPosts = filteredPosts.filter((cast) => cast.author.power_badge)
  }

  // Apply liked filter
  if (likedFilter) {
    filteredPosts = filteredPosts.filter(
      (cast) => cast.viewer_context && cast.viewer_context.liked
    )
  }

  // Apply following filter
  if (followingFilter) {
    filteredPosts = filteredPosts.filter(
      (cast) =>
        cast.author &&
        cast.author.viewer_context &&
        cast.author.viewer_context.following
    )
  }

  // Apply recasted filter
  if (recastedFilter) {
    filteredPosts = filteredPosts.filter(
      (cast) => cast.viewer_context && cast.viewer_context.recasted
    )
  }

  // Filter by search term if it exists
  if (searchTermFromParams) {
    filteredPosts = searchCastsForTerm(filteredPosts, searchTermFromParams)
  }

  // Categorize and filter duplicate categories
  const categories = categorizeArrayOfCasts(filteredPosts) as Category[]
  const filteredCategories = categories

  // Add category fields to casts
  filteredPosts = addCategoryFieldsToCasts(
    filteredPosts,
    filteredCategories
  ) as CastType[]

  // Filter by categories if specified
  if (categoriesFromParams) {
    filteredPosts = searchCastsForCategories(
      filteredPosts,
      categoriesFromParams
    )
  }
  // Filter by topic page if on one
  if (topic && topic.length) {
    filteredPosts = searchCastsForCategories(filteredPosts, topic)
  }

  // Sort by appropriate field if specified
  if (sortFieldFromParams) {
    filteredPosts = sortCastsByProperty(filteredPosts, sortFieldFromParams)
  }

  return { filteredPosts }
}

export default useFilterFeed
