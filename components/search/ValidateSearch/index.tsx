"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import IndustrySelectionMenu from "@/components/search/ValidateSearch/IndustrySelection"

const ValidateSearch = ({}) => {
  const router = useRouter()
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [searching, setSearching] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value)
  }
  const handleSearchClick = () => {
    if (
      searchTerm &&
      searchTerm.length &&
      selectedIndustry &&
      selectedIndustry.length
    ) {
      setSearching(true)
      router.push(`/research/${searchTerm}?industry=${selectedIndustry}`)
    }
  }

  const handleIndustrySelectChange = (val: string) => {
    setSelectedIndustry(val)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className=" flex w-full max-w-3xl flex-col items-center gap-y-2 px-4 py-8">
        <p className="text-center  text-lg font-medium">
          Look up an idea and a corresponding industry{" "}
        </p>
        <div className="relative mt-8 flex w-full flex-row justify-center gap-x-4">
          <Input
            type="text"
            placeholder="Search an idea..."
            value={searchTerm}
            disabled={searching}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick()
              }
            }}
            onChange={handleSearch}
            className="focus:ring-primary-500 relative w-full max-w-md rounded-md px-4 py-2 shadow-md focus:outline-none focus:ring-2"
          />{" "}
          <IndustrySelectionMenu
            value={selectedIndustry}
            handleChange={handleIndustrySelectChange}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-3 lg:flex-col"></div>
      <Button
        onClick={handleSearchClick}
        size={"lg"}
        disabled={searching}
        variant={searching ? "outline" : "default"}
        className={`${
          searching ? "animate:ping" : ""
        } hover:bg-primary-600 focus:ring-primary-500  ml-2 w-1/3 rounded-md bg-primary px-4 py-2 text-white focus:outline-none focus:ring-2`}
      >
        Search
      </Button>
    </div>
  )
}

export default ValidateSearch
