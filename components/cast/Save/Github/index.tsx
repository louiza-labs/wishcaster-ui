"use client"

import { useBoundStore } from "@/store"
import { Cast as CastType } from "@/types"

import useGithub from "@/hooks/github/useGithub"
import MobileSave from "@/components/cast/Save/Linear/Mobile"
import { PopoverForm } from "@/components/popoverForm"

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
          submittingForm={creatingRepo}
          errorSubmittingForm={errorCreatingRepo}
          successfullySubmittingForm={successfullyCreatedRepo}
          formDescription="Create a Github Repository for this cast on your connected Github account"
        />
      </div>
      <div className="hidden md:block">
        <PopoverForm
          handleSubmit={handleSubmitForGithub}
          handleClose={() => {}}
          inputFields={fieldsForGithub}
          buttonText="Create Github Repo"
          formTitle="Create Github Repository"
          buttonImage={"/social-account-logos/github-mark.png"}
          onClose={handleCloseGithub}
          isDisabled={!isConnectedToGithub}
          submittingForm={creatingRepo}
          errorSubmittingForm={errorCreatingRepo}
          successResult={createdRepoResult}
          successfullySubmittingForm={successfullyCreatedRepo}
          formDescription="Create a Github Repository for this cast on your connected Github account"
        />
      </div>
    </>
  )
}

export default SaveCastToGithub
