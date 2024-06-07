"use client"

import { Cast as CastType } from "@/types"

import useLinear from "@/hooks/linear/useLinear"
import MobileSave from "@/components/cast/Save/Mobile"
import { PopoverForm } from "@/components/popoverForm"

interface SaveCastProps {
  cast: CastType
}
const SaveCast = ({ cast }: SaveCastProps) => {
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
        <PopoverForm
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
    </>
  )
}

export default SaveCast
