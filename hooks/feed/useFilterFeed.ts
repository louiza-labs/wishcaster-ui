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

const useFilterFeed = (posts: any[], topic = "") => {
  const searchParams = useSearchParams()
  const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]

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
  const timeFilters = dateOptions.find((option) =>
    filtersFromParams.includes(option)
  )
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

  if (timeFilters) {
    const now = new Date()
    let filterDate = now

    switch (timeFilters) {
      case "24-hours":
        filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7-days":
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30-days":
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "ytd":
        filterDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        filterDate = now
    }

    filteredPosts = filteredPosts.filter((post) => {
      const createdAt = new Date(post.created_at)
      return createdAt <= filterDate
    })
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
