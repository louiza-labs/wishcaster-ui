"use client"

import { useParams, usePathname, useSearchParams } from "next/navigation"
import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfPosts,
  sortPostsByProperty,
} from "@/lib/helpers"

const useAddCategoriesToCasts = (casts: CastType[], topic = "") => {
  const searchParams = useSearchParams()

  // Extract search parameters

  const sortFieldFromParams = searchParams.getAll("sort").join(",")

  const params = useParams()
  const path = usePathname()

  // Start with the initial set of casts
  let castsWithCategories: any =
    casts && Array.isArray(casts) ? [...casts] : casts

  // Categorize and filter duplicate categories
  const categories = categorizeArrayOfPosts(
    castsWithCategories as any
  ) as Category[]
  const filteredCategories = categories

  // Add category fields to casts
  castsWithCategories = addCategoryFieldsToCasts(
    castsWithCategories,
    filteredCategories
  ) as CastType[]

  // Sort by appropriate field if specified
  if (sortFieldFromParams) {
    castsWithCategories = sortPostsByProperty(
      castsWithCategories as any,
      sortFieldFromParams
    )
  }

  return { castsWithCategories }
}

export default useAddCategoriesToCasts
