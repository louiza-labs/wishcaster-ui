"use client"

import { useBoundStore } from "@/store"

import useGithub from "@/hooks/github/useGithub"
import useLinear from "@/hooks/linear/useLinear"
import useNotion from "@/hooks/notion/useNotion"
import GithubSuccessUI from "@/components/cast/Save/Github/SuccessUI"
import LinearSuccessUI from "@/components/cast/Save/Linear/SuccessUI"
import NotionSuccessUI from "@/components/cast/Save/Notion/SuccessUI"
import { PopoverForm } from "@/components/popoverForm"

interface SaveCastDropdownProps {
  cast: any
  notionResults?: any
}
const SaveCast = ({ cast, notionResults }: SaveCastDropdownProps) => {
  const {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    handleClose,
    successfullySubmittedIssue,
    successfulResult,
  } = useLinear(cast.hash ?? "")

  const {
    fieldsForCreatingAnIssue: fieldsForNotion,
    handleSubmitIssue: handleSubmitForNotion,
    submittingIssue: submittingToNotion,
    errorSubmittingIssue: errorSubmittingToNotion,
    handleClose: handleCloseNotion,
    successfullySubmittedIssue: successfullySubmittedToNotion,
    successResult: notionSuccessResult,
  } = useNotion(cast.hash ?? "", notionResults)

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
    <div className="flex flex-row items-center gap-x-4">
      <PopoverForm
        handleSubmit={handleSubmitForGithub}
        handleClose={() => {}}
        cast={cast}
        inputFields={fieldsForGithub}
        buttonText="Create Github Repo"
        formTitle="Create Github Repository"
        buttonImage={"/social-account-logos/github-mark.png"}
        onClose={handleCloseGithub}
        isDisabled={!isConnectedToGithub}
        SuccessUI={GithubSuccessUI}
        submittingForm={creatingRepo}
        errorSubmittingForm={errorCreatingRepo}
        isForCastPage={true}
        successResult={createdRepoResult}
        successfullySubmittingForm={successfullyCreatedRepo}
        formDescription="Create a Github Repository for this cast on your connected Github account"
      />
      <PopoverForm
        handleSubmit={handleSubmitIssue}
        handleClose={() => {}}
        inputFields={fieldsForCreatingAnIssue}
        buttonText="Add to Linear"
        cast={cast}
        formTitle="Add to Linear"
        successResult={successfulResult}
        onClose={handleClose}
        SuccessUI={LinearSuccessUI}
        isForCastPage={true}
        isDisabled={!isConnectedToLinear}
        buttonImage={"/social-account-logos/linear-company-icon.svg"}
        submittingForm={submittingIssue}
        errorSubmittingForm={errorSubmittingIssue}
        successfullySubmittingForm={successfullySubmittedIssue}
        formDescription="Create an issue for this cast on your connected Linear account"
      />

      <PopoverForm
        handleSubmit={handleSubmitForNotion}
        handleClose={() => {}}
        inputFields={fieldsForNotion}
        buttonText="Add to Notion"
        formTitle="Add to Notion"
        cast={cast}
        buttonImage={"/social-account-logos/notion-logo.png"}
        onClose={handleCloseNotion}
        SuccessUI={NotionSuccessUI}
        isForCastPage={true}
        isDisabled={!isConnectedToNotion}
        successResult={notionSuccessResult}
        submittingForm={submittingToNotion}
        errorSubmittingForm={errorSubmittingToNotion}
        successfullySubmittingForm={successfullySubmittedToNotion}
        formDescription="Create a page for this cast on your connected Notion account"
      />
    </div>
  )
}

export default SaveCast
