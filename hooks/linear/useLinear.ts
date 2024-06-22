"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

import { createLinearIssue } from "@/app/actions"

const useLinear = (castHash: string) => {
  const { data: sessionData } = useSession()
  const emailForLoggedInUser =
    sessionData && sessionData.user && sessionData.user.email
      ? sessionData.user.email
      : null

  const wcLinkForCast = `https://www.warpcast.com/${castHash}`

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState(`Issue Description for...
  ${wcLinkForCast}
    `)
  const [priority, setPriority] = useState(0)
  const [submittingIssue, setSubmittingIssue] = useState(false)
  const [errorSubmittingIssue, setErrorSubmittingIssue] = useState(false)
  const [successfullySubmittedIssue, setSuccessfullySubmittedIssue] =
    useState(false)
  const [projectId, setProjectId] = useState("")

  const handleTitleChange = (e: React.BaseSyntheticEvent) => {
    let titleVal = e.target.value
    setTitle(titleVal)
  }
  const handleDescriptionChange = (e: React.BaseSyntheticEvent) => {
    let descriptionVal = e.target.value

    setDescription(descriptionVal)
  }
  const handlePriorityChange = (e: React.BaseSyntheticEvent) => {
    let priorityVal = e.target.value

    setPriority(Number(priorityVal))
  }
  const handleProjectId = (e: React.BaseSyntheticEvent) => {
    let projectVal = e.target.value

    setProjectId(projectVal)
  }

  const fieldsForCreatingAnIssue = [
    {
      label: "Title",
      value: title,
      handleChange: handleTitleChange,
      id: "title",
      inputType: "text",
      placeholder: "Issue Title",
    },
    {
      label: "Description",
      value: description,
      handleChange: handleDescriptionChange,
      id: "description",
      inputType: "textarea",
      placeholder: `Issue Description for...
    ${wcLinkForCast}
      `,
    },
    {
      label: "Priority",
      value: priority,
      handleChange: handlePriorityChange,
      id: "priority",
      inputType: "number",
      placeholder: "Issue Priority (1-5)",
    },
    {
      label: "Project ID",
      value: projectId,
      handleChange: handleProjectId,
      id: "projectId",
      placeholder: "Project Id",
    },
  ]

  const handleClose = (val: boolean) => {
    if (!val) {
      setTitle("")
      setDescription(`Issue Description for...
      ${wcLinkForCast}
        `)
      setPriority(0)
      setProjectId("")
    }
  }

  const successMessage = ``

  const handleSubmitIssue = async () => {
    try {
      if (
        title &&
        title.length &&
        description &&
        description.length &&
        emailForLoggedInUser
      ) {
        setSubmittingIssue(true)
        setSuccessfullySubmittedIssue(false)
        setErrorSubmittingIssue(false)
        const res = await createLinearIssue(
          title,
          description,
          emailForLoggedInUser,
          priority,
          projectId
        )
        setSubmittingIssue(false)
        if (res) {
          setSuccessfullySubmittedIssue(true)
        }
      }
    } catch (e) {
      setErrorSubmittingIssue(true)
      setSubmittingIssue(false)
      console.error("error creating issue", e)
    }
  }

  return {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    successfullySubmittedIssue,
    handleClose,
  }
}

export default useLinear
