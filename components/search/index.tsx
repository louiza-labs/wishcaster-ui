"use client"

import { Suspense, useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Input } from "@/components/ui/input"

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

const Search = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchTermFromParams = searchParams.get("search")
  const [searchTerm, setSearchTerm] = useState(
    searchTermFromParams ? searchTermFromParams : ""
  )

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
  }
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  const handleSubmitSearchTerm = () => {
    if (searchTerm && searchTerm.length > 0) {
      router.push(
        "?" + createQueryString("search", searchTerm ? searchTerm : "")
      )
    } else {
      router.push("/")
    }
  }

  return (
    <Suspense>
      <div className="flex  items-center justify-center">
        <div className="w-full px-4 sm:px-0 md:max-w-md">
          <div className="relative">
            <Input
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-500"
              placeholder="Search casts or topics..."
              type="search"
              onChange={handleSearchTermChange}
              value={searchTerm}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmitSearchTerm()
                }
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchIcon
                handleClick={handleSubmitSearchTerm}
                className="size-5 text-gray-400 dark:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Search
