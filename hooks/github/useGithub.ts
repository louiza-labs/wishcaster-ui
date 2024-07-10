"use client"

import { useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { createGithubRepoForUser } from "@/app/actions"

const useGithub = (castHash: string) => {
  const wcLinkForCast = `https://www.warpcast.com/${castHash}`

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState(`Repo Description...`)
  const [isPrivate, setIsPrivate] = useState(false)
  const [homePage, setHomepage] = useState("")
  const [creatingRepo, setIsCreatingRepo] = useState(false)
  const [errorCreatingRepo, setErrorCreatingRepo] = useState(false)
  const [successfullyCreatedRepo, setSuccessfullyCreatedRepo] = useState(false)
  const [createdRepoResult, setCreatedRepoResult] = useState({})
  const { user } = useNeynarContext()
  const handleTitleChange = (e: React.BaseSyntheticEvent) => {
    let titleVal = e.target.value
    setTitle(titleVal)
  }
  const handleDescriptionChange = (e: React.BaseSyntheticEvent) => {
    let descriptionVal = e.target.value

    setDescription(descriptionVal)
  }
  const handleHomepageChange = (e: React.BaseSyntheticEvent) => {
    let homepageVal = e.target.value

    setHomepage(homepageVal)
  }
  const handleIsPrivate = (val: boolean) => {
    setIsPrivate(val)
  }

  const fieldsForCreatingAnIssue = [
    {
      label: "Repo Name",
      value: title,
      handleChange: handleTitleChange,
      id: "title",
      inputType: "text",
      placeholder: "Repo Title",
      isRequired: true,
    },
    {
      label: "Repo Description",
      value: description,
      handleChange: handleDescriptionChange,
      id: "description",
      inputType: "text",
      placeholder: `Repo Description...`,
      isRequired: false,
    },
    {
      label: "Is Private?",
      value: isPrivate,
      handleChange: handleIsPrivate,
      id: "private",
      inputType: "boolean",
      placeholder: "private",
      isRequired: true,
    },
    {
      label: "Homepage Url",
      value: homePage,
      handleChange: handleHomepageChange,
      id: "homepage",
      placeholder: "Homepage Url",
      isRequired: false,
    },
  ]

  const handleClose = (val: boolean) => {
    if (!val) {
      setTitle("")
      setDescription(`Issue Description for...
      ${wcLinkForCast}
        `)
      setDescription("")
      setIsPrivate(false)
      setHomepage("")
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
        isPrivate !== undefined &&
        user &&
        user.custody_address
      ) {
        setIsCreatingRepo(true)
        setSuccessfullyCreatedRepo(false)
        setErrorCreatingRepo(false)
        const res = await createGithubRepoForUser(
          user.custody_address,
          title,
          description,
          homePage,
          isPrivate
        )
        setIsCreatingRepo(false)
        if (res && res[0]) {
          setSuccessfullyCreatedRepo(true)
          setCreatedRepoResult(res[0])
        }
      }
    } catch (e) {
      setErrorCreatingRepo(true)
      setIsCreatingRepo(false)
      // console.error("error creating issue", e)
    }
  }

  return {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    successfullyCreatedRepo,
    errorCreatingRepo,
    creatingRepo,
    createdRepoResult,
    handleClose,
  }
}

export default useGithub
