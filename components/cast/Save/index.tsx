"use client"

import { useState } from "react"
import { Cast as CastType } from "@/types"

import useLinear from "@/hooks/linear/useLinear"
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
  const {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    handleClose,
    successfullySubmittedIssue,
  } = useLinear(cast.hash ?? "")

  return (
    <>
      <div className="md:hidden">
        <MobileSave
          handleSubmit={handleSubmitIssue}
          handleClose={() => {}}
          inputFields={fieldsForCreatingAnIssue}
          buttonText="Add to Linear"
          formTitle="Add to Linear"
          onClose={handleClose}
          submittingForm={submittingIssue}
          errorSubmittingForm={errorSubmittingIssue}
          successfullySubmittingForm={successfullySubmittedIssue}
          formDescription="Create an issue for this cast on your connected Linear account"
        />
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
