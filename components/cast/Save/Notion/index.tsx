"use client"

import { Cast as CastType } from "@/types"

import useNotion from "@/hooks/notion/useNotion"
import MobileSave from "@/components/cast/Save/Mobile/SheetElements"
import SuccessUI from "@/components/cast/Save/Notion/SuccessUI"

interface SaveCastProps {
  cast: CastType
  notionResults?: any
}
const SaveToNotion = ({ cast, notionResults }: SaveCastProps) => {
  const {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    handleClose,
    successResult,
    successfullySubmittedIssue,
  } = useNotion(cast.hash ?? "", notionResults)
  return (
    <>
      <div className="md:hidden">
        <MobileSave
          handleSubmit={handleSubmitIssue}
          handleClose={() => {}}
          inputFields={fieldsForCreatingAnIssue}
          buttonText="Add to Notion"
          formTitle="Add to Notion"
          successResult={successResult}
          cast={cast}
          SuccessUI={SuccessUI}
          onClose={handleClose}
          submittingForm={submittingIssue}
          errorSubmittingForm={errorSubmittingIssue}
          successfullySubmittingForm={successfullySubmittedIssue}
          successMessage="Successfully created a page!"
          formDescription="Create a page for this cast on your connected Notion account"
        />
      </div>
    </>
  )
}

export default SaveToNotion
