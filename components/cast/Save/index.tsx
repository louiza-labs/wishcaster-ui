"use client"

import { useState } from "react"
import { Cast as CastType } from "@/types"

import SaveCastDropdown from "@/components/cast/Save/Dropdown"
import MobileSave from "@/components/cast/Save/Mobile"

interface SaveCastProps {
  cast: CastType
  notionResults?: any
}
const SaveCast = ({ cast, notionResults }: SaveCastProps) => {
  const [selectedSaveOption, setSelectedSaveOption] = useState("")

  const handleSaveOptionChange = (val: string) => {
    setSelectedSaveOption(val)
  }

  return (
    <>
      <div className="md:hidden">
        <MobileSave notionResults={notionResults} cast={cast} />
      </div>
      <div className="hidden md:block">
        <>
          <SaveCastDropdown
            value={selectedSaveOption}
            label={selectedSaveOption}
            handleClick={handleSaveOptionChange}
            notionResults={notionResults}
            cast={cast}
          />
        </>
      </div>
    </>
  )
}

export default SaveCast
