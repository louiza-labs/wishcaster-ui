"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useBoundStore } from "@/store"
import { NormalizedPostType } from "@/types"
import { useNeynarContext } from "@neynar/react"
import { useInView } from "react-intersection-observer"

import { categorizeArrayOfPosts } from "@/lib/helpers"
import { Icons } from "@/components/icons"
import { fetchPosts } from "@/app/actions"

const useSearch = () => {
  const [renderingSearchResults, setRenderingSearchResults] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchedCasts, setSearchedCasts] = useState<NormalizedPostType[]>([])
  const [itemsToShow, setItemsToShow] = useState<number>(10)
  const [searchType, setSearchType] = useState<"posts" | "topics">("posts")
  const [justSearched, setJustSearched] = useState(false)

  const searchParams = useSearchParams().get("search")
  const router = useRouter()
  const { casts, tweets } = useBoundStore((state: any) => state)
  const { setTweets, setCasts } = useBoundStore((state: any) => state)
  const { user } = useNeynarContext()
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const handleSearchTypeChange = useCallback((value: "posts" | "topics") => {
    setSearchType(value)
  }, [])

  const searchTypeOptions = useMemo(
    () => [
      { value: "posts", icon: Icons.casts },
      { value: "topics", icon: Icons.boxes },
    ],
    []
  )

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    []
  )

  const handleSubmitSearchTerm = useCallback(async () => {
    if (!searchTerm.trim()) return

    let shouldUseFetchedPosts = false
    let fetchedPosts: NormalizedPostType[] = []

    if (casts.length === 0 && tweets.length === 0) {
      shouldUseFetchedPosts = true
      try {
        const posts = await fetchPosts({
          timePeriod: "30-days",
          channelId: "someone-build",
          userFID: user?.fid ? String(user.fid) : "0",
        })
        fetchedPosts = posts
        if (casts.length === 0) {
          setCasts(
            posts.filter(
              (post: NormalizedPostType) => post.platform === "farcaster"
            )
          )
        }
        if (tweets.length === 0) {
          setTweets(
            posts.filter(
              (post: NormalizedPostType) => post.platform === "twitter"
            )
          )
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        // Handle error appropriately
      }
    }

    setJustSearched(true)
    setRenderingSearchResults(true)
    setSearchedCasts([])

    try {
      const categories = categorizeArrayOfPosts(
        shouldUseFetchedPosts ? fetchedPosts : [...casts, ...tweets]
      )
      const filteredPosts = shouldUseFetchedPosts
        ? fetchedPosts
        : [...casts, ...tweets]

      const castsWithSearchTerm = filteredPosts.filter(
        (cast: NormalizedPostType) => {
          const term = searchTerm.toLowerCase()
          return searchType === "topics"
            ? cast.category?.id?.toLowerCase().includes(term)
            : cast.text.toLowerCase().includes(term) ||
                (cast.category?.id &&
                  cast.category?.id?.toLowerCase().includes(term))
        }
      )

      setSearchedCasts(castsWithSearchTerm)
    } catch (error) {
      console.error("Error processing search results:", error)
      // Handle error appropriately
    } finally {
      setRenderingSearchResults(false)
    }
  }, [searchTerm, searchType, casts, tweets, user, setCasts, setTweets])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target as Node)
    ) {
      setJustSearched(false)
      setSearchedCasts([])
      setSearchTerm("")
    }
  }, [])

  const SearchTypeIconToDisplay = useMemo(() => {
    return searchTypeOptions.find((opt) => opt.value === searchType)?.icon
  }, [searchType, searchTypeOptions])

  const TopicCount = useMemo(() => {
    const uniqueCategories = new Set(
      searchedCasts.map((cast) => cast.category?.id).filter(Boolean)
    )
    return uniqueCategories.size
  }, [searchedCasts])

  return {
    searchTerm,
    searchedCasts,
    searchType,
    justSearched,
    renderingSearchResults,
    searchTypeOptions,
    itemsToShow,
    SearchTypeIconToDisplay,
    TopicCount,
    setItemsToShow,
    handleClickOutside,
    handleSubmitSearchTerm,
    handleSearchTermChange,
    handleSearchTypeChange,
  }
}

export default useSearch
