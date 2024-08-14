"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import useValidate from "@/hooks/validate/useValidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ValidateTabs from "@/components/research/tabs"

interface ComparisonProps {
  tweetsAndCasts: any[]
}
const Comparison = ({ tweetsAndCasts }: ComparisonProps) => {
  const router = useRouter()
  const [searching, setSearching] = useState<boolean>(false)
  const [results, setResults] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  const { castAndTweetsSearchResults, fetchAndFormatSearchResults } =
    useValidate(tweetsAndCasts, searchTerm)

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchClick = async () => {
    if (searchTerm && searchTerm.length) {
      setSearching(true)
      const res = await fetchAndFormatSearchResults()
      setResults(res)
      setSearching(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-start">
      <div className="mt-4 flex w-full justify-center">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick()
              }
            }}
            onChange={handleSearch}
            className="focus:ring-primary-500 relative w-full max-w-full rounded-md px-4 py-2 shadow-md focus:outline-none focus:ring-2"
          />

          {searching ? (
            <div className="absolute right-2 top-2 flex items-center">
              <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : null}
        </div>
        <Button
          onClick={handleSearchClick}
          className="hover:bg-primary-600 focus:ring-primary-500 ml-2 rounded-md bg-primary px-4 py-2 text-white focus:outline-none focus:ring-2"
        >
          Search
        </Button>
      </div>
      <div className="mt-4">
        {results && results.length ? (
          <ValidateTabs tweetsAndCasts={results} />
        ) : null}
      </div>
    </div>
  )
}

export default Comparison
