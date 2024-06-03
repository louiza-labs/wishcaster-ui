"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { Cast as CastType } from "@/types"

import Filters from "@/components/filters"
import SortCasts from "@/components/sort/SortCasts"

interface FilterBarProps {
  initialCasts: CastType[]
}
const FilterBar = ({ initialCasts }: FilterBarProps) => {
  const path = usePathname()
  const isOnTopicpage = useMemo(() => {
    return path && path.includes("topics")
  }, [path])
  const barText = isOnTopicpage ? "Filter" : "Sort & Filter"
  return (
    <div className="bg-background oveflow-x-scroll xl:h-18 sticky   top-0 flex w-full flex-row items-center justify-center gap-x-4 overflow-auto border-b p-2 lg:h-fit xl:justify-start xl:px-20">
      {<SortCasts asFilterBar={true} />}
      <Filters initialCasts={initialCasts} asFilterBar={true} />
    </div>
  )
}

export default FilterBar
