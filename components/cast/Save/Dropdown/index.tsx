"use client"

import { useBoundStore } from "@/store"

import useGithub from "@/hooks/github/useGithub"
import useLinear from "@/hooks/linear/useLinear"
import useNotion from "@/hooks/notion/useNotion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GithubSuccessUI from "@/components/cast/Save/Github/SuccessUI"
import LinearSuccessUI from "@/components/cast/Save/Linear/SuccessUI"
import NotionSuccessUI from "@/components/cast/Save/Notion/SuccessUI"
import { PopoverForm } from "@/components/popoverForm"

interface SaveCastDropdownProps {
  handleClick: (val: string) => void
  label: string
  value: string
  cast: any
  notionResults?: any
}
const SaveCastDropdown = ({
  handleClick,
  label,
  value,
  cast,
  notionResults,
}: SaveCastDropdownProps) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={!(isConnectedToLinear || isConnectedToNotion)}
        className="relative mr-4 border-none "
        asChild
      >
        <Button
          variant={"ghost"}
          disabled={!(isConnectedToLinear || isConnectedToNotion)}
          className="relative"
        >
          Save
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
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
            isDisabled={!isConnectedToNotion}
            successResult={notionSuccessResult}
            submittingForm={submittingToNotion}
            errorSubmittingForm={errorSubmittingToNotion}
            successfullySubmittingForm={successfullySubmittedToNotion}
            formDescription="Create a page for this cast on your connected Notion account"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SaveCastDropdown
