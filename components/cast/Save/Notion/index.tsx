"use client"

import { Cast as CastType } from "@/types"

import useNotion from "@/hooks/notion/useNotion"
import MobileSave from "@/components/cast/Save/Notion/Mobile"
import { PopoverForm } from "@/components/popoverForm"

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
          onClose={handleClose}
          submittingForm={submittingIssue}
          errorSubmittingForm={errorSubmittingIssue}
          successfullySubmittingForm={successfullySubmittedIssue}
          formDescription="Create a page for this cast on your connected Notion account"
        />
      </div>
      <div className="hidden md:block">
        <PopoverForm
          handleSubmit={handleSubmitIssue}
          handleClose={() => {}}
          inputFields={fieldsForCreatingAnIssue}
          buttonText="Add to Notion"
          formTitle="Add to Notion"
          hideButton={true}
          onClose={handleClose}
          defaultOpen={true}
          submittingForm={submittingIssue}
          errorSubmittingForm={errorSubmittingIssue}
          successfullySubmittingForm={successfullySubmittedIssue}
          formDescription="Create a page or database entry for this cast on your connected Notion account"
        />
      </div>
    </>
  )
}

export default SaveToNotion
