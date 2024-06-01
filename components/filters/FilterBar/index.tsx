import { Cast as CastType } from "@/types"

import Filters from "@/components/filters"
import SortCasts from "@/components/sort/SortCasts"

interface FilterBarProps {
  initialCasts: CastType[]
}
const FilterBar = ({ initialCasts }: FilterBarProps) => {
  return (
    <div className="bg-background sticky top-0 flex w-full flex-row items-center justify-center gap-x-4 border-b p-2">
      <SortCasts asFilterBar={true} />
      <Filters initialCasts={initialCasts} asFilterBar={true} />
    </div>
  )
}

export default FilterBar
