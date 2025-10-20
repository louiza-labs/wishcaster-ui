"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"

import useSearch from "@/hooks/search/useSearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PostCard from "@/components/post"
import TopicSearchResults from "@/components/topics/search"

interface SearchIconProps {
  handleClick: () => void
  className: string
}

function SearchIcon({ handleClick, className }: SearchIconProps) {
  return (
    <button onClick={handleClick}>
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>
  )
}

interface SearchProps {
  notionResults?: any
}

const Search = ({ notionResults }: SearchProps) => {
  const {
    searchTerm,
    searchedCasts,
    searchType,
    justSearched,
    searchTypeOptions,
    renderingSearchResults,
    SearchTypeIconToDisplay,
    TopicCount,
    itemsToShow,
    setItemsToShow,
    handleClickOutside,
    handleSubmitSearchTerm,
    handleSearchTermChange,
    handleSearchTypeChange,
  } = useSearch()

  const searchParamsObj = useSearchParams()
  const searchParams = searchParamsObj.get("search")
  const router = useRouter()

  const searchResultsRef = useRef<HTMLDivElement>(null)

  // Setting up useInView hook
  const { ref, inView } = useInView({
    threshold: 0.1, // 10% of the element should be visible
    triggerOnce: false, // You can set it to true if you don't want it to trigger multiple times
  })

  useEffect(() => {
    if (inView) {
      setItemsToShow((prevItemsToShow) => prevItemsToShow + 10) // Load more items incrementally when the observed element is in view
    }
  }, [inView, setItemsToShow]) // Trigger more items to be shown when the last item comes into view

  useEffect(() => {
    if (justSearched) {
      document.addEventListener("click", handleClickOutside)
    } else {
      document.removeEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [justSearched, handleClickOutside])

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <>
      <div className="top-10 flex w-full items-center justify-center sm:w-auto md:top-0 lg:relative">
        {}
        <div className=" flex w-full flex-col items-center px-4 sm:px-0 md:block md:max-w-md">
          <div className="relative">
            <div className=" absolute inset-y-0 left-0 flex items-center">
              <Select
                defaultValue={searchType}
                onValueChange={(value: "posts" | "topics") =>
                  handleSearchTypeChange(value)
                }
              >
                <SelectTrigger className="size-fit gap-x-1 whitespace-nowrap rounded-l-md px-1 pl-2 text-xs font-semibold focus:ring-0 focus:ring-transparent focus:ring-offset-0">
                  <SelectValue className="text-xs font-semibold" placeholder="">
                    {capitalizeFirstLetter(searchType)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {searchTypeOptions.map(({ icon: Icon, value }) => (
                    <SelectItem
                      className="flex flex-row items-center gap-x-2"
                      value={value}
                      key={value}
                    >
                      {capitalizeFirstLetter(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              className="w-full rounded-md border border-gray-300 px-4 py-2 pl-20 pr-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-500"
              placeholder="Search casts, tweets, or topics..."
              type="search"
              onChange={handleSearchTermChange}
              value={searchTerm}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmitSearchTerm()
                }
              }}
            />
            <div className=" absolute inset-y-0 right-4 flex items-center">
              {renderingSearchResults ? (
                <div className="flex items-center">
                  <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : (
                <SearchIcon
                  handleClick={handleSubmitSearchTerm}
                  className="size-5 text-gray-400 dark:text-gray-500"
                />
              )}
            </div>
          </div>
          <Button onClick={handleSubmitSearchTerm} className="mt-4 lg:hidden">
            Search
          </Button>
        </div>
      </div>
      {((searchedCasts && searchedCasts.length) || justSearched) &&
      searchTerm.length ? (
        <div
          ref={searchResultsRef}
          className="inset-0 top-16 flex flex-col items-center gap-y-4 overflow-auto border-t bg-white bg-opacity-10 pt-4 backdrop-blur-lg md:items-start md:px-20 md:py-10 md:pl-6 lg:fixed"
        >
          <p className=" gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:block">
            <span className="mr-2">&quot;{searchTerm}&quot;</span>{" "}
            <span className="">results</span>{" "}
            <span className="ml-1">
              ({searchType === "topics" ? TopicCount : searchedCasts.length})
            </span>
          </p>
          {searchType === "topics" ? (
            <TopicSearchResults
              notionResults={notionResults}
              posts={searchedCasts}
            />
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 ">
              {searchedCasts.slice(0, itemsToShow).map((searchedPost) => (
                <PostCard
                  renderEmbeds={true}
                  post={searchedPost}
                  asSingleRow={true}
                  notionResults={notionResults}
                />
              ))}
              {itemsToShow >= searchedCasts.length ? null : (
                <div ref={ref} className="flex items-center justify-center">
                  <div className="animate-bounce space-x-2">
                    <div className="inline-block size-3 rounded-full bg-slate-900 dark:bg-white" />
                    <div className="inline-block size-3 rounded-full bg-slate-900 dark:bg-white" />
                    <div className="inline-block size-3 rounded-full bg-slate-900 dark:bg-white" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}

export default Search
