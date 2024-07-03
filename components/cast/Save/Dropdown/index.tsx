"use client"

import useLinear from "@/hooks/linear/useLinear"
import useNotion from "@/hooks/notion/useNotion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  } = useLinear(cast.hash ?? "")

  const {
    fieldsForCreatingAnIssue: fieldForNotion,
    handleSubmitIssue: handleSubmitForNotion,
    submittingIssue: submittingToNotion,
    errorSubmittingIssue: errorSubmittingToNotion,
    handleClose: handleCloseNotion,
    successfullySubmittedIssue: successfullySubmittedToNotion,
  } = useNotion(cast.hash ?? "", notionResults)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative mr-4 border-none " asChild>
        <Button variant={"ghost"} className="relative">
          Save
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
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

          <PopoverForm
            handleSubmit={handleSubmitIssue}
            handleClose={() => {}}
            inputFields={fieldsForCreatingAnIssue}
            buttonText="Add to Notion"
            formTitle="Add to Notion"
            onClose={handleClose}
            submittingForm={submittingIssue}
            errorSubmittingForm={errorSubmittingIssue}
            successfullySubmittingForm={successfullySubmittedIssue}
            formDescription="Create a page or database entry for this cast on your connected Notion account"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SaveCastDropdown
