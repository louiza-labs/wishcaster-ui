"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ValidateSearch = ({}) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSearchClick = () => {
    if (searchTerm && searchTerm.length) {
      router.push(`/validate/${searchTerm}`)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="mt-8 flex justify-center">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="focus:ring-primary-500 w-full max-w-md rounded-md px-4 py-2 shadow-md focus:outline-none focus:ring-2"
          />
          <Button
            onClick={handleSearchClick}
            className="hover:bg-primary-600 focus:ring-primary-500 ml-2 rounded-md bg-primary px-4 py-2 text-white focus:outline-none focus:ring-2"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ValidateSearch
