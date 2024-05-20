"use client"

import { useSearchParams } from "next/navigation"
import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  filterDuplicateCategories,
  searchCastsForCategories,
  searchCastsForTerm,
  sortCastsByProperty,
} from "@/lib/helpers"

const useFilterFeed = (casts: CastType[]) => {
  const searchParams = useSearchParams()

  // Extract search parameters
  const searchTermFromParams = searchParams.getAll("search").join(",")
  const categoriesFromParams = searchParams.getAll("categories").join(",")
  const filtersFromParams = searchParams.getAll("filters").join(",")
  const sortFieldFromParams = searchParams.getAll("sort").join(",")
  // Determine filter flags
  const priorityBadgeFilter = filtersFromParams.includes("priority-badge")
  const likedFilter = filtersFromParams.includes("liked")
  const followingFilter = filtersFromParams.includes("following")
  const recastedFilter = filtersFromParams.includes("recasted")

  // Start with the initial set of casts
  let filteredCasts = [...casts]

  // Apply priority badge filter
  if (priorityBadgeFilter) {
    filteredCasts = filteredCasts.filter((cast) => cast.author.power_badge)
  }

  // Apply liked filter
  if (likedFilter) {
    filteredCasts = filteredCasts.filter(
      (cast) => cast.viewer_context && cast.viewer_context.liked
    )
  }

  // Apply following filter
  if (followingFilter) {
    filteredCasts = filteredCasts.filter(
      (cast) =>
        cast.author.viewer_context && cast.author.viewer_context.following
    )
  }

  // Apply recasted filter
  if (recastedFilter) {
    filteredCasts = filteredCasts.filter(
      (cast) => cast.viewer_context && cast.viewer_context.recasted
    )
  }

  // Filter by search term if it exists
  if (searchTermFromParams) {
    filteredCasts = searchCastsForTerm(filteredCasts, searchTermFromParams)
  }

  // Categorize and filter duplicate categories
  const categories = categorizeArrayOfCasts(filteredCasts) as Category[]
  const filteredCategories = filterDuplicateCategories(categories)

  // Add category fields to casts
  filteredCasts = addCategoryFieldsToCasts(
    filteredCasts,
    filteredCategories
  ) as CastType[]

  // Filter by categories if specified
  if (categoriesFromParams) {
    filteredCasts = searchCastsForCategories(
      filteredCasts,
      categoriesFromParams
    )
  }

  // Sort by appropriate field if specified
  if (sortFieldFromParams) {
    filteredCasts = sortCastsByProperty(filteredCasts, sortFieldFromParams)
  }

  return { filteredCasts }
}

export default useFilterFeed
