"use client"

import { Cast as CastType } from "@/types"

import useLinear from "@/hooks/linear/useLinear"
import SuccessUI from "@/components/cast/Save/Linear/SuccessUI"
import MobileSave from "@/components/cast/Save/Mobile/SheetElements"

interface SaveCastProps {
  cast: CastType
}
const SaveCastToLinear = ({ cast }: any) => {
  const {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    handleClose,
    successfullySubmittedIssue,
    successfulResult,
  } = useLinear(cast.hash ?? "", cast.username, cast.username !== undefined)

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
          cast={cast}
          successResult={successfulResult}
          SuccessUI={SuccessUI}
          submittingForm={submittingIssue}
          errorSubmittingForm={errorSubmittingIssue}
          successfullySubmittingForm={successfullySubmittedIssue}
          successMessage="Successfully created an issue!"
          formDescription="Create an issue for this post on your connected Linear account"
        />
      </div>
    </>
  )
}

export default SaveCastToLinear
