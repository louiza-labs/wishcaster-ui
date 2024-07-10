"use client"

import { useBoundStore } from "@/store"
import { Cast as CastType } from "@/types"

import useGithub from "@/hooks/github/useGithub"
import SuccessUI from "@/components/cast/Save/Github/SuccessUI"
import MobileSave from "@/components/cast/Save/Mobile/SheetElements"

interface SaveCastProps {
  cast: CastType
}
const SaveCastToGithub = ({ cast }: SaveCastProps) => {
  const {
    fieldsForCreatingAnIssue: fieldsForGithub,
    handleSubmitIssue: handleSubmitForGithub,
    successfullyCreatedRepo,
    errorCreatingRepo,
    creatingRepo,
    createdRepoResult,

    handleClose: handleCloseGithub,
  } = useGithub(cast.hash ?? "")
  const { isConnectedToNotion, isConnectedToGithub, isConnectedToLinear } =
    useBoundStore((state: any) => state)
  return (
    <>
      <div className="md:hidden">
        <MobileSave
          handleSubmit={handleSubmitForGithub}
          handleClose={() => {}}
          inputFields={fieldsForGithub}
          buttonText="Create Github Repo"
          formTitle="Create Github Repository"
          onClose={handleCloseGithub}
          SuccessUI={SuccessUI}
          cast={cast}
          successResult={createdRepoResult}
          submittingForm={creatingRepo}
          errorSubmittingForm={errorCreatingRepo}
          successfullySubmittingForm={successfullyCreatedRepo}
          successMessage="Successfully created a Repo!"
          formDescription="Create a Github Repository for this cast on your connected Github account"
        />
      </div>
    </>
  )
}

export default SaveCastToGithub
