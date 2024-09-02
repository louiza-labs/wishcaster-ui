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

  // Determine filter flags
  const priorityBadgeFilter = filtersFromParams.includes("priority-badge")
  const likedFilter = filtersFromParams.includes("liked")
  const followingFilter = filtersFromParams.includes("following")
  const recastedFilter = filtersFromParams.includes("recasted")
  const hideFarcasterFilter = filtersFromParams.includes("hide-farcaster")
  const hideTwitterFilter = filtersFromParams.includes("hide-twitter")

  // Start with the initial set of posts
  let filteredPosts = [...posts]

  const postsWithUsers = useMemo(() => {
    console.log("the posts", posts)
    return filteredPosts.filter(
      (posts) => posts.author && posts.author.username
    )
  }, [filteredPosts])

  filteredPosts = postsWithUsers

  // Apply priority badge filter
  if (priorityBadgeFilter) {
    filteredPosts = filteredPosts.filter(
      (post) => post.author && post.author.verified
    )
  }

  // Apply liked filter
  // if (likedFilter) {
  //   filteredPosts = filteredPosts.filter(
  //     (post) => post.additionalMetrics?.liked === true
  //   );
  // }

  // Apply following filter
  // if (followingFilter) {
  //   filteredPosts = filteredPosts.filter(
  //     (post) => post.author?.followerCount && post.author.followerCount > 0
  //   );
  // }

  // Apply recasted filter
  // if (recastedFilter) {
  //   filteredPosts = filteredPosts.filter(
  //     (post) => post.additionalMetrics?.recasted === true
  //   );
  // }

  // Apply platform filters
  if (hideFarcasterFilter) {
    filteredPosts = filteredPosts.filter(
      (post) => post.platform !== "farcaster"
    )
  }

  if (hideTwitterFilter) {
    filteredPosts = filteredPosts.filter((post) => post.platform !== "twitter")
  }

  // Filter by search term if it exists
  if (searchTermFromParams) {
    filteredPosts = searchPostsForTerm(filteredPosts, searchTermFromParams)
  }

  // Filter by categories if specified
  if (categoriesFromParams) {
    filteredPosts = searchPostsForCategories(
      filteredPosts,
      categoriesFromParams
    )
  }

  // Filter by topic page if on one
  if (topic && topic.length) {
    filteredPosts = searchPostsForCategories(filteredPosts, topic)
  }

  // Sort by appropriate field if specified
  if (sortFieldFromParams) {
    filteredPosts = sortPostsByProperty(filteredPosts, sortFieldFromParams)
  }

  return { filteredPosts }
}

export default useFilterFeed
